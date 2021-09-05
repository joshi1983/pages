import { testUndefinedIdentifiers } from './undefined-identifiers/testUndefinedIdentifiers.js';
import { testValidateUndefinedIdentifiers } from './testValidateUndefinedIdentifiers.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testValidatingModules(logger) {
	wrapAndCall([
		testUndefinedIdentifiers,
		testValidateUndefinedIdentifiers
	], logger);
};