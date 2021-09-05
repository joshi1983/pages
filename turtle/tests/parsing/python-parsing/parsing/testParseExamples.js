import { analyzeQuality } from
'../../../../modules/parsing/python-parsing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { parse } from
'../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { TestParseLogger } from
'../../../helpers/TestParseLogger.js';

export function testParseExamples(logger) {
	pythonTurtleExampleFilesContent.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = parse(code);
		if (typeof result !== 'object')
			plogger(`Expected parse to always return an object but found ${result}`);
		else {
			const parseLogger = new TestParseLogger(plogger, code);
			analyzeQuality(result.root, parseLogger);
		}
	});
};