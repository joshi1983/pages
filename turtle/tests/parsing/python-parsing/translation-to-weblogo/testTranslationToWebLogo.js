import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { pythonPrintExecutionTests } from './pythonPrintExecutionTests.js';
import { testAssignmentTranslation } from './testAssignmentTranslation.js';
import { testDiscardedCodeTranslation } from './testDiscardedCodeTranslation.js';
import { testForLoopTranslation } from './testForLoopTranslation.js';
import { testFunctionCallTranslation } from './testFunctionCallTranslation.js';
import { testFunctionDefinitionTranslation } from './testFunctionDefinitionTranslation.js';
import { testIfStatementTranslation } from './testIfStatementTranslation.js';
import { testPrintTranslation } from './testPrintTranslation.js';
import { testTokenToWebLogoCode } from './testTokenToWebLogoCode.js';
import { testWebLogoSnippets } from './testWebLogoSnippets.js';
import { testWhileLoopTranslation } from './testWhileLoopTranslation.js';

export function testTranslationToWebLogo(logger) {
	pythonPrintExecutionTests(prefixWrapper('pythonPrintExecutionTests', logger));
	testAssignmentTranslation(prefixWrapper('testAssignmentTranslation', logger));
	testDiscardedCodeTranslation(prefixWrapper('testDiscardedCodeTranslation', logger));
	testForLoopTranslation(prefixWrapper('testForLoopTranslation', logger));
	testFunctionCallTranslation(prefixWrapper('testFunctionCallTranslation', logger));
	testFunctionDefinitionTranslation(prefixWrapper('testFunctionDefinitionTranslation', logger));
	testIfStatementTranslation(prefixWrapper('testIfStatementTranslation', logger));
	testPrintTranslation(prefixWrapper('testPrintTranslation', logger));
	testTokenToWebLogoCode(prefixWrapper('testTokenToWebLogoCode', logger));
	testWebLogoSnippets(prefixWrapper('testWebLogoSnippets', logger));
	testWhileLoopTranslation(prefixWrapper('testWhileLoopTranslation', logger));
};