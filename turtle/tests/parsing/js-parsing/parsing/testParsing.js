import { testGetExpectedChildrenLengthForToken } from './testGetExpectedChildrenLengthForToken.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testGetExpectedChildrenLengthForToken
	], logger);
};