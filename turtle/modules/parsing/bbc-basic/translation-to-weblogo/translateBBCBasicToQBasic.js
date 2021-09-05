import { fetchJson } from '../../../fetchJson.js';
import { genericProcessDecomposeAssignment } from './genericProcessDecomposeAssignment.js';
import { processBasicTo } from './processBasicTo.js';
import { processDraw } from './processDraw.js';
import { processEndProc } from './processEndProc.js';
import { processGoto } from './processGoto.js';
import { processHexNumberLiterals } from './processHexNumberLiterals.js';
import { processHexToStringInPrintLiterals } from './processHexToStringInPrintLiterals.js';
import { processKeywords } from './processKeywords.js';
import { processLine } from './processLine.js';
import { processOperators } from './processOperators.js';
import { processPrintFormatVariableReferences } from './processPrintFormatVariableReferences.js';
import { processRemoveInMigration } from './processRemoveInMigration.js';
import { processRepeatToQBasic } from './processRepeatToQBasic.js';
import { processTranslationToCLS } from './processTranslationToCLS.js';
import { removeLocalStatements } from './removeLocalStatements.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../scanTokensToCode.js';

const migrationData = await fetchJson('json/logo-migrations/bbc-basic/BBC_Basic_to_QBasic.json');
const functionsMap = new Map();
for (const f of migrationData.functions) {
	if (f.to !== undefined)
		functionsMap.set(f.name.toLowerCase(), f.to);
}
const bbcTokenProcessors = [
	genericProcessDecomposeAssignment(migrationData),
	processDraw,
	processEndProc,
	processGoto,
	processHexNumberLiterals,
	processHexToStringInPrintLiterals,
	processLine,
	processPrintFormatVariableReferences,
	processRepeatToQBasic,
	processTranslationToCLS,
	removeLocalStatements
];

export function translateBBCBasicToQBasic(code) {
	const scanTokens = scan(code);
	for (const process of bbcTokenProcessors) {
		process(scanTokens);
	}
	processRemoveInMigration(scanTokens, migrationData);
	processKeywords(scanTokens, migrationData);
	processBasicTo(scanTokens, functionsMap);
	processOperators(scanTokens, migrationData);
	const result = scanTokensToCode(scanTokens);
	return result;
};