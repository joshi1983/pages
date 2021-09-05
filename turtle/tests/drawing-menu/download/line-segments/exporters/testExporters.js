import { testCsv } from './testCsv.js';
import { testObj } from './testObj.js';
import { testPly } from './testPly.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testExporters(logger) {
	wrapAndCall([
		testCsv,
		testObj,
		testPly
	], logger);
};