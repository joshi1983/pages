import { analyzeCodeQuality } from
'../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { exceptionToString } from
'../../../modules/exceptionToString.js';
import { getProceduresMap } from
'../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { newTranslatePythonCodeToWebLogo } from
'../../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { pythonExamplesMap } from
'../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';

/*
Ideally, no example will translate to WebLogo code containing errors but we're not there yet.
We want to skip such analysis for files that we're tolerating errors from for the time being.
*/
const filenamesNotToAnalyze = new Set([
	'circle-string-art.py'
]);

export function testTranslateAllExamples(logger) {
	for (const [filename, code] of pythonExamplesMap) {
		const plogger = prefixWrapper(`Filename: ${filename}`, logger);
		try {
			const result = newTranslatePythonCodeToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`A string was expected to be returned but found ${result}`);
			else if (!filenamesNotToAnalyze.has(filename)) {
				const parseLogger = new TestParseLogger(plogger, result, true);
				const tree = LogoParser.getParseTree(result, parseLogger);
				if (tree !== undefined) {
					const proceduresMap = getProceduresMap(tree);
					const initialVariablesMap = new Map();
					analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
				}
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown while translating. e=${exceptionToString(e)}`);
		}
	}
};