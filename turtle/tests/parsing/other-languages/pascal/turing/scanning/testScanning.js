import { testIsIdentifier } from
'./testIsIdentifier.js';
import { testIsMarkingEndOfToken } from
'./testIsMarkingEndOfToken.js';
import { testIsNumberLiteralStart } from
'./testIsNumberLiteralStart.js';
import { testScan } from
'./testScan.js';
import { testScanVariousExamples } from
'./testScanVariousExamples.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsNumberLiteralStart,
		testScan,
		testScanVariousExamples
	], logger);
};