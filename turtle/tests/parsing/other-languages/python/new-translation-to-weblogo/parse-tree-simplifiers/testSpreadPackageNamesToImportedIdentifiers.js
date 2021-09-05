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
print(pi)`, 'out': `import math
print(math.pi)`},
		{'code': `from math import sin
print(sin(x))`, 'out': `import math
print(math.sin(x))`},
		{'code': `from math import degrees
print(degrees(0))`,
		'out': `import math
print(math.degrees(0))`}
	];
	processTestCases(cases, spreadPackageNamesToImportedIdentifiers, logger);
};