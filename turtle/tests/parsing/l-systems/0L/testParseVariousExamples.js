import { analyzeQuality } from
'../../../../modules/parsing/l-systems/0L/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { badCodeExamples } from
'./badCodeExamples.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { parse } from
'../../../../modules/parsing/l-systems/0L/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../../helpers/TestParseLogger.js';
import { zeroLExamples } from
'../../../helpers/parsing/l-systems/zeroLExamples.js';

export function testParseVariousExamples(logger) {
	const cases = [];
	zeroLExamples.forEach(function(code) {
		cases.push({
			'code': code,
			'isValid': true
		});
	});
	badCodeExamples.forEach(function(code) {
		cases.push({
			'code': code,
			'isValid': false
		});
	});
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		try {
			const parseResult = parse(caseInfo.code);
			if (typeof parseResult !== 'object')
				plogger(`Expected an object but found ${parseResult}`);
			if (!(parseResult.comments instanceof Array))
				plogger(`comments should be an Array but found ${parseResult.comments}`);
			if (caseInfo.isValid) {
				const parseLogger = new TestParseLogger(plogger, caseInfo.code);
				analyzeQuality(parseResult.root, parseLogger);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
};