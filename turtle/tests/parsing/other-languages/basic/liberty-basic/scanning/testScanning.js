import { testMightBeLabelName } from
'./testMightBeLabelName.js';
import { testScan } from
'./testScan.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testMightBeLabelName,
		testScan
	], logger);
};