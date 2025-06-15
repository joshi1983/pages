import { fetchJson } from '../../fetchJson.js';
import { processBasicTo } from './processBasicTo.js';
import { processKeywords } from './processKeywords.js';
import { processOperators } from './processOperators.js';
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
const operatorsMap = new Map();
if (migrationData.operators !== undefined) {
	for (const f of migrationData.operators) {
		if (f.toSymbol !== undefined)
			operatorsMap.set(f.symbol.toLowerCase(), f.toSymbol);
	}
}

export function translateBBCBasicToQBasic(code) {
	const scanTokens = scan(code);
	processRepeatToQBasic(scanTokens);
	processRemoveInMigration(scanTokens, migrationData);
	processKeywords(scanTokens, migrationData);
	processBasicTo(scanTokens, functionsMap);
	processOperators(scanTokens, operatorsMap);
	const result = scanTokensToCode(scanTokens);
	console.log(`returning ${result}`);
	return result;
};