import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { pitrifiedGoTurtleExamples } from
'../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/scan.js';

// Check that no errors/exceptions are thrown while scanning a variety of code.
export function testScanVariousExamples(logger) {
	const examples = pitrifiedGoTurtleExamples;
	
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		try {
			const tokens = scan(code);
			if (!(tokens instanceof Array))
				plogger(`Expected an Array but found ${tokens}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception/error thrown. e=${exceptionToString(e)}`);
		}
	});
};