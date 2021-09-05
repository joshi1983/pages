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
	'out': `print 'Welcome to my project.'`},
	{'in': 'PRINT [HELLO WORLD]',
	'out': 'print \'HELLO WORLD\''},
	{'in': `;
TO SETUP_SCREEN
    (STAMPRECT)
END`, 'out': `;
to SETUP_SCREEN
end`},
	{'in': '(setFont "Arial)', 'out': 'setFontFamily "Arial'},
	{'in': 'setxy [85 -45]', 'out': 'setPos [ 85 -45 ]'},
	{'in': 'setxy [85 -45] pd setpc "yellow fill pu setxy [60 -2] pd',
	'out': `setPos [ 85 -45 ]
penDown
setPenColor "yellow
penUp
setPos [ 60 -2 ]
penDown`},
{'in': `MAKE “X 1
UNTIL [:X > 5] [PRINT :X MAKE “X :X + 1]`,
'out': `make "X 1
until :X > 5 [
	print :X
	make "X :X + 1
]`},
{'in': `MAKE “X 1
WHILE [:X <= 5] [PRINT :X MAKE “X :X + 1]`,
'out': `make "X 1
while :X <= 5 [
	print :X
	make "X :X + 1
]`},
{'in': `MAKE “X 1
DO.WHILE [PRINT :X MAKE “X :X + 1] [:X <= 5]`,
'out': `make "X 1
do.while [
	print :X
	make "X :X + 1
] :X <= 5`},
	{'in': 'FOREACH [JOHN MARTHA] [PRINT “?]',
	'out': `make "foreachList [ "JOHN "MARTHA ]
repeat count :foreachList [
	make "foreachListItem item repcount :foreachList
	print :foreachListItem
]`},
	{'in': 'FOREACH :x [PRINT “?]',
	'out': `repeat count :x [
	make "xItem item repcount :x
	print :xItem
]`}
	];
	testInOutPairs(cases, terrapinToWebLogo, logger);
};