import { testNoThrownExceptions } from './testNoThrownExceptions.js';
import { testOperators } from
'./operators/testOperators.js';
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
import { testTranslateDeclarations } from
'./testTranslateDeclarations.js';
import { testTranslateExamples } from
'./testTranslateExamples.js';
import { testTranslateExecuteOperators } from
'./testTranslateExecuteOperators.js';
import { testTranslateExecutePrint } from
'./testTranslateExecutePrint.js';
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
		testNoThrownExceptions,
		testOperators,
		testTranslate,
		testTranslateAssignments,
		testTranslateBinaryOperators,
		testTranslateComments,
		testTranslateConditionalTernary,
		testTranslateDeclarations,
		testTranslateExamples,
		testTranslateExecuteOperators,
		testTranslateExecutePrint,
		testTranslateMethodCalls,
		testTranslateMethods,
		testTranslateTry,
		testTranslateUnaryOperators
	], logger);
};