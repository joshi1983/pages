import { testIsInFunctionBody } from './testIsInFunctionBody.js';
import { testValidation } from './validation/testValidation.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testIsInFunctionBody,
		testValidation
	], logger);
};