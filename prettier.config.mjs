/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all', // ES2017+
  printWidth: 80,
  useTabs: false,
  endOfLine: 'lf',

  // Function and object formatting
  arrowParens: 'avoid',
  bracketSpacing: true,

  // JSX and object formatting
  jsxSingleQuote: true,
  quoteProps: 'as-needed',

  // Plugin support for Tailwind CSS
  plugins: ['prettier-plugin-tailwindcss'],
};
