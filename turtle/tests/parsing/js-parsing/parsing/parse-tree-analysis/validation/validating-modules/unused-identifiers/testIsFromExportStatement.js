import { isFromExportStatement } from
'../../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/unused-identifiers/isFromExportStatement.js';
import { ParseTreeTokenType } from
'../../../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processTokenFilterCases } from './processTokenFilterCases.js';

export function testIsFromExportStatement(logger) {
	const cases = [
	{'code': 'export { x };',
	'numExpected': 1},
	{'code': 'export { x, y };',
	'numExpected': 2},
	{'code': 'export { x, y, z };',
	'numExpected': 3},
	{'code': 'export const x = 1;',
	'numExpected': 1},
	{'code': 'export let x = 1;',
	'numExpected': 1},
	{'code': 'export default expression;',
	'numExpected': 1},
	{'code': 'export default function () {}',
	'numExpected': 0},
	{'code': 'export default function functionName() {}',
	'numExpected': 1},
	{'code': 'export default class ClassName {}',
	'numExpected': 1}
	];
	processTokenFilterCases(cases, ParseTreeTokenType.IDENTIFIER, isFromExportStatement, logger);
};