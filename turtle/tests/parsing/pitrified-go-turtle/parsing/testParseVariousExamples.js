import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { pitrifiedGoTurtleExamples } from
'../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

const examples = pitrifiedGoTurtleExamples.slice();

export function testParseVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const parseResult = parse(code);
			if (typeof parseResult !== 'object')
				plogger(`Expected an object but found ${parseResult}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error or exception thrown.  e=${exceptionToString(e)}`);
		}
		
	});
};