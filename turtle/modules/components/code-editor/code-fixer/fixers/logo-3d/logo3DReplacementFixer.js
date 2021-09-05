import { fetchJson } from '../../../../../fetchJson.js';
import { processLogoMigration } from '../helpers/processLogoMigration.js';
const logo3DInfo = await fetchJson('json/logo-migrations/Logo_3D.json');

export function logo3DReplacementFixer(cachedParseTree, fixLogger) {
	processLogoMigration(cachedParseTree, fixLogger, logo3DInfo);
};