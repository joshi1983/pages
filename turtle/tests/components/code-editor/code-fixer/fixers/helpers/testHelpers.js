import { prefixWrapper } from '../../../../../helpers/prefixWrapper.js';
import { testFixDynamicScopes } from './testFixDynamicScopes.js';

export function testHelpers(logger) {
	testFixDynamicScopes(prefixWrapper('testFixDynamicScopes', logger));
};