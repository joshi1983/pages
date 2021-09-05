import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateAssignments(logger) {
	const cases = [
		{'in': 'LET x = 3', 'out': 'make "x 3'},
		{'in': 'CONST x = 3', 'out': 'make "x 3'},
		{'in': 'i% = 1', 'out': 'make "i 1'},
		{'in': 'DIM a(1), b(1), result AS INTEGER', 'out': `make "a [ 0 ]
make "b [ 0 ]
make "result 0`},
		{'in': 'x = 3\nx$ = "hi"', 'out': `make "x 3
make "x1 "hi`},
		{'in': 'z(i) = 1', 'out': 'setItem 1 + :i "z 1'},
		{'in': 'p.x = 3', 'out': 'setProperty "p "x 3'},
		{'in': 'dim a(2)\nprint a(0).x', 'out': 'make "a [ ]\nprint getProperty2 item 1 :a "x'},
		{'in': 'dim a(2)\na(0).x = 5', 'out': 'make "a [ ]\nsetProperty2 item 1 :a "x 5'},,
		{'in': 'dim a(2)\nprint a(1).x', 'out': 'make "a [ ]\nprint getProperty2 item 2 :a "x'},
		{'in': 'dim a(2)\na(1).x = 5', 'out': 'make "a [ ]\nsetProperty2 item 2 :a "x 5'},
		{'in': `SUB ADD (x, y)
    c=x+y
    PRINT c
END SUB

CALL ADD (5, 6)`, 'out': `to ADD :x :y
	localmake "c :x + :y
	print :c
end

ADD 5 6`},
		{'in': `DIM player1 AS playertype
player1.name = "Bob"
player1.score = 92`,
	'out': `make "player1 createPList
setProperty "player1 "name "Bob
setProperty "player1 "score 92`},
		{'in': 'x = 3.1415927#', 'out': 'make "x 3.1415927'},
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};