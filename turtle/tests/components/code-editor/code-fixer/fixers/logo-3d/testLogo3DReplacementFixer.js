import { logo3DReplacementFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DReplacementFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testLogo3DReplacementFixer(logger) {
	const cases = [
	{'code': 'fd 100', 'logged': false},
	{'code': 'pu', 'logged': false},
	{'code': 'pd', 'logged': false},
	{'code': 'lt x', 'logged': false},
	{'code': 'fd -5 lt 90', 'logged': false},
	{'code': 'repeat 10 [fd -5 lt 90]', 'logged': false},
	{'code': 'rpt 1 []', 'to': 'repeat 1 []', 'logged': true},
	{'code': 'pause 1.4', 'to': ' ', 'logged': true},
	{'code': 'sc red', 'to': 'setColors red', 'logged': true},
	{'code': 'sbgc green', 'to': 'setScreenColor green', 'logged': true},
	{'code': '4 gt x', 'to': '4 > x', 'logged': true},
	{'code': '4 gte x', 'to': '4 >= x', 'logged': true},
	{'code': '4 lte x', 'to': '4 <= x', 'logged': true},
	{'code': 'if 4 lt x []', 'to': 'if 4 < x []', 'logged': true},
	{'code': 'if 4 lt :x []', 'to': 'if 4 < :x []', 'logged': true},
	];
	processTestCases(cases, logo3DReplacementFixer, logger);
};