import { exceptionToString } from '../../modules/exceptionToString.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../helpers/ProgressIndicator.js';
import { sleep } from '../helpers/sleep.js';
const modules = [
	'./ada/testAda.js',
	'./asm-turtle/testASMTurtle.js',
	'./testAsyncParser.js',
	'./testAsyncParseTask.js',
	'./basic/testBasic.js',
	'./batch/testBatch.js',
	'./testCharIndexToParseTreeTokenPosition.js',
	'./testCommandClass.js',
	'./testCompileCodeUsingInternalProc.js',
	'./compiling/testCompiling.js',
	'./testConvertParseTreeTokensToScanTokens.js',
	'./testCreateParameterizedGroups.js',
	'./testCreateParameterizedGroupsParseErrors.js',
	'./css/testCSS.js',
	'./data-types/testDataTypesDirectory.js',
	'./testExampleScripts.js',
	'./execution/testExecution.js',
	'./testFixOperatorPrecedence.js',
	'./fms-logo/testFMSLogo.js',
	'./generic-parsing-utilities/testGenericParsingUtilities.js',
	'./testGetParseTree.js',
	'./testGetStartPositionOfToken.js',
	'./testGetTokensForParsing.js',
	'./hp-gl/testHPGL.js',
	'./holy-c/testHolyC.js',
	'./testIsSupportedByHighOrderInvoke.js',
	'./js-parsing/testJSParsing.js',
	'./testKeyword.js',
	'./kojo/testKojo.js',
	'./kturtle/testKTurtle.js',
	'./loggers/testLoggers.js',
	'./testLogoParserFailing.js',
	'./testLogoParsingStates.js',
	'./testLogoScannerTokenSplitter.js',
	'./l-systems/testLSystems.js',
	'./testMightBeRunnableCode.js',
	'./testOperators.js',
	'./testOrderOfOperation.js',
	'./testParseTree.js',
	'./parse-tree-analysis/testParseTreeAnalysis.js',
	'./testParseTreeColIndexes.js',
	'./testParseTreeToCodeWithComments.js',
	'./testParseTreeToCodeWithCommentsInsertSpace.js',
	'./testParseTreeToken.js',
	'./parse-tree-token/testParseTreeTokenDirectory.js',
	'./pitrified-go-turtle/testPitrifiedGoTurtle.js',
	'./pov-ray/testPovRay.js',
	'./testProcedure.js',
	'./processing/testProcessing.js',
	'./prolog/testProlog.js',
	'./python-parsing/testPythonParsing.js',
	'./rust-turtle/testRustTurtle.js',
	'./testScanner.js',
	'./scanning/testScanningDirectory.js',
	'./testScanVariousExamples.js',
	'./testScrapeProcedures.js',
	'./serialization/testSerialization.js',
	'./sonic-webturtle/testSonicWebTurtle.js',
	'./sugarlabs-turtle-blocks/testSugarLabsTurtleBlocks.js',
	'./testToken.js',
	'./testUnsupportedCommand.js'
];

export async function testParsing(logger) {
	const progressIndicator = new ProgressIndicator('testParsing');
	logger.indicators.push(progressIndicator);
	for (let i = 0; i < modules.length; i++) {
		const modulePath = modules[i];
		try {
			let index = modulePath.lastIndexOf('/');
			let keyWithExtension = modulePath.substring(index + 1);
			index = keyWithExtension.lastIndexOf('.');
			let key;
			if (index === -1)
				key = keyWithExtension;
			else
				key = keyWithExtension.substring(0, index);
			progressIndicator.setProgressRatio(i / modules.length);
			progressIndicator.setMessage(`${i} of ${modules.length}`);

			const m = (await import(modulePath));
			const result = m[key](prefixWrapper(key, logger));
			if (result instanceof Promise)
				await result;
		}
		catch (e) {
			console.error(e);
			logger(`testParsing failed due to an error. e=${exceptionToString(e)}, modulePath=${modulePath}, key=${key}, i=${i}`);
		}
		await sleep(5);
	}
	progressIndicator.completed();
};