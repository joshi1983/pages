import { getColorsCode } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/getColorsCode.js';
import { parse } from
'../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../helpers/parsing/qbasicExamples.js';

export function testGetColorsCode(logger) {
	qbasicExamples.forEach(function(code, index) {
		const parseResult = parse(code);
		const result = getColorsCode(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		if (typeof result !== 'string')
			plogger(`getColorsCode should always return a string but found ${result}`);
		else {
			// FIXME: parse the WebLogo code and run analyzeCode to look for errors.
		}
	});
};