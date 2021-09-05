import { fetchJson } from '../../../../fetchJson.js';
import { funcToDef } from './funcToDef.js';
import { microALabelToQBasicLabel } from './microALabelToQBasicLabel.js';
import { processOperators } from './processOperators.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { removePtrStatements } from './removePtrStatements.js';
import { removeWindowMessageBlocks } from './removeWindowMessageBlocks.js';
import { scan as scanQBasic } from '../../qbasic/scanning/scan.js';
import { simplifyParameterKeywords } from './simplifyParameterKeywords.js';
import { processStrDeclarations } from './processStrDeclarations.js';
import { varToDim } from './varToDim.js';

const migrationData = await fetchJson('json/logo-migrations/basic/micro-a/migrationToQBasic.json');

const processors = [
	funcToDef,
	microALabelToQBasicLabel,
	processOperators,
	processRemoveInMigration,
	processStrDeclarations,
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