import { scanTemplateLiteralExpressions } from
'../../../../modules/parsing/js-parsing/scanning-template-literals/scanTemplateLiteralExpressions.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testScanTemplateLiteralExpressions(logger) {
	const cases = [
		{'in': 'hello', 'out': []},
		{'in': 'hello ${x}', 'out': ['x']},
		{'in': 'hello ${x}, ${msg}', 'out': ['x', 'msg']},
		{'in': 'hello ${X}, ${Msg}', 'out': ['X', 'Msg']},
		{'in': 'hello ${f()}', 'out': ['f()']}
	];
	testInOutPairs(cases, scanTemplateLiteralExpressions, logger);
};