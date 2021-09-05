import { fetchJson } from
'../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processMigrateToVal } from
'../../helpers/processMigrateToVal.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { processThenGoto } from
'../../helpers/processThenGoto.js';
import { processToProc } from
'../../helpers/processToProc.js';
import { removePrescanCommands } from
'./scantoken-processors/removePrescanCommands.js';
import { removeRedundantCallTokens } from
'./scantoken-processors/removeRedundantCallTokens.js';
import { scan as qbScan } from
'../../qbasic/scanning/scan.js';
import { subendToEndSub } from
'./scantoken-processors/subendToEndSub.js';
import { subExitToExitSub } from
'./scantoken-processors/subExitToExitSub.js';
const migrationInfo = await fetchJson('json/logo-migrations/basic/texas-instruments-99-4a/migrationToQBasic.json');

const processors = [
	genericProcessTo(migrationInfo),
	processMigrateToVal(migrationInfo),
	processRemoveInMigration,
	processThenGoto,
	processToProc(migrationInfo),
	removePrescanCommands,
	removeRedundantCallTokens,
	subendToEndSub,
	subExitToExitSub
];

export function scan(code) {
	const tokens = qbScan(code);
	for (const processor of processors) {
		processor(tokens, migrationInfo);
	}

	return tokens;
};