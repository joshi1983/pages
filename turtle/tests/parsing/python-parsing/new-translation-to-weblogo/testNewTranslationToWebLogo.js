import { pythonPrintExecutionTests } from './pythonPrintExecutionTests.js';
import { testAssignmentTranslation } from './testAssignmentTranslation.js';
import { testBinaryOperatorTranslation } from './testBinaryOperatorTranslation.js';
import { testConstantTranslation } from './testConstantTranslation.js';
import { testDiscardedCodeTranslation } from './testDiscardedCodeTranslation.js';
import { testExecuteAssignments } from './testExecuteAssignments.js';
import { testExecuteLiteralValues } from './testExecuteLiteralValues.js';
import { testExecuteOperators } from './testExecuteOperators.js';
import { testForLoopTranslation } from './testForLoopTranslation.js';
import { testFunctionCallTranslation } from './testFunctionCallTranslation.js';
import { testFunctionDefinitionTranslation } from './testFunctionDefinitionTranslation.js';
import { testIfStatementTranslation } from './testIfStatementTranslation.js';
import { testPrintTranslation } from './testPrintTranslation.js';
import { testShouldCommentLineBeRemoved } from './testShouldCommentLineBeRemoved.js';
import { testSublistTranslation } from './testSublistTranslation.js';
import { testTokenToWebLogoCode } from './testTokenToWebLogoCode.js';
import { testTranslateExamplesContains } from './testTranslateExamplesContains.js';
import { testTypeProcessors } from './type-processors/testTypeProcessors.js';
import { testUnaryOperatorTranslation } from './testUnaryOperatorTranslation.js';
import { testWebLogoSnippets } from './testWebLogoSnippets.js';
import { testWhileLoopTranslation } from './testWhileLoopTranslation.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testNewTranslationToWebLogo(logger) {
	wrapAndCall([
		pythonPrintExecutionTests,
		testAssignmentTranslation,
		testBinaryOperatorTranslation,
		testConstantTranslation,
		testDiscardedCodeTranslation,
		testExecuteAssignments,
		testExecuteLiteralValues,
		testExecuteOperators,
		testForLoopTranslation,
		testFunctionCallTranslation,
		testFunctionDefinitionTranslation,
		testIfStatementTranslation,
		testPrintTranslation,
		testShouldCommentLineBeRemoved,
		testSublistTranslation,
		testTokenToWebLogoCode,
		testTranslateExamplesContains,
		testTypeProcessors,
		testUnaryOperatorTranslation,
		testWebLogoSnippets,
		testWhileLoopTranslation,
	], logger);
};