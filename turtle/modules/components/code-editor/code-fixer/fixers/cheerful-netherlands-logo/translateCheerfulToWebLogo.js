import { fetchJson } from
'../../../../../fetchJson.js';
import { fixUsingParseTree } from
'./fixUsingParseTree.js';
import { formatCode } from
'../../../format/formatCode.js';
import { getCodeForReferencedProcedures } from
'./getCodeForReferencedProcedures.js';
import { isLineCapImportant } from
'./isLineCapImportant.js';
import { processElse } from
'./processElse.js';
import { processBracketedParameters } from './processBracketedParameters.js';
import { processRGBParameters } from './processRGBParameters.js';
import { processVariableReferences } from './processVariableReferences.js';
import { scanWithMigration } from '../helpers/scanWithMigration.js';
import { scanTokensToCode } from '../helpers/scanTokensToCode.js';

const migrationInfo = await fetchJson('json/logo-migrations/cheerfulNetherlandsLogo.json');

export function translateCheerfulToWebLogo(code) {
	const scanTokens = scanWithMigration(code, migrationInfo);
	processElse(scanTokens);
	processVariableReferences(scanTokens);
	let prefix = getCodeForReferencedProcedures(scanTokens);
	processBracketedParameters(scanTokens);
	processRGBParameters(scanTokens);
	code = scanTokensToCode(scanTokens);
	if (isLineCapImportant(scanTokens))
		prefix += `\nsetLineCap "round
setLineJoinStyle "round\n`;
	code = fixUsingParseTree(prefix + code);
	return formatCode(fixUsingParseTree(code));
};