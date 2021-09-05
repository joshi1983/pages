import { getAllImportedPackages } from
'../../../../modules/parsing/python-parsing/parse-tree-analysis/getAllImportedPackages.js';
import { parse } from
'../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

function wrappedGetAllImportedPackageNames(code) {
	const parseResult = parse(code);
	const importedPackages = getAllImportedPackages(parseResult.root);
	const resultArray = Array.from(importedPackages.keys());
	resultArray.sort();
	return resultArray;
}

function testWithNames(logger) {
	const cases = [
		{'in': '', 'out': []},
		{'in': 'import math', 'out': ['math']},
		{'in': 'from math import sin', 'out': ['math']},
		{'in': 'from math import cos, sin', 'out': ['math']},
		{'in': 'from math import *', 'out': ['math']},
		{'in': 'import colorsys', 'out': ['colorsys']},
		{'in': 'import math\nimport colorsys', 'out': ['colorsys', 'math']},
	];
	testInOutPairs(cases, wrappedGetAllImportedPackageNames, logger);
}

export function testGetAllImportedPackages(logger) {
	testWithNames(prefixWrapper('testWithNames', logger));
};