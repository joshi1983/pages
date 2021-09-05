import { analyzeQuality } from
'../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from
'../../../modules/parsing/loggers/BufferedParseLogger.js';
import { CachedParseTree } from
'../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/CachedParseTree.js';
import { delay } from '../../../modules/delay.js';
import { fetchText } from
'../../../modules/fetchText.js';
import { parse } from
'../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { ProgressIndicator } from
'../../helpers/ProgressIndicator.js';
import { validateImportUrls } from
'./validateImportUrls.js';
import { validateModule } from
'../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/validateModule.js';

export async function testParseVariousJavaScriptFiles(logger) {
	const content = await fetchText('tests/data/js-filenames.txt');
	const cases = content.split('\n').map(line => line.trim());
	const filenameSet = new Set(cases);
	const indicator = new ProgressIndicator('testParseVariousJavaScriptFiles');
	logger.indicators.push(indicator);
	for (let index = 0; index < cases.length; index++) {
		const caseInfo = cases[index];
		const url = caseInfo;
		const plogger = prefixWrapper(`Case ${index}, url=${url}`, logger);
		const jsCode = await fetchText(url+'?cacheBuster=' + new Date().getTime());
		const parseResult = parse(jsCode);
		if (typeof parseResult !== 'object')
			plogger(`Expected an object but got ${parseResult}`);
		const parseLogger = new BufferedParseLogger();
		analyzeQuality(parseResult.root, parseLogger);
		if (url.startsWith('modules/') || url.startsWith('tests/')) {
			const cachedParseTree = new CachedParseTree(parseResult.root);
			validateModule(cachedParseTree, parseLogger);
			validateImportUrls(cachedParseTree, plogger, filenameSet, url);
		}
		if (parseLogger.hasLoggedErrors()) {
			plogger(`No errors expected but some found.  The messages were ${parseLogger.getMessages().map(m => m.msg + 'line ' + m.token.lineIndex).join(',')}`);
		}
		await delay(10);
		indicator.setProgressRatio(index / cases.length);
		indicator.setMessage(`${index} of ${cases.length}`);
	}
	indicator.completed();
};