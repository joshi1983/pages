import { processTestCases } from
'./processTestCases.js';
import { spreadPackageNamesToImportedIdentifiers } from
'../../../../../../modules/parsing/other-languages/python/new-translation-to-weblogo/parse-tree-simplifiers/spreadPackageNamesToImportedIdentifiers.js';

export function testSpreadPackageNamesToImportedIdentifiers(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'import turtle', 'changed': false},
		{'code': 'from math import pi', 'changed': false},
		{'code': `from math import pi
def f(pi):
	pass`, 'changed': false},
		{'code': `from math import pi
def f(pi):
	print(pi)`, 'changed': false},
		{'code': `from math import pi
class pi:`, 'changed': false},
		{'code': `from math import pi_
class pi_:`, 'changed': false},
		{'code': `from math import pi_
class pi_:

print(pi_())`, 'changed': false},
		{'code': `from math import pi_
def pi_():
	return 3
print(pi_())`, 'changed': false},
		{'code': `from math import pi
pi = 4`, 'changed': false
		// weird case but we still don't want to replace the pi with math.pi = 4.
		},
		{'code': `from math import pi
pi = 4
print(pi)`, 'changed': false
		// another weird case but we still don't want to replace the pi with math.pi = 4 or print(pi) with print(math.pi).
		},
		{'code': `from math import pi
def f(pi):
	print(pi)`, 'changed': false},
		{'code': `from math import pi
print(pi)`, 'out': `import math
print(math.pi)`},
		{'code': `from math import sin
print(sin(x))`, 'out': `import math
print(math.sin(x))`},
		{'code': `from math import degrees
print(degrees(0))`,
		'out': `import math
print(math.degrees(0))`},
		{'code': `from math import *
print sin(x)`, 'out': `import math
print math.sin(x)`},
		{'code': `from math import *
print cos(x)`, 'out': `import math
print math.cos(x)`},
		{'code': `from math import *
print pi`, 'out': `import math
print math.pi`},
		{'code': `from math import *
print tan(x)`, 'out': `import math
print math.tan(x)`},
	];
	processTestCases(cases, spreadPackageNamesToImportedIdentifiers, logger);
};