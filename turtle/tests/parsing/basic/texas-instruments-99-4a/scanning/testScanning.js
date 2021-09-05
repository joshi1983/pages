import { testIsPrescanCommand } from './testIsPrescanCommand.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsPrescanCommand,
		testScan
	], logger);
};