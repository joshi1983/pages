import { fetchJson } from '../../../../../fetchJson.js';
import { genericInsertArgBrackets } from
'../../helpers/genericInsertArgBrackets.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { joinGoto } from
'../../tektronix-405x-basic/scanning/joinGoto.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { removeSpacesInFunctionNames } from
'./removeSpacesInFunctionNames.js';
import { sanitizeMigrateToQBasicData } from
'../../helpers/sanitizeMigrateToQBasicData.js';
import { sanitizeQuotes } from
'../../qbasic/scanning/token-sanitizers/sanitizeQuotes.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';
import { translateOperators } from
'../../helpers/translateOperators.js';

const migrationData = await fetchJson('json/logo-migrations/basic/sinclair-basic/migrationToQBasic.json');
sanitizeMigrateToQBasicData(migrationData);
const functionsMap = new Map();
for (const funcInfo of migrationData.functions) {
	functionsMap.set(funcInfo.name.toLowerCase(), funcInfo);
}

const processors = [
	joinGoto, // We want 'goto' without a space.
	genericProcessTo(migrationData),
	processRemoveInMigration,
	removeSpacesInFunctionNames,
	sanitizeQuotes,
	translateOperators
];

function getFunctionInfo(name) {
	return functionsMap.get(name.toLowerCase());
}

export function scan(code) {
	const scanTokens = scanQBasic(code);
	genericInsertArgBrackets(scanTokens, getFunctionInfo);
	for (const processor of processors) {
		processor(scanTokens, migrationData);
	}
	return scanTokens;
};