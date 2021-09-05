import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../modules/parsing/l-systems/0L/scanning/scan.js';
import { zeroLExamples } from
'../../../../helpers/parsing/l-systems/zeroLExamples.js';

const examples = [];
ArrayUtils.pushAll(examples, zeroLExamples);

export function testScanVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = scan(code);
			if (!(result instanceof Array))
				plogger(`Expected an Array but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error thrown. e=${exceptionToString(e)}`);
		}
	});
};