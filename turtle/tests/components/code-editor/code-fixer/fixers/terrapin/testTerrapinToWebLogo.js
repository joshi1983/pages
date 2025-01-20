import { terrapinToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/terrapinToWebLogo.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testTerrapinToWebLogo(logger) {
	const cases = [
	{'in': 'print "hi', 'out': 'print "hi'},
	{'in': 'ct', 'out': ''},
	{'in': 'restart', 'out': ''},
	{'in': 'ed "AUTHOR_RJ', 'out': ''},
	{'in': 'setw 8', 'out': 'setPenSize 8'},
	{'in': 'IF :SHIP.POS <= 1 THEN print "hi',
	'out': `if :SHIP.POS <= 1 [
	print "hi
]`},
	{'in': 'PR "|Welcome to my project.|',
	'out': `print 'Welcome to my project.'`}
	];
	testInOutPairs(cases, terrapinToWebLogo, logger);
};