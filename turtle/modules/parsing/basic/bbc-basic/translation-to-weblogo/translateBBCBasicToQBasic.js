import { fetchJson } from '../../../../fetchJson.js';
import { insertSpaces } from './insertSpaces.js';
import { insertSpacesAfterIntegerLabels } from '../../helpers/insertSpacesAfterIntegerLabels.js';
import { genericProcessDecomposeAssignment } from '../../helpers/genericProcessDecomposeAssignment.js';
import { processBasicTo } from './processBasicTo.js';
import { processDraw } from './scantoken-processors/processDraw.js';
import { processEndProc } from './scantoken-processors/processEndProc.js';
import { processHexNumberLiterals } from './scantoken-processors/processHexNumberLiterals.js';
import { processHexToStringInPrintLiterals } from './scantoken-processors/processHexToStringInPrintLiterals.js';
import { processKeywords } from './processKeywords.js';
import { processLine } from './scantoken-processors/processLine.js';
import { processOperators } from './processOperators.js';
import { processPrintFormatVariableReferences } from './scantoken-processors/processPrintFormatVariableReferences.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { processRepeatToQBasic } from './scantoken-processors/processRepeatToQBasic.js';
import { processThenGoto } from '../../helpers/processThenGoto.js';
import { processTranslationToCLS } from './scantoken-processors/processTranslationToCLS.js';
import { removeLocalStatements } from './scantoken-processors/removeLocalStatements.js';
import { removeTrailingELSEInOnStatements } from './scantoken-processors/removeTrailingELSEInOnStatements.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';

const migrationData = await fetchJson('json/logo-migrations/basic/bbc-basic/BBC_Basic_to_QBasic.json');
const functionsMap = new Map();
for (const f of migrationData.functions) {
	if (f.to !== undefined)
		functionsMap.set(f.name.toLowerCase(), f.to);
}
const bbcTokenProcessors = [
	genericProcessDecomposeAssignment(migrationData),
	processDraw,
	processEndProc,
	processHexNumberLiterals,
	processHexToStringInPrintLiterals,
	processLine,
	processPrintFormatVariableReferences,
	processRepeatToQBasic,
	processThenGoto,
	processTranslationToCLS,
	removeLocalStatements,
	removeTrailingELSEInOnStatements
];

export function translateBBCBasicToQBasic(code) {
	const scanTokens = scan(insertSpaces(insertSpacesAfterIntegerLabels(code)));
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