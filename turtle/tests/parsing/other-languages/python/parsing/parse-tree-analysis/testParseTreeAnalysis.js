import { testIsMatchingAParameter } from './testIsMatchingAParameter.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testIsMatchingAParameter,
		], logger);
};