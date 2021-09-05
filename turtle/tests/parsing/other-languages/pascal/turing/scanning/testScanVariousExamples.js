import { ArrayUtils } from
'../../../../../../modules/ArrayUtils.js';
import { exceptionToString } from
'../../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../../modules/parsing/other-languages/pascal/turing/scanning/scan.js';
import { turingExamples } from
'../../../../../helpers/parsing/pascal/turingExamples.js';

const examples = ArrayUtils.combine(turingExamples);

export function testScanVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const tokens = scan(code);
			if (!(tokens instanceof Array))
				plogger(`Expected an Array but found ${tokens}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
};