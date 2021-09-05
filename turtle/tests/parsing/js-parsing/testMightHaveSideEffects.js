import { mightHaveSideEffects } from
'../../../modules/parsing/js-parsing/mightHaveSideEffects.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function wrappedMightHaveSideEffects(logger) {
	return function(code) {
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			logger(`For code ${code}, expected 1 child but found ${root.children.length}`);
		else {
			const firstChild = root.children[0];
			return mightHaveSideEffects(firstChild);
		}
		return false;
	}
}

export function testMightHaveSideEffects(logger) {
	const cases = [
	{'in': '1', 'out': false},
	{'in': '"hi"', 'out': false},
	{'in': 'x', 'out': false},
	{'in': '(4)', 'out': false},
	{'in': 'Math.abs(-4)', 'out': false},
	{'in': '1 + 4', 'out': false},
	{'in': '(1 + 4)', 'out': false},
	{'in': '(1 ** 4)', 'out': false},
	{'in': '``', 'out': false},
	{'in': '`${f()}`', 'out': true},
	{'in': 'x = 4', 'out': true},
	{'in': 'var x', 'out': true},
	{'in': 'let x', 'out': true},
	{'in': 'const x = 3', 'out': true},
	{'in': '(2 ** f(4))', 'out': true},
	{'in': 'f(4)', 'out': true},
	{'in': 'console.log(4)', 'out': true},
	];
	testInOutPairs(cases, wrappedMightHaveSideEffects(logger), logger);
};