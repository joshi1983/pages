import { evaluateToken } from
'../../../../../modules/parsing/basic/qbasic/evaluation/evaluateToken.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedEvaluateToken(logger) {
	return function(code) {
		const wrappedCode = 'print (' + code + ')';
		const parseResult = parse(wrappedCode);
		const children = parseResult.root.children;
		if (children.length === 1) {
			const printArgs = children[0].children[1].children;
			if (printArgs.length !== 3)
				logger(`For QBasic code ${wrappedCode}, expected printArgs.length to have a length of 3 but found ${printArgs.length}`);
			else {
				const argListMid = printArgs[1];
				return evaluateToken(argListMid);
			}
		}
		else
			logger(`For QBasic code ${code}, expected root.children to have a length of 1 but found ${children.length}`);
	};
}

export function testEvaluateToken(logger) {
	const cases = [
	{'in': '1', 'out': 1},
	{'in': '&h001', 'out': 1},
	{'in': '&h010', 'out': 16},
	{'in': '&h00f', 'out': 15},
	{'in': '&h00a', 'out': 10},
	{'in': '&o001', 'out': 1},
	{'in': '&O007', 'out': 7},
	{'in': '&O010', 'out': 8},
	{'in': '1 + 5', 'out': 6},
	{'in': '2 + 5', 'out': 7},
	{'in': '2 * 5', 'out': 10},
	{'in': '3 * 5', 'out': 15},
	{'in': '"hi" + 5', 'out': 'hi5'},
	{'in': '3 + "hi"', 'out': '3hi'},
	{'in': '2 ^ 2', 'out': 4},
	{'in': '2 ^ 3', 'out': 8},
	{'in': '1 ^ 3', 'out': 1},
	{'in': '1 / 2', 'out': 0.5},
	{'in': '1 \\ 3', 'out': 0}, // integer division
	{'in': '(3)', 'out': 3},
	{'in': '(2)', 'out': 2},
	{'in': '(1 + 3)', 'out': 4},
	{'in': '1 - 3', 'out': -2},
	{'in': '- 3', 'out': -3},
	{'in': '1 < 2', 'out': true},
	{'in': '2 > 1', 'out': true},
	{'in': '1 > 2', 'out': false},
	{'in': '1 > 1', 'out': false},
	{'in': '2 >= 1', 'out': true},
	{'in': '1 >= 1', 'out': true},
	{'in': '0 >= 1', 'out': false},
	{'in': '2 <= 1', 'out': false},
	{'in': '1 <= 1', 'out': true},
	{'in': '0 <= 1', 'out': true},
	{'in': '2 <> 2', 'out': false},
	{'in': '1 <> 2', 'out': true},
	{'in': '2 = 2', 'out': true},
	{'in': '1 = 2', 'out': false},
	{'in': '-1 and -1', 'out': -1},
	{'in': '0 and 0', 'out': 0},
	{'in': '-1 and 0', 'out': 0},
	{'in': '7 mod 3', 'out': 1},
	{'in': '-1 or -1', 'out': -1},
	{'in': '0 or 0', 'out': 0},
	{'in': '-1 or 0', 'out': -1},
	{'in': '-1 xor -1', 'out': 0},
	{'in': '0 xor 0', 'out': 0},
	{'in': '-1 xor 0', 'out': -1},
	{'in': '-1 imp -1', 'out': -1},
	{'in': '0 imp 0', 'out': true},
	{'in': '-1 imp 0', 'out': 0},
	{'in': '0 imp -1', 'out': true},
	{'in': 'space$ 0', 'out': ''},
	{'in': 'space$ 3', 'out': '   '},
	{'in': 'tab(1)', 'out': '\t'},
	{'in': 'tab(2)', 'out': '\t\t'},
	];
	testInOutPairs(cases, wrappedEvaluateToken(logger), logger);
};