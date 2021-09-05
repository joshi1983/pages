import { fetchJson } from
'../../../../../fetchJson.js';
import { formatCode } from
'../../../format/formatCode.js';
import { scanWithMigration } from '../helpers/scanWithMigration.js';
import { scanTokensToCode } from '../helpers/scanTokensToCode.js';

const migrationInfo = await fetchJson('json/logo-migrations/cheerfulNetherlandsLogo.json');

export function translateToWebLogo(code) {
	const scanTokens = scanWithMigration(code, migrationInfo);
	code = scanTokensToCode(scanTokens);
	return formatCode(code);
};