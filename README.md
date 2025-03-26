# パッケージインストール方法
``yarn workspace {web or lp or @quitmate/ui} add {パッケージ}``
## 例
### 両方で使うUI関連
``yarn workspace @quitmate/ui add @radix-ui/react-slot class-variance-authority tailwind-merge``
### Webアプリでしか使わないもの
``yarn workspace web add next-themes lucide-react``
### LPでしか使わないもの
``yarn workspace lp add framer-motion``

# vercelデプロイ先
- [qm-web](https://qm-web.vercel.app/)
- [qm-lp](https://qm-lp.vercel.app/)