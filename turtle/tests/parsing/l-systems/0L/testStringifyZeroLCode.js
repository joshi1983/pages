import { parse } from
'../../../../modules/parsing/l-systems/0L/parse.js';
import { stringifyZeroLCode } from
'../../../../modules/parsing/l-systems/0L/stringifyZeroLCode.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedStringifyZeroLCode(code) {
	const parseResult = parse(code);
	return stringifyZeroLCode(parseResult.root);
}

export function testStringifyZeroLCode(logger) {
	const cases = [
		{'in': 'x=F', 'out': 'x=F'},
		{'in': ' x = F', 'out': 'x=F'},
		{'in': 'angle scale = F', 'out': 'angle scale=F'},
		{'in': 'x -> F', 'out': 'x->F'},
		{'in': 'x -> F\nangle=30', 'out': 'x->F\nangle=30'},
		{'in': ' ->', 'out': '->'}
	];
	testInOutPairs(cases, wrappedStringifyZeroLCode, logger);
};