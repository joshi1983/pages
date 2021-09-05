import { analyzeQuality } from
'../../../../../../modules/parsing/other-languages/pascal/turing/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { exceptionToString } from
'../../../../../../modules/exceptionToString.js';
import { parse } from
'../../../../../../modules/parsing/other-languages/pascal/turing/parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../../../../helpers/TestParseLogger.js';
import { turingExamples } from
'../../../../../helpers/parsing/pascal/turingExamples.js';

export function testParseVariousExamples(logger) {
	turingExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = parse(code);
			if (typeof result !== 'object')
				plogger(`parse should always return an object but found ${result}`);
			else {
				const parseLogger = new TestParseLogger(plogger, code);
				analyzeQuality(result.root, parseLogger);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown. e=${exceptionToString(e)}`);
		}
	});
};