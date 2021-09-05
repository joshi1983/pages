import { fetchJson } from
'../../../../../fetchJson.js';
import { formatCode } from
'../../../format/formatCode.js';
import { getCodeForReferencedProcedures } from
'./getCodeForReferencedProcedures.js';
import { processVariableReferences } from './processVariableReferences.js';
import { scanWithMigration } from '../helpers/scanWithMigration.js';
import { scanTokensToCode } from '../helpers/scanTokensToCode.js';

const migrationInfo = await fetchJson('json/logo-migrations/cheerfulNetherlandsLogo.json');

export function translateCheerfulToWebLogo(code) {
	const scanTokens = scanWithMigration(code, migrationInfo);
	processVariableReferences(scanTokens);
	const prefix = getCodeForReferencedProcedures(scanTokens);
	code = scanTokensToCode(scanTokens);
	return formatCode(prefix + code);
};