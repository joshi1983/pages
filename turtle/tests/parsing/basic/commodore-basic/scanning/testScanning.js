import { testScanTokenProcessors } from './scantoken-processors/testScanTokenProcessors.js';
import { testScanToQBasicTokens } from './testScanToQBasicTokens.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testScanTokenProcessors,
		testScanToQBasicTokens
	], logger);
};
