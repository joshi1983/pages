import { testIsCompleteArrow } from './testIsCompleteArrow.js'; 
import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testScan } from './testScan.js';
import { testScanVariousExamples } from './testScanVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCompleteArrow,
		testIsCompleteNumberLiteral,
		testIsIdentifier,
		testScan,
		testScanVariousExamples
	], logger);
};