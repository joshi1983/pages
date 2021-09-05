import { evaluateToken } from
'../../../../../modules/parsing/l-systems/0L/evaluation/evaluateToken.js';
import { parse } from
'../../../../../modules/parsing/l-systems/0L/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedEvaluateToken(logger) {
	return function(code) {
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			logger(`Expected 1 child but found ${root.children.length} for code=${code}`);
		else {
			const token = root.children[0];
			return evaluateToken(token);
		}
	};
}

export function testEvaluateToken(logger) {
	const cases = [
		{'in': '1', 'out': 1},
		{'in': '1.5', 'out': 1.5},
		{'in': '-1', 'out': -1},
		{'in': '-1.5', 'out': -1.5}
	];
	testInOutPairs(cases, wrappedEvaluateToken(logger), logger);
};