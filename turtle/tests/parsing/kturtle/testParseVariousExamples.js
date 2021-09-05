import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { parse } from
'../../../modules/parsing/kturtle/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { validateTokensByType } from
'../../../modules/parsing/kturtle/parsing/parse-tree-analysis/validation/validateTokensByType.js';

export function testParseVariousExamples(logger) {
	kturtleExampleFiles.forEach(function(content, index) {
		const plogger = prefixWrapper(`Example ${index}`, logger);
		const parseResult = parse(content);
		const parseLogger = new TestParseLogger(plogger, content);
		validateTokensByType(parseResult.root, parseLogger);
	});
};