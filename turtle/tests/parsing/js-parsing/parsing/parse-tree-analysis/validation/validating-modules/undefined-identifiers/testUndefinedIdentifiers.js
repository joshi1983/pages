import { testMightScopeInclude } from './testMightScopeInclude.js';
import { testValidatePredefinedIdentifiers } from './testValidatePredefinedIdentifiers.js';
import { wrapAndCall } from '../../../../../../../helpers/wrapAndCall.js';

export function testUndefinedIdentifiers(logger) {
	wrapAndCall([
		testMightScopeInclude,
		testValidatePredefinedIdentifiers
	], logger);
};