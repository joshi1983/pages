import { testIsValidSubroutineName } from './testIsValidSubroutineName.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsValidSubroutineName,
		testScan
	], logger);
};