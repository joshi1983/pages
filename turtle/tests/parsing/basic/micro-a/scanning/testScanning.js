import { testMicroALabelToQBasicLabel } from './testMicroALabelToQBasicLabel.js';
import { testRectToQBasicLine } from './testRectToQBasicLine.js';
import { testRemovePtrStatements } from './testRemovePtrStatements.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testMicroALabelToQBasicLabel,
		testRectToQBasicLine,
		testRemovePtrStatements,
		testScan
	], logger);
};