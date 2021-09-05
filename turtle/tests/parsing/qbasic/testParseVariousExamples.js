import { analyzeQuality } from
'../../../modules/parsing/qbasic/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from
'../../../modules/parsing/loggers/BufferedParseLogger.js';
import { parse } from
'../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { indexToFilename, qbasicExamples } from
'../../helpers/parsing/qbasicExamples.js';

export function testParseVariousExamples(logger) {
	qbasicExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index} filename=${indexToFilename(index)}`, logger);
		const parseResult = parse(content);
		if (typeof parseResult !== 'object')
			plogger(`Expected parse to return an object but found ${result}`);
		else {
			const parseLogger = new BufferedParseLogger();
			analyzeQuality(parseResult.root, parseLogger);
			if (parseLogger.hasLoggedErrors()) {
				plogger(`No errors expected but some found.  The messages were ${parseLogger.getMessages().map(m => m.msg + 'line ' + m.token.lineIndex).join(',')}`);
			}
		}
	});
};