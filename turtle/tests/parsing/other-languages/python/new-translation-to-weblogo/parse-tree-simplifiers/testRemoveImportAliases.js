import { processTestCases } from
'./processTestCases.js';
import { removeImportAliases } from
'../../../../../../modules/parsing/other-languages/python/new-translation-to-weblogo/parse-tree-simplifiers/removeImportAliases.js';

export function testRemoveImportAliases(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'import', 'changed': false},
		{'code': 'import math', 'changed': false},
		{'code': `import math
print math.sin(1)`, 'changed': false},
		{'code': 'from math import sin', 'changed': false},
		{'code': 'import math as m', 'changed': false},
		{'code': `import math as m
def m():
	pass`, 'changed': false},
		{'code': `import math as m
class m():
	pass`, 'changed': false},
		{'code': `import math as m
print p.m`, 'changed': false},
		{'code': `import math as m
print m.sin(1)`, 'out': `import math
print math.sin(1)`},
		{'code': `import numpy as np
print np.sin(x)`, 'out': `import numpy
print numpy.sin(x)`},
	];
	processTestCases(cases, removeImportAliases, logger);
};