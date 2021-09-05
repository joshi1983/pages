import { sanitizePythonCode } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/sanitizePythonCode.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testSanitizePythonCode(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'import turtle', 'out': 'import turtle'},
	{'in': '>>>import turtle', 'out': 'import turtle'},
	{'in': '...import turtle', 'out': 'import turtle'},
	{'in': 'import random\n...import turtle', 'out': 'import random\nimport turtle'},
	{'in': '"""\n>>> """', 'out': '"""\n>>> """'},
	{'in': '"""\n... """', 'out': '"""\n... """'},
	{'in': `>>> t.pencolor("purple")
>>> t.fillcolor("orange")
>>> t.pensize(10)
>>> t.speed(9)
>>> t.begin_fill()
>>> t.circle(90)
>>> t.end_fill()`, 'out': `t.pencolor("purple")
t.fillcolor("orange")
t.pensize(10)
t.speed(9)
t.begin_fill()
t.circle(90)
t.end_fill()`},
	{'in': `for x in range(6):
	print(x)
else:
	print("Finally finished!")`, 'out': `for x in range(6):
	print(x)
else:
	print("Finally finished!")`},
	{'in': `import turtle

def shape(angle, side, limit):
	print("hi")
	if side < limit:
		shape(angle, side, limit - 1)


shape(119, 0, 600)`, 'out': `import turtle

def shape(angle, side, limit):
	print("hi")
	if side < limit:
		shape(angle, side, limit - 1)


shape(119, 0, 600)`}
	];
	testInOutPairs(cases, sanitizePythonCode, logger);
};