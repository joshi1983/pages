import { getCachedParseTreeFromCode } from
'../../../../../../helpers/getCachedParseTreeFromCode.js';
import { fetchJson } from
'../../../../../../../modules/fetchJson.js';
import { fetchText } from
'../../../../../../../modules/fetchText.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';
import { ProgressIndicator } from
'../../../../../../helpers/ProgressIndicator.js';
import { simplifyAll } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyAll.js';
import { sleep } from
'../../../../../../helpers/sleep.js';
import { TestFixLogger } from
'../../../../../../helpers/TestFixLogger.js';
import { TestParseLogger } from
'../../../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

const examples = await fetchJson('json/scriptExamples.json');

function isLoggingMessage(msg) {
	return false;
}

async function testExample(exampleInfo, logger, url) {
	const code = await fetchText(url);
	const testParseLogger = new TestParseLogger(logger, code, false, isLoggingMessage);
	const fixLogger = new TestFixLogger(testParseLogger);
	const readCachedParseTree = getCachedParseTreeFromCode(code, logger, false);
	const cachedParseTree = new WriteOptimizedCachedParseTree(readCachedParseTree.root);
	simplifyAll(cachedParseTree, fixLogger);
	if (testParseLogger.hasLogged)
		logger(`No example should have something to be simplified but something was logged as a simplification.`);
}

export async function testSimplifyAllWithVariousExamples(logger) {
	const progressIndicator = new ProgressIndicator('testSimplifyAllWithVariousExamples');
	logger.indicators.push(progressIndicator);
	for (let i = 0; i < examples.length; i++) {
		const exampleInfo = examples[i];
		const url = `logo-scripts/${exampleInfo.filename}?${Math.random(1)}`;
		await testExample(exampleInfo, prefixWrapper(`Example ${url}`, logger), url);
		await sleep(20);

		/*
		Sleeping can help prevent an error mentioned at: 
		https://stackoverflow.com/questions/24122506/neterr-insufficient-resources-error-when-adding-numerous-img-elements-to-dom
		I was getting net::ERR_INSUFFICIENT_RESOURCES thrown without the sleep.
		*/
		progressIndicator.setProgressRatio(i / examples.length);
		progressIndicator.setMessage(`${i} of ${examples.length}`);
	}
	progressIndicator.completed();
};