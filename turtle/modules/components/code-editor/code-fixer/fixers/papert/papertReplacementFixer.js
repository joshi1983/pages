import { fetchJson } from '../../../../../fetchJson.js';
import { processLogoMigration } from '../helpers/processLogoMigration.js';
import { sanitizeMigrationInfo } from '../helpers/sanitizeMigrationInfo.js';
const papertInfo = await fetchJson('json/logo-migrations/papert.json');
sanitizeMigrationInfo(papertInfo);

export function papertReplacementFixer(cachedParseTree, fixLogger) {
	processLogoMigration(cachedParseTree, fixLogger, papertInfo);
};