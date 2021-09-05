import { fixScanTokens } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/fixScanTokens.js';
import { processScanTokenProcessCases } from
'./processScanTokenProcessCases.js';

export function testFixScanTokens(logger) {
	const cases = [
		{'code': 'to p end', 'tokens': ['to', 'p', 'end']},
		{'code': 'make x=3', 'tokens': ['make', '"x', '3']},
		{'code': 'MAKE X=3', 'tokens': ['make', '"X', '3']},
		{'code': 'local x=3', 'tokens': ['local', '"x', '3']},
		{'code': 'omark x', 'tokens': ['omark', '"x']},
		{'code': 'omark 3', 'tokens': ['omark', '3']},
		{'code': 'mark x', 'tokens': ['mark', '"x']},
		{'code': 'mark 3', 'tokens': ['mark', '3']},
		{'code': 'To p  Omark s end', 'tokens': ['to', 'p', 'Omark', '"s', 'end']},
		{'code': 'To p  Omark s ', 'tokens': ['to', 'p', 'Omark', '"s', 'end']},
		{'code': 'if x lt 10', 'tokens': ['if', 'x', '<', '10']},
		{'code': 'if x gt 10', 'tokens': ['if', 'x', '>', '10']},
		{'code': 'if c lt 10 []', 'tokens': ['if', 'c', '<', '10', '[', ']']},
		{'code': 'if c gt 10 []', 'tokens': ['if', 'c', '>', '10', '[', ']']},
		{'code': 'if 3 + c lt 10 []', 'tokens': ['if', '3', '+', 'c', '<', '10', '[', ']']},
		{'code': 'while x lt 10', 'tokens': ['while', 'x', '<', '10']},
		{'code': 'while x gt 10', 'tokens': ['while', 'x', '>', '10']},
	];
	processScanTokenProcessCases(cases, fixScanTokens, logger);
};