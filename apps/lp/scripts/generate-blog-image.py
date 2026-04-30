#!/usr/bin/env python3
"""
ブログ記事用のリアル写真風画像を Gemini API で生成するスクリプト

使い方:
  python scripts/generate-blog-image.py --prompt "プロンプト" --output public/blog/images/filename.webp

環境変数:
  GEMINI_API_KEY  — Google AI Studio の API キー
"""

import argparse
import base64
import os
import sys
import time
from pathlib import Path

MODEL = os.environ.get("NANO_BANANA_MODEL", "gemini-2.5-flash-image")
API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
MAX_RETRIES = 2

STYLE_REALISTIC = (
    "Realistic photograph, shot on Canon EOS R5 with 50mm f/1.4 lens, "
    "shallow depth of field, natural lighting. "
    "Photorealistic, editorial photography style. "
)

NO_TEXT = (
    "No text, no watermarks, no logos, no writing, no captions, "
    "no signs with writing, no product labels with text. "
    "Purely visual image. "
)


def get_api_key() -> str:
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        # ルートの .env を探す (apps/lp/scripts/ → apps/lp/ → apps/ → qm-web/)
        env_path = Path(__file__).resolve().parents[3] / ".env"
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    if k.strip() == "GEMINI_API_KEY":
                        key = v.strip()
                        break
    if not key:
        print("エラー: GEMINI_API_KEY が設定されていません", file=sys.stderr)
        sys.exit(1)
    return key


def generate_image(prompt: str, output_path: Path, aspect_ratio: str = "16:9") -> bool:
    import requests

    api_key = get_api_key()
    url = f"{API_BASE}/{MODEL}:generateContent?key={api_key}"

    full_prompt = f"{STYLE_REALISTIC}{NO_TEXT}{prompt}"

    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "responseMimeType": "text/plain",
            "imageConfig": {
                "aspectRatio": aspect_ratio,
            },
        },
    }

    for attempt in range(MAX_RETRIES + 1):
        if attempt > 0:
            print(f"  リトライ {attempt}/{MAX_RETRIES}...", file=sys.stderr)
            time.sleep(3)

        try:
            print(f"  画像生成中 (モデル: {MODEL})...", file=sys.stderr)
            r = requests.post(url, json=payload, timeout=120)
        except requests.exceptions.Timeout:
            print("  タイムアウト", file=sys.stderr)
            continue

        if r.status_code >= 500:
            print(f"  サーバーエラー ({r.status_code})", file=sys.stderr)
            continue

        if r.status_code != 200:
            print(f"  APIエラー ({r.status_code}): {r.text[:300]}", file=sys.stderr)
            return False

        data = r.json()
        candidates = data.get("candidates", [])
        if not candidates:
            print("  画像が生成されませんでした", file=sys.stderr)
            return False

        parts = candidates[0].get("content", {}).get("parts", [])
        for part in parts:
            inline = part.get("inlineData")
            if inline and inline.get("mimeType", "").startswith("image/"):
                img_bytes = base64.b64decode(inline["data"])
                output_path.parent.mkdir(parents=True, exist_ok=True)
                # 一旦保存してから Pillow で圧縮
                output_path.write_bytes(img_bytes)
                try:
                    from PIL import Image
                    img = Image.open(output_path)
                    if img.width > 1200:
                        ratio = 1200 / img.width
                        img = img.resize((1200, int(img.height * ratio)), Image.LANCZOS)
                    img.save(output_path, "webp", quality=80)
                except ImportError:
                    pass  # Pillow がなければ生データのまま
                final_kb = output_path.stat().st_size / 1024
                print(f"  保存: {output_path} ({final_kb:.0f} KB)", file=sys.stderr)
                return True

        print("  レスポンスに画像データがありません", file=sys.stderr)
        return False

    print("  リトライ上限に達しました", file=sys.stderr)
    return False


# プリセット: ブログ記事用の画像プロンプト
PRESETS = {
    "effects-are-amazing": {
        "prompt": (
            "A Japanese man in his 30s sitting on a park bench in the early morning "
            "after a jog. He is wearing a light running shirt, slightly sweaty, "
            "catching his breath with a calm confident smile. "
            "Dappled morning sunlight filters through trees behind him. "
            "Green park setting. Warm golden hour tones. "
            "Candid, unposed feel. 16:9 aspect ratio."
        ),
        "output": "public/blog/images/quit-drinking-effects-are-amazing.webp",
    },
    "effects-complete-guide": {
        "prompt": (
            "A Japanese man in his 30s in a bright living room, seen from the side, "
            "gazing out a large window with soft morning light streaming in. "
            "On the table in front of him, a notebook and pen sit beside a cup of coffee. "
            "Calm, reflective mood. Warm natural tones. "
            "Candid, unposed feel. 16:9 horizontal landscape aspect ratio."
        ),
        "output": "public/blog/images/quit-drinking-effects-complete-guide.webp",
    },
    "1-week": {
        "prompt": (
            "A bedside alarm clock showing 6:15 AM on a wooden nightstand. "
            "Soft morning sunlight streaming through sheer curtains in the background. "
            "Natural wrinkled white bed sheets visible. A glass of water on the nightstand. "
            "No person in frame. Quiet, peaceful bedroom atmosphere. "
            "Warm golden morning tones. Candid, lived-in feel. "
            "Shot with slight film grain. 16:9 horizontal landscape aspect ratio."
        ),
        "output": "public/blog/images/quit-drinking-1-week.webp",
    },
    "2-weeks": {
        "prompt": (
            "Close-up of a neatly packed Japanese bento lunch box on a kitchen counter, "
            "next to a stainless steel water bottle. Morning light from a nearby window. "
            "Background shows a slightly blurred home kitchen with utensils. "
            "No person in frame. Warm, homey atmosphere. "
            "The bento contains rice, tamagoyaki, vegetables. Everyday life feel. "
            "Shot with slight film grain. 16:9 horizontal landscape aspect ratio."
        ),
        "output": "public/blog/images/quit-drinking-2-weeks.webp",
    },
    "3-weeks-to-1-month": {
        "prompt": (
            "Close-up of a hand holding a glass of sparkling water with a lemon wedge "
            "at an izakaya counter. Warm amber bokeh lights in the blurred background. "
            "Other glasses and small dishes slightly visible out of focus. "
            "Evening atmosphere, cozy Japanese restaurant setting. "
            "Only the hand and glass are in focus. Candid documentary style. "
            "Shot with slight film grain. 16:9 horizontal landscape aspect ratio."
        ),
        "output": "public/blog/images/quit-drinking-3-weeks-to-1-month.webp",
    },
}


def main():
    parser = argparse.ArgumentParser(description="ブログ記事用リアル写真風画像を生成")
    parser.add_argument("--prompt", help="画像生成プロンプト (英語)")
    parser.add_argument("--output", "-o", type=Path, help="出力ファイルパス")
    parser.add_argument(
        "--preset",
        choices=list(PRESETS.keys()),
        help="プリセット名を指定して生成",
    )
    parser.add_argument(
        "--all-presets",
        action="store_true",
        help="全プリセットを一括生成",
    )
    parser.add_argument(
        "--aspect-ratio",
        default="16:9",
        help="画像のアスペクト比 (例: 16:9, 1:1, 4:3, 9:16)。デフォルト: 16:9",
    )
    args = parser.parse_args()

    # カレントディレクトリを apps/lp に設定
    lp_dir = Path(__file__).resolve().parents[1]

    if args.all_presets:
        for name, preset in PRESETS.items():
            print(f"\n[{name}]", file=sys.stderr)
            out = lp_dir / preset["output"]
            success = generate_image(preset["prompt"], out, args.aspect_ratio)
            if not success:
                print(f"  {name}: 失敗", file=sys.stderr)
        return

    if args.preset:
        preset = PRESETS[args.preset]
        out = args.output or (lp_dir / preset["output"])
        prompt = args.prompt or preset["prompt"]
    elif args.prompt and args.output:
        prompt = args.prompt
        out = args.output
    else:
        parser.print_help()
        print("\n使用例:", file=sys.stderr)
        print("  python scripts/generate-blog-image.py --preset effects-are-amazing", file=sys.stderr)
        print("  python scripts/generate-blog-image.py --all-presets", file=sys.stderr)
        print('  python scripts/generate-blog-image.py --prompt "..." -o output.webp', file=sys.stderr)
        return

    success = generate_image(prompt, out, args.aspect_ratio)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
