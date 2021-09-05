import { testValidation } from './validation/testValidation.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testValidation
	], logger);
};