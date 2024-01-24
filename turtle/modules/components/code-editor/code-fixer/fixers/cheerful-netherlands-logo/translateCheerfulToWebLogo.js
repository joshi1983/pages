import { fetchJson } from
'../../../../../fetchJson.js';
import { formatCode } from
'../../../format/formatCode.js';
import { processVariableReferences } from './processVariableReferences.js';
import { scanWithMigration } from '../helpers/scanWithMigration.js';
import { scanTokensToCode } from '../helpers/scanTokensToCode.js';

const migrationInfo = await fetchJson('json/logo-migrations/cheerfulNetherlandsLogo.json');

export function translateCheerfulToWebLogo(code) {
	const scanTokens = scanWithMigration(code, migrationInfo);
	processVariableReferences(scanTokens);
	code = scanTokensToCode(scanTokens);
	return formatCode(code);
};