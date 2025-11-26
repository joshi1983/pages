import { testExecuteDoWhile } from './testExecuteDoWhile.js';
import { testExecuteFor } from './testExecuteFor.js';
import { testExecuteIf } from './testExecuteIf.js';
import { testExecuteSwitch } from './testExecuteSwitch.js';
/*import { testExecuteWhile } from './testExecuteWhile.js';
import { testNoThrownExceptions } from './testNoThrownExceptions.js';
import { testOperators } from
'./operators/testOperators.js';
import { testSimplifying } from './simplifying/testSimplifying.js';
import { testTranslateProcessingToWebLogo } from
'./testTranslateProcessingToWebLogo.js';
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
import { testTranslateFor } from './testTranslateFor.js';*/
import { testTranslateMethodCalls } from
'./testTranslateMethodCalls.js';
/*import { testTranslateMethods } from
'./testTranslateMethods.js';
import { testTranslateTry } from
'./testTranslateTry.js';
import { testTranslateUnaryOperators } from
'./testTranslateUnaryOperators.js';
*/import { testTypeProcessors } from './type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecuteDoWhile,
		testExecuteFor,
		/*testExecuteIf,
		testExecuteSwitch,/*
		testExecuteWhile,
		testNoThrownExceptions,
		testOperators,
		testSimplifying,
		testTranslateProcessingToWebLogo,
		testTranslateAssignments,
		testTranslateBinaryOperators,
		testTranslateComments,
		testTranslateConditionalTernary,
		testTranslateDeclarations,
		testTranslateExamples,
		testTranslateExecuteOperators,
		testTranslateExecutePrint,
		testTranslateFor,
		*/testTranslateMethodCalls,
		/*testTranslateMethods,
		testTranslateTry,
		testTranslateUnaryOperators,*/
		testTypeProcessors
	], logger);
};