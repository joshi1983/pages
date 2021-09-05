import { badExamples } from
'./badExamples.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { parse } from
'../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testParseBadQBasicCode(logger) {
	badExamples.forEach(function(s, index) {
		const plogger = prefixWrapper(`Case ${index}, s = ${s}`, logger);
		try {
			const result = parse(s);
			if (typeof result !== 'object')
				plogger(`Expected an object but found ${result}`);
		} catch (e) {
			console.error(e);
			plogger(`Exception thrown while parsing code. e=${exceptionToString(e)}`);
		}
	});
};