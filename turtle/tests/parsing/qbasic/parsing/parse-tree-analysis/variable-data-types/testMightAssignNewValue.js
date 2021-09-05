import { mightAssignNewValue } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/mightAssignNewValue.js';
import { parse } from
'../../../../../../modules/parsing/qbasic/parse.js';

export function testMightAssignNewValue(logger) {
	const cases = [
	{'code': 'print "hi"',
	'out': false},
	{'code': 'input "x"',
	'out': false},
	{'code': 'y = 3', // assigns to y but not x.
	'out': false},
	{'code': 'print "x";x', // reads x but does not assign to x.
	'out': false},
	{'code': 'print x',
	'out': false},
	{'code': 'input "x";x',
	'out': true},
	{'code': 'input$ "x";x',
	'out': true},
	{'code': 'x = 3',
	'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const result = mightAssignNewValue('x', parseResult.root);
		if (result !== caseInfo.out) {
			logger(`Case ${index}, code=${caseInfo.code}, expected ${caseInfo.out} but found ${result}`);
		}
	});
};