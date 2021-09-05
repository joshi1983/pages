import { testGetTokensByType } from './testGetTokensByType.js';
import { testGetTokensByTypes } from './testGetTokensByTypes.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCachedParseTreeDirectory(logger) {
	wrapAndCall([
		testGetTokensByType,
		testGetTokensByTypes
	], logger);
};