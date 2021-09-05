import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'end', 'out': ''},
	{'in': 'draw 10\nend', 'out': 'setLineJoinStyle "round\nforward 10'},
	{'in': 'draw x\nend', 'out': 'setLineJoinStyle "round\nforward :x'},
	{'in': 'move x\nend', 'out': 'jumpForward :x'},
	{'in': 'let x ^', 'out': 'make "x "input'},
	{'in': 'let x ^1', 'out': 'make "x "input1'},
	{'in': 'let x ^2', 'out': 'make "x "input2'},
	{'in': 'let x ^24', 'out': 'make "x "input24'},
	{'in': 'LET $C BLACK', 'out': 'make "C "BLACK'},
	// $C is not a valid variable name in WebLogo.

	{'in': 'thick 3', 'out': 'setPenSize 3'},
	{'in': 'thick +3', 'out': 'setPenSize penSize + 3'},
	{'in': 'thick -3', 'out': 'setPenSize max 0 penSize - 3'},
	{'in': 'push D', 'out': 'make "stack [ ]\npush "stack :D'},
	{'in': 'push 4', 'out': 'make "stack [ ]\npush "stack 4'},
	{'in': 'pop D', 'out': 'make "stack [ ]\nmake "D pop "stack'},
	{'in': 'color black', 'out': 'setPenColor "black'},
	{'in': 'color 0', 'out': 'setPenColor "#000000'},
	{'in': 'color 1', 'out': 'setPenColor "#ffffff'},
	{'in': 'if 1 < 2\nmove x\nendif\nend', 'out': 'if 1 < 2 [\n\tjumpForward :x\n]'},
	{'in': 'if 1 < 2\nmove x\nelse\nmove 123\nendif\nend', 'out': 'ifelse 1 < 2 [\n\tjumpForward :x\n] [\n\tjumpForward 123\n]'},
	{'in': 'repeat 2 \nmove x\nnext', 'out': 'repeat 2 [\n\tjumpForward :x\n]'},
	{'in': 'repeat y \nmove x\nnext', 'out': 'repeat :y [\n\tjumpForward :x\n]'},
	{'in': `LET D 12
LET LEN 40/D`, 'out': `make "D 12
make "LEN 40 / :D`},
	{'in': `REPEAT 3
  DRAW 100
  RIGHT 180
  MOVE 100
  RIGHT 180
  RIGHT 10
NEXT`, 'out': `setLineJoinStyle "round
repeat 3 [
	forward 100
	right 180
	jumpForward 100
	right 180 + 10
]`}
	];
	testInOutPairs(cases, translate, logger);
};