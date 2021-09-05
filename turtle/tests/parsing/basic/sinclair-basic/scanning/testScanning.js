import { testRemoveSpacesInFunctionNames } from './testRemoveSpacesInFunctionNames.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testRemoveSpacesInFunctionNames,
		testScan
	], logger);
};