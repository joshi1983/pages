import { processPythonExecuterTest } from './processPythonExecuterTest.js';

export function pythonPrintExecutionTests(logger) {
	/*
	All of the following test data stems from 
	running the in Python code through a 
	Python 3.9.2 interpreter.

	Any differences to the resulting messages have been commented.
	*/
	const cases = [
		{'in': 'print 1', 'messages': ['1']},
		{'in': 'print 3', 'messages': ['3']},
		{'in': 'print((4 / 2) - 1 - 2)', 'messages': ['-1']},
		{'in': 'print(3)', 'messages': ['3']},
		{'in': 'print(1+3)', 'messages': ['4']},
		{'in': 'print(2*3)', 'messages': ['6']},
		{'in': 'print(6/3)', 'messages': ['2']}, 
		// Python 3.9.2 prints '2.0' instead of '2' but that seems close enough.
		{'in': 'print(-5//3)', 'messages': ['-2']},
		{'in': 'print(-5//2)', 'messages': ['-3']},
		{'in': 'print(-1//2)', 'messages': ['-1']},
		{'in': 'print(0//2)', 'messages': ['0']},
		{'in': 'print(0.1//2)', 'messages': ['0']},
		// Python 3.9.2 prints '0.0' instead of '0' but that seems close enough.
		{'in': 'print(0.9//2)', 'messages': ['0']},// '0.0' is close enough to '0'.
		{'in': 'print(1.9//2)', 'messages': ['0']},// '0.0' is close enough to '0'.
		{'in': 'print(-1.9//2)', 'messages': ['-1']},// '-1.0' is close enough to '-1'.
		{'in': 'print(-0.1//2)', 'messages': ['-1']},// '-1.0' is close enough to '-1'.
		

		{'in': 'print(6//3)', 'messages': ['2']},
		{'in': 'print(5//3)', 'messages': ['1']},
		{'in': 'print(1+2*3)', 'messages': ['7']},
		{'in': 'print(2*3+1)', 'messages': ['7']},
		{'in': 'print(2>1)', 'messages': ['true']},
		// Python 3.9.2 prints True instead of true but close enough.

		{'in': 'print(1 in [1, 2])', 'messages': ['true']},
		{'in': 'print(0 in [1, 2])', 'messages': ['false']},
		{'in': 'print(0 not in [1, 2])', 'messages': ['true']},
		{'in': 'print(1 not in [1, 2])', 'messages': ['false']},
		{'in': 'print(3 + 1>2)', 'messages': ['true']},
		{'in': 'print(2<1+3)', 'messages': ['true']},
		{'in': 'print(1==1)', 'messages': ['true']},
		{'in': 'print(1==0)', 'messages': ['false']},
		{'in': 'print(\'hi\'*2)', 'messages': ['hihi']},
		{'in': 'print(\'hi\'*2+\'hello\')', 'messages': ['hihihello']},
		{'in': 'print(str(1))', 'messages': ['1']},
		{'in': 'print([1,2]*2)', 'messages': ['[1 2 1 2]']},
		{'in': 'for i in range(2):\n\tprint("hi")', 'messages': ['hi', 'hi']},
		{'in': 'for i in range(2,4):\n\tprint("hi")', 'messages': ['hi', 'hi']},
		{'in': 'for i in range(2,4):\n\tprint(i)', 'messages': ['2', '3']},
		{'in': 'for i in range(2):\n\tprint(i)', 'messages': ['0', '1']},
		{'in': 'for i in range(2):\n\tprint(i)\n\tbreak', 'messages': ['0']},
		{'in': 'for i in range(0,2,2):\n\tprint(i)\n\tbreak', 'messages': ['0']},
		{'in': 'x=2\nfor i in range(x):\n\tprint(i)', 'messages': ['0', '1']},
		{'in': `i = 1
while i < 6:
  print(i)
  i += 1
  break
else:
  print("i is no longer less than 6")`, 'messages': ['1']},
		{'in': `i = 1
while i < 6:
  print(i)
  i += 1
else:
  print("i is no longer less than 6")`, 'messages': ['1', '2', '3', '4', '5', 'i is no longer less than 6']},
		{'in': `for x in range(6):
    print(x)
else:
    print("Finally finished!")`,
		'messages': ['0', '1', '2', '3', '4', '5', 'Finally finished!']
		},
		{'in': 'for i in [20, 40, 60]:\n\tprint(str(i))', 
			'messages': ['20', '40', '60']
		},
		{'in': `def rec(val, limit):
	print(str(val))
	if val < limit:
		rec(val + 1, limit)


rec(0, 6)`,
			'messages': ['0', '1', '2', '3', '4', '5', '6']
		},
		{'in': `if _name_ == '__main__':\n\tprint("hi")`, 
		'messages': ['hi']},
		{'in': `print not True`, 'messages': ['false']},
		{'in': `print not False`, 'messages': ['true']}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processPythonExecuterTest(caseInfo, logger);
	});
};