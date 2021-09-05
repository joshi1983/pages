import { testEvaluation } from './evaluation/testEvaluation.js';
import { testIsLikelyJoss } from './testIsLikelyJoss.js';
import { testParsing } from './parsing/testParsing.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo} from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testJoss(logger) {
	wrapAndCall([
		testEvaluation,
		testIsLikelyJoss,
		testParsing,
		testScanning,
		testTranslationToWebLogo
	], logger);
};