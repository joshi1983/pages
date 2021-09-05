import { mightBeReading } from
'../../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/unused-identifiers/mightBeReading.js';
import { ParseTreeTokenType } from
'../../../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processTokenFilterCases } from './processTokenFilterCases.js';

export function testMightBeReading(logger) {
	const cases = [
	{'code': 'import defaultExport from "./x.js";',
	'numExpected': 0},
	{'code': 'import { x } from "./x.js";',
	'numExpected': 0},
	{'code': 'import { x as y } from "./x.js";',
	'numExpected': 0},
	{'code': 'function f() {}',
	'numExpected': 0},
	{'code': 'class A {}',
	'numExpected': 0},
	{'code': 'f()',
	'numExpected': 1},
	{'code': 'x + 3',
	'numExpected': 1},
	{'code': 'x + y',
	'numExpected': 2},
	{'code': 'x + y * z',
	'numExpected': 3},
	{'code': 'export { A };',
	'numExpected': 1},
	{'code': 'export const x = 3;',
	'numExpected': 1},
	{'code': 'export let x = 3;',
	'numExpected': 1},
	];
	processTokenFilterCases(cases, ParseTreeTokenType.IDENTIFIER, mightBeReading, logger);
};