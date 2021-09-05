import { analyzeQuality } from
'../../../modules/parsing/pov-ray/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { BufferedParseLogger } from
'../../../modules/parsing/loggers/BufferedParseLogger.js';
import { parse } from '../../../modules/parsing/pov-ray/parse.js';
import { povRayExamples } from '../../helpers/parsing/povRayExamples.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { sanitize } from
'../../../modules/parsing/pov-ray/translation-to-weblogo/sanitization/sanitize.js';

export function testParseExamples(logger) {
	povRayExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, content=${content}`, logger);
		const result = parse(content);
		if (typeof result !== 'object')
			plogger(`Expected result to be an object but got ${result}`);
		else {
			const parseLogger = new BufferedParseLogger();
			sanitize(result.root);
			analyzeQuality(result.root, parseLogger);
			if (parseLogger.hasLoggedErrors()) {
				plogger(`No errors expected but some found.  The messages were ${parseLogger.getMessages().map(m => m.msg + 'line ' + m.token.lineIndex).join(',')}`);
			}
		}
	});
};