module.exports = {
  "apps/web/**/*.{ts,tsx,js}": ["eslint --fix", "prettier --write"],
  "apps/lp/**/*.{ts,tsx,js,mdx}": ["eslint --fix", "prettier --write"],
};
