/*import { testASMTurtle } from './asm-turtle/testASMTurtle.js';
import { testAsyncParser } from './testAsyncParser.js';
import { testAsyncParseTask } from './testAsyncParseTask.js';
*/import { testBasic } from './basic/testBasic.js';
import { testBatch } from './batch/testBatch.js';
/*import { testCharIndexToParseTreeTokenPosition } from './testCharIndexToParseTreeTokenPosition.js';
import { testCommandClass } from './testCommandClass.js';
import { testCompileCodeUsingInternalProc } from './testCompileCodeUsingInternalProc.js';
import { testCompiling } from './compiling/testCompiling.js';
import { testConvertParseTreeTokensToScanTokens } from './testConvertParseTreeTokensToScanTokens.js';
import { testCreateParameterizedGroups } from './testCreateParameterizedGroups.js';
import { testCreateParameterizedGroupsParseErrors } from './testCreateParameterizedGroupsParseErrors.js';
import { testCSS } from './css/testCSS.js';
import { testDataTypesDirectory } from './data-types/testDataTypesDirectory.js';
import { testExampleScripts } from './testExampleScripts.js';
import { testExecution } from './execution/testExecution.js';
import { testFixOperatorPrecedence } from './testFixOperatorPrecedence.js';
import { testFMSLogo } from './fms-logo/testFMSLogo.js';
import { testGenericParsingUtilities } from './generic-parsing-utilities/testGenericParsingUtilities.js';
import { testGetParseTree } from './testGetParseTree.js';
import { testGetStartPositionOfToken } from './testGetStartPositionOfToken.js';
import { testGetTokensForParsing } from './testGetTokensForParsing.js';
*/import { testHolyC } from './holy-c/testHolyC.js';/*
import { testIsSupportedByHighOrderInvoke } from './testIsSupportedByHighOrderInvoke.js';
import { testJSParsing } from './js-parsing/testJSParsing.js';
import { testKeyword } from './testKeyword.js';
import { testKTurtle } from './kturtle/testKTurtle.js';
import { testLoggers } from './loggers/testLoggers.js';
import { testLogoParserFailing } from './testLogoParserFailing.js';
import { testLogoParsingStates } from './testLogoParsingStates.js';
import { testLogoScannerTokenSplitter } from './testLogoScannerTokenSplitter.js';
import { testLSystems } from './l-systems/testLSystems.js';
import { testMightBeRunnableCode } from './testMightBeRunnableCode.js';
import { testOperators } from './testOperators.js';
import { testOrderOfOperation } from './testOrderOfOperation.js';
import { testParseTree } from './testParseTree.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseTreeColIndexes } from './testParseTreeColIndexes.js';
import { testParseTreeToCodeWithComments } from './testParseTreeToCodeWithComments.js';
import { testParseTreeToCodeWithCommentsInsertSpace } from './testParseTreeToCodeWithCommentsInsertSpace.js';
import { testParseTreeToken } from './testParseTreeToken.js';
import { testParseTreeTokenDirectory } from './parse-tree-token/testParseTreeTokenDirectory.js';
import { testPitrifiedGoTurtle } from './pitrified-go-turtle/testPitrifiedGoTurtle.js';
import { testPovRay } from './pov-ray/testPovRay.js';
import { testProcedure } from './testProcedure.js';
*/import { testProcessing } from './processing/testProcessing.js';
/*import { testPythonParsing } from './python-parsing/testPythonParsing.js';
import { testScanner } from './testScanner.js';
import { testScanningDirectory } from './scanning/testScanningDirectory.js';
import { testScanVariousExamples } from './testScanVariousExamples.js';
import { testScrapeProcedures } from './testScrapeProcedures.js';
import { testSerialization } from './serialization/testSerialization.js';
import { testSonicWebTurtle } from './sonic-webturtle/testSonicWebTurtle.js';
import { testSugarLabsTurtleBlocks } from './sugarlabs-turtle-blocks/testSugarLabsTurtleBlocks.js';
import { testToken } from './testToken.js';
import { testUnsupportedCommand } from './testUnsupportedCommand.js';
*/import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		/*testASMTurtle,
		testAsyncParser,
		testAsyncParseTask,
		*/testBasic,
		testBatch,
		/*testCharIndexToParseTreeTokenPosition,
		testCommandClass,
		testCompileCodeUsingInternalProc,
		testCompiling,
		testConvertParseTreeTokensToScanTokens,
		testCreateParameterizedGroups,
		testCreateParameterizedGroupsParseErrors,
		testCSS,
		testDataTypesDirectory,
		testExampleScripts,
		testExecution,
		testFixOperatorPrecedence,
		testFMSLogo,
		testGenericParsingUtilities,
		testGetParseTree,
		testGetStartPositionOfToken,
		testGetTokensForParsing,
		*/testHolyC,/*
		testIsSupportedByHighOrderInvoke,
		testJSParsing,
		testKeyword,
		testKTurtle,
		testLoggers,
		testLogoParserFailing,
		testLogoParsingStates,
		testLogoScannerTokenSplitter,
		testLSystems,
		testMightBeRunnableCode,
		testOperators,
		testOrderOfOperation,
		testParseTree,
		testParseTreeAnalysis,
		testParseTreeColIndexes,
		testParseTreeToCodeWithComments,
		testParseTreeToCodeWithCommentsInsertSpace,
		testParseTreeToken,
		testParseTreeTokenDirectory,
		testPitrifiedGoTurtle,
		testPovRay,
		testProcedure,
		*/testProcessing,
		/*testPythonParsing,
		testScanner,
		testScanningDirectory,
		testScanVariousExamples,
		testScrapeProcedures,
		testSerialization,
		testSonicWebTurtle,
		testSugarLabsTurtleBlocks,
		testToken,
		testUnsupportedCommand*/
	], logger);
};