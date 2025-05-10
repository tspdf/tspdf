import eslint from '@eslint/js';
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  tseslint.configs.stylisticTypeChecked,
  {
    ignores: ['dist', "eslint.config.js", "vitest.workspace.ts", "vite.config.ts"],
  },
);
