import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testTranslate(logger) {
	const cases = [
	{'in': '//hello', 'out': ';hello'},
	{'in': '//hello world', 'out': ';hello world'},
	{'in': '100', 'out': '100'},
	// weird ASM Turtle input code but we still want to test the case.

	{'in': 'x', 'out': ':x'},
	{'in': 'var\nx', 'out': ''},
	{'in': 'instr', 'out': ''},
	{'in': 'instr\nfd 90', 'out': 'forward 90'},

	{'in': 'rt 20', 'out': 'right 20'},
	{'in': 'lt 24', 'out': 'left 24'},
	{'in': 'fd 100', 'out': 'forward 100'},
	{'in': '//hello\nfd 100', 'out': ';hello\nforward 100'},
	{'in': 'sin', 'out': 'make "register 0\nmake "register radSin :register'},
	{'in': 'cos', 'out': 'make "register 0\nmake "register radCos :register'},
	{'in': 'abs', 'out': 'make "register 0\nmake "register abs :register'},
	{'in': 'sqr', 'out': 'make "register 0\nmake "register :register * :register'},
	{'in': 'sqrt', 'out': 'make "register 0\nmake "register sqrt :register'},
	{'in': 'inc x', 'out': 'make "x 0\nmake "x :x + 1'},
	{'in': 'dec x', 'out': 'make "x 0\nmake "x :x - 1'},
	{'in': 'add 1.2', 'out': 'make "register 0\nmake "register :register + 1.2'},
	{'in': 'sub 3', 'out': 'make "register 0\nmake "register :register - 3'},
	{'in': 'mul 5', 'out': 'make "register 0\nmake "register :register * 5'},
	{'in': 'div 5', 'out': 'make "register 0\nmake "register :register / 5'},
	{'in': 'cmp 1, 3', 'out': 'make "comparisonRegister sign 1 - 3'},
	{'in': 'fd x', 'out': 'make "x 0\nforward :x'},
	{'in': 'saveto x', 'out': 'make "register 0\nmake "x :register'},
	{'in': 'load x', 'out': 'make "x 0\nmake "register :x'},
	{'in': 'load 1', 'out': 'make "register 1'},
	{'in': 'push 3', 'out': 'make "stack [ ]\nqueue2 "stack 3'},
	{'in': 'pop', 'out': 'make "stack [ ]\nremoveLast "stack'},
	{'in': 'penup\nfd 100', 'out': 'jumpForward 100'},
	{'in': 'ret', 'out': 'stop'},
	{'in': 'call @p', 'out': 'p'},
	{'in': 'proc @@p:', 'out': 'to p\nend'},
	{'in': `cmp x,3600
jl @start`, 'out': `make "x 0\nmake "comparisonRegister sign :x - 3600
jl @start`}
	];
	testInOutPairs(cases, translate, logger);
};