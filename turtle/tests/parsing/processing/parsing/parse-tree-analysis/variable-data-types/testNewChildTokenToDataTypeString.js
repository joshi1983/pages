import { getDescendentsOfType } from
'../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { newChildTokenToDataTypeString } from
'../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/newChildTokenToDataTypeString.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedDataTypeGetter(code) {
	const newTokens = getDescendentsOfType(parse(code).root, ParseTreeTokenType.NEW);
	if (newTokens.length === 1) {
		return newChildTokenToDataTypeString(newTokens[0].children[0]);
	}
}

export function testNewChildTokenToDataTypeString(logger) {
	const cases = [
	{'in': 'new A()', 'out': 'A'},
	{'in': 'new String()', 'out': 'String'},
	{'in': 'new package1.package2.A()', 'out': 'package1.package2.A'},

	{'in': 'new String[10]', 'out': 'String[]'},
	{'in': 'new package1.package2.A[20]', 'out': 'package1.package2.A[]'}
	];
	testInOutPairs(cases, wrappedDataTypeGetter, logger);
};