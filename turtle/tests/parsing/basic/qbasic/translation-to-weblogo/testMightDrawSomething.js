import { mightDrawSomething } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/mightDrawSomething.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedMightDrawSomething(code) {
	const parseResult = parse(code);
	return mightDrawSomething(parseResult.root);
}

export function testMightDrawSomething(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'print "hi"', 'out': false},
	{'in': 'goto 10', 'out': false},
	{'in': 'dim x as integer', 'out': false},
	{'in': 'f()', 'out': false},
	{'in': 'line -(100, 100), 2', 'out': true},
	{'in': 'LINE -(100, 100), 2', 'out': true},
	{'in': 'CIRCLE (100, 100), 2, 4', 'out': true},
	{'in': 'pset (100, 100), 2', 'out': true},
	{'in': 'preset (100, 100), 2', 'out': true},
	];
	testInOutPairs(cases, wrappedMightDrawSomething, logger);
};