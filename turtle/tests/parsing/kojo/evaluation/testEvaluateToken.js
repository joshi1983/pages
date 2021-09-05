import { evaluateToken } from
'../../../../modules/parsing/kojo/evaluation/evaluateToken.js';
import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedEvaluateToken(logger) {
	return function(code) {
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			logger(`Expected 1 child token of root but found ${root.children.length}.  code=${code}`);
		else {
			return evaluateToken(root.children[0]);
		}
	};
}

export function testEvaluateToken(logger) {
	const cases = [
		{'in': '1', 'out': 1},
		{'in': '2', 'out': 2},
		{'in': '2+4', 'out': 6},
		{'in': '2*4', 'out': 8},
		{'in': 'math.Pi', 'out': 3.141592653589793},
		{'in': '-math.Pi', 'out': -3.141592653589793},
		{'in': 'math.E', 'out': 2.718281828459045},
		{'in': '"hi"', 'out': 'hi'},
		{'in': 'true', 'out': true},
		{'in': 'false', 'out': false},
		{'in': '!true', 'out': false},
		{'in': '!false', 'out': true},
	];
	testInOutPairs(cases, wrappedEvaluateToken(logger), logger);
};