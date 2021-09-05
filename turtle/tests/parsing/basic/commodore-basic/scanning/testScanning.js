import { testScanTokenProcessors } from './scantoken-processors/testScanTokenProcessors.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testScanTokenProcessors
	], logger);
};
