import { testAddToAssignment } from './testAddToAssignment.js';
import { testAmosHexNumberLiteralsToQBasicHexLiterals } from './testAmosHexNumberLiteralsToQBasicHexLiterals.js';
import { testProcedureToSub } from './testProcedureToSub.js';
import { testRemoveUntranslatableScreenStatements } from
'./testRemoveUntranslatableScreenStatements.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testAddToAssignment,
		testAmosHexNumberLiteralsToQBasicHexLiterals,
		testProcedureToSub,
		testRemoveUntranslatableScreenStatements,
		testScan
	], logger);
};