import { testScan } from './testScan.js';
import { testScanExamples } from './testScanExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testScan,
		testScanExamples
	], logger);
};