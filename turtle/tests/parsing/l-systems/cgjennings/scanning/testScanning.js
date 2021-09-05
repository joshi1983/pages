import { testScan } from
'./testScan.js';
import { testScanVariousExamples } from
'./testScanVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testScan,
		testScanVariousExamples
	], logger);
};