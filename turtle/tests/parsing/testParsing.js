import { exceptionToString } from '../../modules/exceptionToString.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../helpers/ProgressIndicator.js';
import { sleep } from '../helpers/sleep.js';
const modules = [
	'./testAsyncParser.js',
	'./testAsyncParseTask.js',
	'./basic/testBasic.js',
	'./testCharIndexToParseTreeTokenPosition.js',
	'./testCommandClass.js',
	'./testCompileCodeUsingInternalProc.js',
	'./compiling/testCompiling.js',
	'./testConvertParseTreeTokensToScanTokens.js',
	'./testCreateParameterizedGroups.js',
	'./testCreateParameterizedGroupsParseErrors.js',
	'./data-types/testDataTypesDirectory.js',
	'./testExampleScripts.js',
	'./execution/testExecution.js',
	'./testFixOperatorPrecedence.js',
	'./generic-parsing-utilities/testGenericParsingUtilities.js',
	'./testGetParseTree.js',
	'./testGetStartPositionOfToken.js',
	'./testGetTokensForParsing.js',
	'./testIsSupportedByHighOrderInvoke.js',
	'./testKeyword.js',
	'./loggers/testLoggers.js',
	'./testLogoParserFailing.js',
	'./testLogoParsingStates.js',
	'./testLogoScannerTokenSplitter.js',
	'./testMightBeRunnableCode.js',
	'./testOperators.js',
	'./testOrderOfOperation.js',
	'./other-languages/testOtherLanguages.js',
	'./testParseTree.js',
	'./parse-tree-analysis/testParseTreeAnalysis.js',
	'./testParseTreeColIndexes.js',
	'./testParseTreeToCodeWithComments.js',
	'./testParseTreeToCodeWithCommentsInsertSpace.js',
	'./testParseTreeToken.js',
	'./parse-tree-token/testParseTreeTokenDirectory.js',
	'./testProcedure.js',
	'./testScanner.js',
	'./scanning/testScanningDirectory.js',
	'./testScanVariousExamples.js',
	'./testScrapeProcedures.js',
	'./serialization/testSerialization.js',
	'./testToken.js',
	'./testUnsupportedCommand.js',
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

			if (key === undefined)
				logger(`Failed to calculate key for module ${modulePath}`);
			else {
				const m = (await import(modulePath));
				const result = m[key](prefixWrapper(key, logger));
				if (result instanceof Promise)
					await result;
			}
		}
		catch (e) {
			console.error(e);
			logger(`testParsing failed due to an error. e=${exceptionToString(e)}, modulePath=${modulePath}, i=${i}`);
		}
		await sleep(5);
	}
	progressIndicator.completed();
};