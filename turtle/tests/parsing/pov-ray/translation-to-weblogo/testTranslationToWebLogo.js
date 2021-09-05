import { testSanitization } from './sanitization/testSanitization.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateConditionalTernary } from './testTranslateConditionalTernary.js';
import { testTranslateDictionary } from './testTranslateDictionary.js';
import { testTranslateFunctionDefinitions } from './testTranslateFunctionDefinitions.js';
import { testTranslateSkySphere } from './testTranslateSkySphere.js';
import { testTranslateSphere } from './testTranslateSphere.js';
import { testTranslateToGetProperty } from './testTranslateToGetProperty.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testSanitization,
		testTranslate,
		testTranslateConditionalTernary,
		testTranslateDictionary,
		testTranslateFunctionDefinitions,
		testTranslateSkySphere,
		testTranslateSphere,
		testTranslateToGetProperty,
	], logger);
};