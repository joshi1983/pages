import { breakLinesInProcedures } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/breakLinesInProcedures.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testBreakLinesInProcedures(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'to p\nend', 'changed': false},
	{'in': 'to p\nprint "hi\nend', 'changed': false},
	{'in': 'to p :x\nend', 'changed': false},
	{'in': 'to p :x\nprint "hi\nend', 'changed': false},
	{'in': 'to p :x :y\nend', 'changed': false},
	{'in': 'to p :x :y\nprint :x\nend', 'changed': false},
	{'in': 'to p print :x\nend', 'out': 'to p \nprint :x\nend'},
	{'in': 'to p :x print :x\nend', 'out': 'to p :x \nprint :x\nend'},
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.changed === false)
			caseInfo.out = caseInfo.in;
	});
	testInOutPairs(cases, breakLinesInProcedures, logger);
};