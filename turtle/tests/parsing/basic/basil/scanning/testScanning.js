import { testRemovePreprocessorDirectives } from './testRemovePreprocessorDirectives.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testRemovePreprocessorDirectives,
		testScan
	], logger);
};