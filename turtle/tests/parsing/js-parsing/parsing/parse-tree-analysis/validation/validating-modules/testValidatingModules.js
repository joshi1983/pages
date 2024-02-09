import { testValidateUndefinedIdentifiers } from './testValidateUndefinedIdentifiers.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testValidatingModules(logger) {
	wrapAndCall([
		testValidateUndefinedIdentifiers
	], logger);
};