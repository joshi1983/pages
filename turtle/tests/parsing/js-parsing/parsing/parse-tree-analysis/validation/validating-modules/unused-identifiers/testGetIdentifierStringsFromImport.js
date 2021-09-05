import { DeepEquality } from
'../../../../../../../../modules/DeepEquality.js';
import { findToken } from
'../../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getIdentifierStringsFromImport } from
'../../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/unused-identifiers/getIdentifierStringsFromImport.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../../../helpers/prefixWrapper.js';

export function testGetIdentifierStringsFromImport(logger) {
	const cases = [
	{'code': 'import defaultExport from "module-name";',
	'token': {
		'type': ParseTreeTokenType.IMPORT
	}, 'out': ['defaultExport']
	},
	{'code': 'import { x } from "./x.js";',
	'token': {
		'type': ParseTreeTokenType.IMPORT
	}, 'out': ['x']
	},
	{'code': 'import { x, y } from "./x.js";',
	'token': {
		'type': ParseTreeTokenType.IMPORT
	}, 'out': ['x', 'y']
	},
	{'code': 'import { x as y } from "./x.js";',
	'token': {
		'type': ParseTreeTokenType.IMPORT
	}, 'out': ['y']
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, allTokens, plogger);
		if (token !== undefined) {
			const result = getIdentifierStringsFromImport(token);
			const comparisonResult = DeepEquality.equals(result, caseInfo.out);
			if (comparisonResult !== true)
				plogger(`Expected result to be ${caseInfo.out} but got ${result}`);
		}
	});
};