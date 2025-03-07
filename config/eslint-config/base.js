/**@type {import('eslint').Linter.Config}*/
export const config = {
  extends: ['@rocketseat/eslint-config/react'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error'
  }
}
