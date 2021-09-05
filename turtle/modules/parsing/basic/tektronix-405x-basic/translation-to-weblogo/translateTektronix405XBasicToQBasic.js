import { areAllTrigCallsInDegrees } from './areAllTrigCallsInDegrees.js';
import { fetchJson } from '../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { replaceTrigFunctionNames } from './replaceTrigFunctionNames.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateOperators } from '../../helpers/translateOperators.js';
const migrationData = await fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBasic.json');

const processors = [
	genericProcessTo(migrationData),
	processRemoveInMigration,
	translateOperators
];

export function translateTektronix405XBasicToQBasic(code) {
	const scanTokens = scan(code);
	if (areAllTrigCallsInDegrees(scanTokens)) {
		replaceTrigFunctionNames(scanTokens, 'degree');
	}
	for (const processor of processors) {
		processor(scanTokens, migrationData);
	}
	const result = scanTokensToCode(scanTokens);
	return result;
};