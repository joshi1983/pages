import { getDataTypeString } from
'../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/getDataTypeString.js';
import { getDescendentsOfType } from
'../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedFirstTokenFromArray } from
'../../../../../../modules/parsing/generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedTest(code) {
	const parseResult = parse(code);
	const declarations = getDescendentsOfType(parseResult.root, ParseTreeTokenType.DECLARATION);
	if (declarations.length === 0)
		throw new Error(`Unable to find any DECLARATION tokens for code: ${code}`);
	const firstDeclaration = getSortedFirstTokenFromArray(declarations);
	return getDataTypeString(firstDeclaration);
}

export function testGetDataTypeString(logger) {
	const cases = [
	{'in': 'boolean x;', 'out': 'boolean'},
	{'in': 'color x;', 'out': 'color'},
	{'in': 'int x;', 'out': 'int'},
	{'in': 'float x;', 'out': 'float'},
	{'in': 'int[] x;', 'out': 'int[]'},
	{'in': 'int[][] x;', 'out': 'int[][]'},
	{'in': 'int [ ] [ ] x;', 'out': 'int[][]'},
	{'in': 'long x;', 'out': 'long'},
	{'in': 'processing.A x;', 'out': 'processing.A'},
	{'in': 'processing.A [ ] [ ] x;', 'out': 'processing.A[][]'},
	{'in': 'processing.a.b.c.A x;', 'out': 'processing.a.b.c.A'},
	{'in': 'String x;', 'out': 'String'},
	];
	testInOutPairs(cases, wrappedTest, logger);
};