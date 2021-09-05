import { processTestCases } from
'./processTestCases.js';
import { simplifyParseTree } from
'../../../../../../modules/parsing/other-languages/python/new-translation-to-weblogo/parse-tree-simplifiers/simplifyParseTree.js';

export function testSimplifyParseTree(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': `from math import degrees
print(degrees(0))`,
		'out': `import math
print(math.degrees(0))`}
	];
	processTestCases(cases, simplifyParseTree, logger, true);
};