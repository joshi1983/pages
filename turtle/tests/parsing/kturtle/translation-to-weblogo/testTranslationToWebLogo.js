import { testTranslate } from './testTranslate.js';
import { testTranslateWithComments } from './testTranslateWithComments.js';
import { testTranslateWithProcedures } from './testTranslateWithProcedures.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslate,
		testTranslateWithComments,
		testTranslateWithProcedures
	], logger);
};