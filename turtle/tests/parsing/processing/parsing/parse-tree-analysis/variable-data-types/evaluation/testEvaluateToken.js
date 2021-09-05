import { evaluateToken } from
'../../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { parse } from
'../../../../../../../modules/parsing/processing/parse.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

function wrappedEvaluateToken(code) {
	const parseResult = parse(code);
	const children = parseResult.root.children;
	if (children.length !== 1)
		throw new Error(`Expected 1 child but found ${children.length}`);
	const inToken = children[0];
	return evaluateToken(inToken);
}

export function testEvaluateToken(logger) {
	const cases = [
		{'in': '3', 'out': 3},
		{'in': '1', 'out': 1},
		{'in': '-1', 'out': -1},
		{'in': 'true', 'out': true},
		{'in': 'false', 'out': false},
		{'in': '"hi"', 'out': 'hi'},
		{'in': '"hello world"', 'out': 'hello world'},
		{'in': '1 + 2', 'out': 3},
		{'in': '1 - 2', 'out': -1},
		{'in': '3 * 2', 'out': 6},
		{'in': '3 << 2', 'out': 12},
		{'in': '3 >> 1', 'out': 1},
		{'in': '1 > 2', 'out': false},
		{'in': '1 > 1', 'out': false},
		{'in': '1 >= 2', 'out': false},
		{'in': '1 >= 1', 'out': true},
		{'in': '1 < 2', 'out': true},
		{'in': '1 <= 2', 'out': true},
		{'in': '1 == 2', 'out': false},
		{'in': '-1 == 2', 'out': false},
		{'in': 'x < 2', 'out': undefined},
		{'in': 'x > 2', 'out': undefined},
		{'in': '1', 'out': 1},
		{'in': '-1', 'out': -1},
		{'in': '-10', 'out': -10},
		{'in': '-10.2', 'out': -10.2},
		{'in': '0xff', 'out': 255},
		{'in': '#ff', 'out': 255}
	];
	testInOutPairs(cases, wrappedEvaluateToken, logger);
};