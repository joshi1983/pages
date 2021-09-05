import { testProcessGoto } from './testProcessGoto.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testScanTokenProcessors(logger) {
	wrapAndCall([
		testProcessGoto
	], logger);
};