/**
 * rehype-collapsible-references
 *
 * 章本文の `<h2>参考文献</h2>` または `<h2>References</h2>` を見つけて、
 * 該当見出しと続く要素群（次の h2 が現れるまで、または末尾まで）を
 * `<details><summary>...</summary>...</details>` でラップする rehype プラグイン。
 *
 * 教科書の章末の参考文献リストを、デフォルトで畳んだ状態で表示できるようにする。
 */

const REFERENCE_HEADINGS = ["参考文献", "References", "参考", "Bibliography"];

function getHeadingText(node) {
  if (!node || node.type !== "element" || node.tagName !== "h2") return null;
  const child = node.children?.[0];
  if (child?.type === "text") return child.value.trim();
  // 念のため: <h2>内に複数子要素がある場合は連結
  if (Array.isArray(node.children)) {
    return node.children
      .map((c) => (c.type === "text" ? c.value : ""))
      .join("")
      .trim();
  }
  return null;
}

export default function rehypeCollapsibleReferences() {
  return (tree) => {
    if (!tree || !Array.isArray(tree.children)) return;

    const newChildren = [];
    let i = 0;

    while (i < tree.children.length) {
      const node = tree.children[i];
      const headingText = getHeadingText(node);

      if (headingText && REFERENCE_HEADINGS.includes(headingText)) {
        // 続く要素を、次の h2 か末尾まで集める
        const detailsChildren = [];
        i++;
        while (i < tree.children.length) {
          const next = tree.children[i];
          if (next.type === "element" && next.tagName === "h2") break;
          detailsChildren.push(next);
          i++;
        }

        newChildren.push({
          type: "element",
          tagName: "details",
          properties: { className: ["references-details"] },
          children: [
            {
              type: "element",
              tagName: "summary",
              properties: { className: ["references-summary"] },
              children: [{ type: "text", value: headingText }],
            },
            ...detailsChildren,
          ],
        });
      } else {
        newChildren.push(node);
        i++;
      }
    }

    tree.children = newChildren;
  };
}
