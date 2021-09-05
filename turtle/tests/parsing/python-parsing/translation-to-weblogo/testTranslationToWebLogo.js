import { pythonPrintExecutionTests } from './pythonPrintExecutionTests.js';
import { testAssignmentTranslation } from './testAssignmentTranslation.js';
import { testBinaryOperatorTranslation } from './testBinaryOperatorTranslation.js';
import { testConstantTranslation } from './testConstantTranslation.js';
import { testDiscardedCodeTranslation } from './testDiscardedCodeTranslation.js';
import { testForLoopTranslation } from './testForLoopTranslation.js';
import { testFunctionCallTranslation } from './testFunctionCallTranslation.js';
import { testFunctionDefinitionTranslation } from './testFunctionDefinitionTranslation.js';
import { testIfStatementTranslation } from './testIfStatementTranslation.js';
import { testPrintTranslation } from './testPrintTranslation.js';
import { testShouldCommentLineBeRemoved } from './testShouldCommentLineBeRemoved.js';
import { testSublistTranslation } from './testSublistTranslation.js';
import { testTokenToWebLogoCode } from './testTokenToWebLogoCode.js';
import { testTypeProcessors } from './type-processors/testTypeProcessors.js';
import { testWebLogoSnippets } from './testWebLogoSnippets.js';
import { testWhileLoopTranslation } from './testWhileLoopTranslation.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		pythonPrintExecutionTests,
		testAssignmentTranslation,
		testBinaryOperatorTranslation,
		testConstantTranslation,
		testDiscardedCodeTranslation,
		testForLoopTranslation,
		testFunctionCallTranslation,
		testFunctionDefinitionTranslation,
		testIfStatementTranslation,
		testPrintTranslation,
		testShouldCommentLineBeRemoved,
		testSublistTranslation,
		testTokenToWebLogoCode,
		testTypeProcessors,
		testWebLogoSnippets,
		testWhileLoopTranslation,
	], logger);
};