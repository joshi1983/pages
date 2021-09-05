import { testGetExpectedChildrenLengthForToken } from './testGetExpectedChildrenLengthForToken.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testGetExpectedChildrenLengthForToken,
		testParseTreeAnalysis
	], logger);
};