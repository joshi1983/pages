import { testAnalyzeQuality } from './testAnalyzeQuality.js';
import { testValidatingModules } from './validating-modules/testValidatingModules.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testValidation(logger) {
	return wrapAndCall([
		testAnalyzeQuality,
		testValidatingModules
	], logger);
};