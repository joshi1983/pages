import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testFunctionDefinitionTranslation(logger) {
	const cases = [
		{'in': 'def f():\n\tprint("hi")\n\nf()',
			'out': 'to f\n\nprint "hi \nend\nf'},
		{'in': 'def f(x):\n\tprint("hi")\n\nf(0)',
			'out': 'to f :x\n\nprint "hi \nend\nf 0'},
		{'in': 'def f(x):\n\tx = 4\n\nf(0)',
			'out': 'to f :x\n\nlocalmake "x 4\n\nend\nf 0'},
		{'in': 'def f(x,y):\n\tprint("hi")\n\nf(0,1)',
			'out': 'to f :x :y\n\nprint "hi \nend\nf 0 1'},
		{'in': 'def f(x,y,z):\n\tprint("hi")\n\nf(0,1,2)',
			'out': 'to f :x :y :z\n\nprint "hi \nend\nf 0 1 2'},
		{'in': 'def f(x=0):\n\tprint("hi")\n\nf()',
			'out': 'to f :x\n\nprint "hi \nend\n f 0'},
		{'in': 'def f(x="hi"):\n\tprint("hi")\n\nf()',
			'out': 'to f :x\n\nprint "hi \nend\n f "hi'},
		{'in': 'def f(*argv):\n\tpass\n\nf(0)',
			'out': 'to f :argv\n\nend\nf 0'},
		{'in': 'def f(arg1, *argv):\n\tpass\n\nf(0, 1)',
			'out': 'to f :arg1 :argv\n\nend\nf 0 1'},
		{'in': 'def f(**kwargs):\n\tpass\n\nf(0)',
			'out': 'to f :kwargs\n\nend\nf 0'},
		{'in': 'def f():\n\treturn\n\nf()',
			'out': 'to f\n\nstop\n\nend\nf'},
		{'in': 'def f():\n\treturn 5\n\nf()',
			'out': 'to f\noutput 5\n\nend\nf'},
		{'in': 'def f():\n\treturn None\n\nf()',
			'out': 'to f\n\nstop\n\nend\nf'},
		{'in': 'def f():\n\t"""docstring here\n\tand on a new line"""\n\tpass\n\nf()',
			'out': 'to f\n; docstring here\n; and on a new line\n\nend\nf'},
		{'in': `import math\ndef calculateX(k):
	return math.sin(k)**3
calculateX(10)`,
		'out': 'to calculateX :k\noutput (power (radSin :k )  3)\n\nend\ncalculateX 10'},
		{'in': `import math\ndef calculateX(k):
	return 15*math.sin(k)**3
calculateX(10)`,
		'out': 'to calculateX :k\noutput 15 * (power (radSin :k )  3)\n\nend\ncalculateX 10'}
	];
	processTranslationTestCases(cases, logger);
};