import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { isCustomFunctionOrSub } from
'../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/isCustomFunctionOrSub.js';
import { parse } from
'../../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testIsCustomFunctionOrSub(logger) {
	const cases = [
		{
			'code': `sub f()
end sub`,
			'checks': [
				{'in': 'f', 'out': true},
				{'in': 'F', 'out': true},
				{'in': 'p', 'out': false}
			]
		},
		{
			'code': `DEF FNf()
	FNf = 3
end def`,
			'checks': [
				{'in': 'FNf', 'out': true},
				{'in': 'fnF', 'out': true},
				{'in': 'f', 'out': false},
				{'in': 'p', 'out': false}
			]
		},
		{
			'code': `function f()
end function`,
			'checks': [
				{'in': 'f', 'out': true},
				{'in': 'F', 'out': true},
				{'in': 'p', 'out': false}
			]
		},
		{
			'code': 'dim f)',
			'checks': [
				{'in': 'f', 'out': false},
				{'in': 'F', 'out': false},
				{'in': 'p', 'out': false}
			]
		},
		{
			'code': 'const f = 4',
			'checks': [
				{'in': 'f', 'out': false},
				{'in': 'F', 'out': false},
				{'in': 'p', 'out': false}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code, logger);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}, in=${checkInfo.in}`, plogger);
			const out = isCustomFunctionOrSub(parseResult.root, checkInfo.in);
			assertEquals(checkInfo.out, out, clogger);
		});
	});
};