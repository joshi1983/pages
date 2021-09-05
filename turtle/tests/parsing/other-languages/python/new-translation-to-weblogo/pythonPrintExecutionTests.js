import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function pythonPrintExecutionTests(logger) {
	/*
	All of the following test data stems from 
	running the in Python code through a 
	Python 3.9.2 interpreter.

	Any differences to the resulting messages have been commented.
	*/
	const cases = [
		{'code': 'print 1', 'messages': ['1']},
		{'code': 'print 3', 'messages': ['3']},
		{'code': 'print((4 / 2) - 1 - 2)', 'messages': ['-1']},
		{'code': 'print(3)', 'messages': ['3']},
		{'code': 'print(1+3)', 'messages': ['4']},
		{'code': 'print(2*3)', 'messages': ['6']},
		{'code': 'print(6/3)', 'messages': ['2']}, 
		// Python 3.9.2 prints '2.0' instead of '2' but that seems close enough.
		{'code': 'print(-5//3)', 'messages': ['-2']},
		{'code': 'print(-5//2)', 'messages': ['-3']},
		{'code': 'print(-1//2)', 'messages': ['-1']},
		{'code': 'print(0//2)', 'messages': ['0']},
		{'code': 'print(0.1//2)', 'messages': ['0']},
		// Python 3.9.2 prints '0.0' instead of '0' but that seems close enough.
		{'code': 'print(0.9//2)', 'messages': ['0']},// '0.0' is close enough to '0'.
		{'code': 'print(1.9//2)', 'messages': ['0']},// '0.0' is close enough to '0'.
		{'code': 'print(-1.9//2)', 'messages': ['-1']},// '-1.0' is close enough to '-1'.
		{'code': 'print(-0.1//2)', 'messages': ['-1']},// '-1.0' is close enough to '-1'.
		

		{'code': 'print(6//3)', 'messages': ['2']},
		{'code': 'print(5//3)', 'messages': ['1']},
		{'code': 'print(1+2*3)', 'messages': ['7']},
		{'code': 'print(2*3+1)', 'messages': ['7']},
		{'code': 'print(2>1)', 'messages': ['true']},
		// Python 3.9.2 prints True instead of true but close enough.

		{'code': 'print(1 in [1, 2])', 'messages': ['true']},
		{'code': 'print(0 in [1, 2])', 'messages': ['false']},
		{'code': 'print(0 not in [1, 2])', 'messages': ['true']},
		{'code': 'print(1 not in [1, 2])', 'messages': ['false']},
		{'code': 'print(3 + 1>2)', 'messages': ['true']},
		{'code': 'print(2<1+3)', 'messages': ['true']},
		{'code': 'print(1==1)', 'messages': ['true']},
		{'code': 'print(1==0)', 'messages': ['false']},
		{'code': 'print(\'hi\'*2)', 'messages': ['hihi']},
		{'code': 'print(\'hi\'*2+\'hello\')', 'messages': ['hihihello']},
		{'code': 'print(str(1))', 'messages': ['1']},
		{'code': 'print([1,2]*2)', 'messages': ['[1 2 1 2]']},
		{'code': 'for i in range(2):\n\tprint("hi")', 'messages': ['hi', 'hi']},
		{'code': 'for i in range(2,4):\n\tprint("hi")', 'messages': ['hi', 'hi']},
		{'code': 'for i in range(2,4):\n\tprint(i)', 'messages': ['2', '3']},
		{'code': 'for i in range(2):\n\tprint(i)', 'messages': ['0', '1']},
		{'code': 'for i in range(2):\n\tprint(i)\n\tbreak', 'messages': ['0']},
		{'code': 'for i in range(0,2,2):\n\tprint(i)\n\tbreak', 'messages': ['0']},
		{'code': 'x=2\nfor i in range(x):\n\tprint(i)', 'messages': ['0', '1']},
		{'code': `i = 1
while i < 6:
  print(i)
  i += 1
  break
else:
  print("i is no longer less than 6")`, 'messages': ['1']},
		{'code': `i = 1
while i < 6:
  print(i)
  i += 1
else:
  print("i is no longer less than 6")`, 'messages': ['1', '2', '3', '4', '5', 'i is no longer less than 6']},
		{'code': `for x in range(6):
    print(x)
else:
    print("Finally finished!")`,
		'messages': ['0', '1', '2', '3', '4', '5', 'Finally finished!']
		},
		{'code': 'for i in [20, 40, 60]:\n\tprint(str(i))', 
			'messages': ['20', '40', '60']
		},
		{'code': `def rec(val, limit):
	print(str(val))
	if val < limit:
		rec(val + 1, limit)


rec(0, 6)`,
			'messages': ['0', '1', '2', '3', '4', '5', '6']
		},
		{'code': `if _name_ == '__main__':\n\tprint("hi")`, 
		'messages': ['hi']},
		{'code': `print not True`, 'messages': ['false']},
		{'code': `print not False`, 'messages': ['true']},
		{'code': `print(1);print(2);`, 'messages': ['1', '2']},
		{'code': 'from math import *\nprint(degrees(0))', 'messages': ['0']},
		{'code': 'from math import degrees\nprint(degrees(0))', 'messages': ['0']},
		{'code': 'import math\nprint(math.degrees(0))', 'messages': ['0']},
		{'code': 'import math\nprint(math.degrees(math.pi))', 'messages': ['180']},
		{'code': 'import math\nprint(math.degrees(math.pi/2))', 'messages': ['90']},
		{'code': 'import math\nprint(math.radians(180))', 'messages': ['3.141593']},
		{'code': 'import math\nprint(math.radians(0))', 'messages': ['0']},
		{'code': 'from math import *\nprint(radians(0))', 'messages': ['0']},
		{'code': 'from math import radians\nprint(radians(0))', 'messages': ['0']},
		{'code': 'import math\nprint(math.pi)', 'messages': ['3.141593']},
		{'code': 'import numpy\nprint(numpy.pi)', 'messages': ['3.141593']},
	];
	processTranslateExecuteCases(cases, logger);
};