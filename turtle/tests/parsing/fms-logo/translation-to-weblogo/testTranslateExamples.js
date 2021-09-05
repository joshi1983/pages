import { fmsLogoExamples } from
'../../../helpers/parsing/fmsLogoExamples.js';
import { translate } from
'../../../../modules/parsing/fms-logo/translation-to-weblogo/translate.js';

// translate various examples 
// mostly to make sure
// no exceptions are thrown.
export function testTranslateExamples(logger) {
	fmsLogoExamples.forEach(function(example, index) {
		try {
			const result = translate(example);
			if (typeof result !== 'string')
				logger(`Expected a string but found ${ersult}`);
		}
		catch (e) {
			console.error(e);
			logger(`Exception thrown while translating example ${index}.  The example has code: ${example}.`);
		}
	});
};