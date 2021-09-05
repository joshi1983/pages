import { pythonPrintExecutionTests } from './pythonPrintExecutionTests.js';
import { testAssignmentTranslation } from './testAssignmentTranslation.js';
import { testBinaryOperatorTranslation } from './testBinaryOperatorTranslation.js';
import { testConstantTranslation } from './testConstantTranslation.js';
import { testDiscardedCodeTranslation } from './testDiscardedCodeTranslation.js';
import { testExecuteAssignments } from './testExecuteAssignments.js';
import { testExecuteForLoop } from './testExecuteForLoop.js';
import { testExecuteLiteralValues } from './testExecuteLiteralValues.js';
import { testExecuteOperators } from './testExecuteOperators.js';
import { testExecuteOrderOfOperation } from './testExecuteOrderOfOperation.js';
import { testForLoopTranslation } from './testForLoopTranslation.js';
import { testFunctionCallTranslation } from './testFunctionCallTranslation.js';
import { testFunctionDefinitionTranslation } from './testFunctionDefinitionTranslation.js';
import { testIfStatementTranslation } from './testIfStatementTranslation.js';
import { testParseTreeSimplifiers } from './parse-tree-simplifiers/testParseTreeSimplifiers.js';
import { testPrintTranslation } from './testPrintTranslation.js';
import { testShouldCommentLineBeRemoved } from './testShouldCommentLineBeRemoved.js';
import { testSublistTranslation } from './testSublistTranslation.js';
import { testTokenToWebLogoCode } from './testTokenToWebLogoCode.js';
import { testTranslateBadCode } from './testTranslateBadCode.js';
import { testTranslateExamplesContains } from './testTranslateExamplesContains.js';
import { testTranslateStringLiteral } from './testTranslateStringLiteral.js';
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
		testExecuteForLoop,
		testExecuteLiteralValues,
		testExecuteOperators,
		testExecuteOrderOfOperation,
		testForLoopTranslation,
		testFunctionCallTranslation,
		testFunctionDefinitionTranslation,
		testIfStatementTranslation,
		testParseTreeSimplifiers,
		testPrintTranslation,
		testShouldCommentLineBeRemoved,
		testSublistTranslation,
		testTokenToWebLogoCode,
		testTranslateBadCode,
		testTranslateExamplesContains,
		testTranslateStringLiteral,
		testTypeProcessors,
		testUnaryOperatorTranslation,
		testWebLogoSnippets,
		testWhileLoopTranslation,
	], logger);
};