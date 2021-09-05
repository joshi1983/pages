import { fetchJson } from '../../../../fetchJson.js';
import { funcToDef } from './funcToDef.js';
import { microALabelToQBasicLabel } from './microALabelToQBasicLabel.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { rectToQBasicLine } from './rectToQBasicLine.js';
import { removePtrStatements } from './removePtrStatements.js';
import { removeWindowMessageBlocks } from './removeWindowMessageBlocks.js';
import { scan as scanQBasic } from '../../qbasic/scanning/scan.js';
import { simplifyParameterKeywords } from './simplifyParameterKeywords.js';
import { varToDim } from './varToDim.js';

const migrationData = await fetchJson('json/logo-migrations/basic/micro-a/migrationToQBasic.json');

const processors = [
	funcToDef,
	microALabelToQBasicLabel,
	processRemoveInMigration,
	rectToQBasicLine,
	removePtrStatements,
	removeWindowMessageBlocks,
	simplifyParameterKeywords,
	varToDim
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens, migrationData);
	}
	return scanTokens;
};