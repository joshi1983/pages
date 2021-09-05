import { testParseFuncCall } from './testParseFuncCall.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testParseFuncCall
	], logger);
};