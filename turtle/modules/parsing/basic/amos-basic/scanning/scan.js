import { addToAssignment } from './addToAssignment.js';
import { amosHexNumberLiteralsToQBasicHexLiterals } from './amosHexNumberLiteralsToQBasicHexLiterals.js';
import { fetchJson } from '../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { procedureToSub } from './procedureToSub.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { removeUntranslatableScreenStatements } from
'./removeUntranslatableScreenStatements.js';
import { scan as scanQBasic } from '../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/amos-basic/migrationToQBasic.json');

const processors = [
	addToAssignment,
	amosHexNumberLiteralsToQBasicHexLiterals,
	genericProcessTo(migrationData),
	processRemoveInMigration,
	procedureToSub,
	removeUntranslatableScreenStatements
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens, migrationData);
	}
	return scanTokens;
};