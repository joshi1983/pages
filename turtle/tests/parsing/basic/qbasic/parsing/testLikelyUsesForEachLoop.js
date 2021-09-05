import { likelyUsesForEachLoop } from
'../../../../../modules/parsing/basic/qbasic/parsing/likelyUsesForEachLoop.js';
import { scan } from
'../../../../../modules/parsing/basic/qbasic/scanning/scan.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedLikelyUsesForEachLoop(code) {
	const tokens = scan(code);
	return likelyUsesForEachLoop(tokens);
}

export function testLikelyUsesForEachLoop(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'for x=0 to 10\nnext', 'out': false},
		{'in': 'for x=0 to 10 step 2\nnext', 'out': false},
		{'in': 'next', 'out': false},
		{'in': 'in next', 'out': false},
		{'in': 'for in next', 'out': false},
		{'in': 'for each', 'out': false},
		{'in': 'for each=', 'out': false},
		{'in': 'for each=0 to 10\nnext each', 'out': false},
		{'in': 'for each x', 'out': false},
		{'in': 'for each x in', 'out': false},
		{'in': 'for each x in list', 'out': false},
		{'in': 'for each x in list\nnext', 'out': true},
		{'in': 'for each x in list\nprint "hello"\nnext', 'out': true},
		{'in': `for each x in y
next x`, 'out': true}
	];
	testInOutPairs(cases, wrappedLikelyUsesForEachLoop, logger);
};