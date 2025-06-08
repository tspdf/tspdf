import { config } from '@tspdf/eslint-config/base';
import { configFilesConfig } from '@tspdf/eslint-config/config-files';

/** @type {import("eslint").Linter.Config[]} */
export default [...configFilesConfig, ...config];
