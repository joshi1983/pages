import { bbcBasicExamples } from
'../../../helpers/parsing/bbcBasicExamples.js';
import { translateBBCBasicToQBasic } from
'../../../../modules/parsing/bbc-basic/translation-to-weblogo/translateBBCBasicToQBasic.js';

export function testTranslateBBCBasicToQBasicOnExamples(logger) {
	for (const code of bbcBasicExamples) {
		const result = translateBBCBasicToQBasic(code);
		if (typeof result !== 'string') {
			logger(`result should be a string but found ${result}`);
		}
	}
};