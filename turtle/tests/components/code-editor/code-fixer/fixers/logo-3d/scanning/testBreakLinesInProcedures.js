import { breakLinesInProcedures } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/breakLinesInProcedures.js';
import { LogoScanner } from
'../../../../../../../modules/parsing/LogoScanner.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

await LogoScanner.asyncInit();

export function testBreakLinesInProcedures(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'Make "a 1 make "b 2', 'out': 'Make "a 1 \nmake "b 2'},
	{'in': 'to p\nend', 'changed': false},
	{'in': 'to p\nprint "hi\nend', 'changed': false},
	{'in': 'to p :x\nend', 'changed': false},
	{'in': 'to p :x\nprint "hi\nend', 'changed': false},
	{'in': 'to p :x :y\nend', 'changed': false},
	{'in': 'to p :x :y\nprint :x\nend', 'changed': false},
	{'in': 'to p omark x\nend', 'out': 'to p \nomark x\nend'},
	{'in': 'to p make x 3\nend', 'out': 'to p \nmake x 3\nend'},
	{'in': 'to p print :x\nend', 'out': 'to p \nprint :x\nend'},
	{'in': 'to p :x print :x\nend', 'out': 'to p :x \nprint :x\nend'},
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.changed === false)
			caseInfo.out = caseInfo.in;
	});
	testInOutPairs(cases, breakLinesInProcedures, logger);
};