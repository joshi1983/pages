import { javascriptProcessingExamples } from
'../../../helpers/parsing/javascriptProcessingExamples.js';
import { parse } from
'../../../../modules/parsing/js-parsing/parse.js';

export function testParseAllJSProcessingExamples(logger) {
	javascriptProcessingExamples.forEach(function(code, index) {
		const result = parse(code);
		if (typeof result !== 'object')
			logger(`Expected object result while parsing code at index ${index}, code=${code}`);
	});
};