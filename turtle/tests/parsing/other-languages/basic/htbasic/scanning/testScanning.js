import { testIsIdentifier } from
'./testIsIdentifier.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsIdentifier,
		testScan
	], logger);
};