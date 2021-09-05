import { testValidatePredefinedIdentifiers } from './testValidatePredefinedIdentifiers.js';
import { wrapAndCall } from '../../../../../../../helpers/wrapAndCall.js';

export function testUndefinedIdentifiers(logger) {
	wrapAndCall([
		testValidatePredefinedIdentifiers
	], logger);
};