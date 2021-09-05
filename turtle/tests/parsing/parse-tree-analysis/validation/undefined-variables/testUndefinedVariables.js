import { testGetVariableReferencesNotInitiallyDefined } from './testGetVariableReferencesNotInitiallyDefined.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testUndefinedVariables(logger) {
	wrapAndCall([
		testGetVariableReferencesNotInitiallyDefined
	], logger);
};