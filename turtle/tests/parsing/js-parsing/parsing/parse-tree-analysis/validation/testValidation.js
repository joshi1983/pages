import { testValidatingModules } from './validating-modules/testValidatingModules.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testValidation(logger) {
	wrapAndCall([
		testValidatingModules
	], logger);
};