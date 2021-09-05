import { processTestCases } from '../processTestCases.js';
import { removeErroneousNumbersFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/removeErroneousNumbersFixer.js';

export function testRemoveErroneousNumbersFixer(logger) {
	const cases = [
	{'code': 'print 3', 'logged': false},
	{'code': 'label 3', 'logged': false},
	{'code': 'setXY 1 3', 'logged': false},
	{'code': 'setXYZ 1 2 3', 'logged': false},
	{'code': 'jumpTo [1 2 3]', 'logged': false},
	{'code': 'arcUp 10 100', 'logged': false},
	{'code': 'rpt 3 []', 'logged': false},
	{'code': 'to 2\nend\nrpt 3 [2]', 'logged': false},
	{'code': 'repeat 3 []', 'logged': false},
	{'code': 'repeat 3 [2]', 'to': 'repeat 3 []', 'logged': true},
	{'code': 'repeat 3 2[]', 'to': 'repeat 3 []', 'logged': true},
	{'code': 'rpt 3 2[]', 'to': 'rpt 3 []', 'logged': true},
	{'code': 'rpt 3 2 9[]', 'to': 'rpt 3  []', 'logged': true},
	{'code': 'omark j rpt 10 2[58 omark k]', 'to': 'omark j rpt 10 [ omark k]', 'logged': true},
	{'code': 'to 58\nend\nomark j rpt 10 2[58 omark k]', 'to': 'to 58\nend\nomark j rpt 10 [58 omark k]', 'logged': true},
	];
	processTestCases(cases, removeErroneousNumbersFixer, logger);
};