import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { cgjenningsExamples } from
'../../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { fractintExamples } from
'../../../../helpers/parsing/l-systems/fractintExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../modules/parsing/l-systems/fractint/scanning/scan.js';
import { zeroLExamples } from
'../../../../helpers/parsing/l-systems/zeroLExamples.js';

// If WebLogo's classifier fails, we could end up scanning invalid fractint code.
// We don't want the scanner throwing errors or exceptions just because the code is not from the fractint language.
// This is why we're testing with some examples that are not fractint.
const examples = [];
for (const part of [cgjenningsExamples, fractintExamples, zeroLExamples]) {
	ArrayUtils.pushAll(examples, part);
}

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