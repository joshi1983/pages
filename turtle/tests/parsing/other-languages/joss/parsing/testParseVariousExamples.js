import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { jossExamples } from
'../../../../helpers/parsing/jossExamples.js';
import { parse } from
'../../../../../modules/parsing/other-languages/joss/parsing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

const examples = ArrayUtils.combine(jossExamples);

export function testParseVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const parseResult = parse(code);
			if (typeof parseResult !== 'object') {
				plogger(`An object was expected but found ${parseResult}`);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Exception/error thrown ${exceptionToString(e)}`);
		}
	});
};