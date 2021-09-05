import { fetchJson } from '../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { removeSpacesInFunctionNames } from
'../scanning/removeSpacesInFunctionNames.js';
import { scan as scanQBasic } from '../../qbasic/scanning/scan.js';
import { translateOperators } from '../../helpers/translateOperators.js';

const migrationData = await fetchJson('json/logo-migrations/basic/sinclair-basic/migrationToQBasic.json');

const processors = [
	genericProcessTo(migrationData),
	processRemoveInMigration,
	removeSpacesInFunctionNames,
	translateOperators
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens, migrationData);
	}
	return scanTokens;
};