import { testGetTokensByType } from './testGetTokensByType.js';
import { testGetTokensByTypes } from './testGetTokensByTypes.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testCachedParseTreeDirectory(logger) {
	testGetTokensByType(prefixWrapper('testGetTokensByType', logger));
	testGetTokensByTypes(prefixWrapper('testGetTokensByTypes', logger));
};