import { asmTurtleExamples } from '../../../helpers/parsing/asmTurtleExamples.js';
import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';

export function testTranslateExamples(logger) {
	asmTurtleExamples.forEach(function(content, index) {
		const result = translate(content);
		if (typeof result !== 'string')
			logger(`Expected a string but got ${result} for example index ${index}`);
	});
};