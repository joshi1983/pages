import { testUndefinedIdentifiers } from './undefined-identifiers/testUndefinedIdentifiers.js';
import { testUnusedIdentifiers } from './unused-identifiers/testUnusedIdentifiers.js';
import { testValidateUndefinedIdentifiers } from './testValidateUndefinedIdentifiers.js';
import { testValidateUnusedIdentifiers } from './testValidateUnusedIdentifiers.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testValidatingModules(logger) {
	wrapAndCall([
		testUndefinedIdentifiers,
		testUnusedIdentifiers,
		testValidateUndefinedIdentifiers,
		testValidateUnusedIdentifiers
	], logger);
};