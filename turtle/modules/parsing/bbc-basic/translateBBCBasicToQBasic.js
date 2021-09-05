import { fetchJson } from '../../fetchJson.js';
import { processBasicTo } from './processBasicTo.js';
import { processDraw } from './processDraw.js';
import { processGoto } from './processGoto.js';
import { processKeywords } from './processKeywords.js';
import { processLine } from './processLine.js';
import { processOperators } from './processOperators.js';
import { processPrintFormatVariableReferences } from './processPrintFormatVariableReferences.js';
import { processRemoveInMigration } from './processRemoveInMigration.js';
import { processRepeatToQBasic } from './processRepeatToQBasic.js';
import { scan } from '../qbasic/scanning/scan.js';
import { scanTokensToCode } from './scanTokensToCode.js';

const migrationData = await fetchJson('json/logo-migrations/bbc-basic/BBC_Basic_to_QBasic.json');
const functionsMap = new Map();
for (const f of migrationData.functions) {
	if (f.to !== undefined)
		functionsMap.set(f.name.toLowerCase(), f.to);
}
const bbcTokenProcessors = [
	processDraw,
	processGoto,
	processLine,
	processPrintFormatVariableReferences,
	processRepeatToQBasic
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