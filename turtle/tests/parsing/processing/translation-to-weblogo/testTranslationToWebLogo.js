import { testTranslate } from
'./testTranslate.js';
import { testTranslateAssignments } from
'./testTranslateAssignments.js';
import { testTranslateBinaryOperators } from
'./testTranslateBinaryOperators.js';
import { testTranslateComments } from
'./testTranslateComments.js';
import { testTranslateConditionalTernary } from
'./testTranslateConditionalTernary.js';
import { testTranslateExamples } from
'./testTranslateExamples.js';
import { testTranslateMethodCalls } from
'./testTranslateMethodCalls.js';
import { testTranslateMethods } from
'./testTranslateMethods.js';
import { testTranslateTry } from
'./testTranslateTry.js';
import { testTranslateUnaryOperators } from
'./testTranslateUnaryOperators.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslate,
		testTranslateAssignments,
		testTranslateBinaryOperators,
		testTranslateComments,
		testTranslateConditionalTernary,
		testTranslateExamples,
		testTranslateMethodCalls,
		testTranslateMethods,
		testTranslateTry,
		testTranslateUnaryOperators
	], logger);
};