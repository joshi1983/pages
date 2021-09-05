import { testMicroALabelToQBasicLabel } from './testMicroALabelToQBasicLabel.js';
import { testProcessOperators } from './testProcessOperators.js';
import { testProcessStrDeclarations } from './testProcessStrDeclarations.js';
import { testRemovePtrStatements } from './testRemovePtrStatements.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testMicroALabelToQBasicLabel,
		testProcessOperators,
		testProcessStrDeclarations,
		testRemovePtrStatements,
		testScan
	], logger);
};