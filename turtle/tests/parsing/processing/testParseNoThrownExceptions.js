import { parse } from '../../../modules/parsing/processing/parse.js';

export function testParseNoThrownExceptions(logger) {
	const cases = [
	'(', ')',
	'[', ']',
	'{', '}'
	];
	cases.forEach(function(code, index) {
		try {
			parse(code);
		}
		catch (e) {
			logger(`Case ${index}, code=${code} translating failed with an exception thrown. e=${e}`);
			console.error(e);
		}
	});
};