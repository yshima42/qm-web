module.exports = {
    'apps/web/**/*.{ts,tsx,js}': ['eslint --fix', 'prettier --write'],
    'apps/lp/**/*.{ts,tsx,js}': ['cd apps/lp && eslint --fix', 'prettier --write'],
  };