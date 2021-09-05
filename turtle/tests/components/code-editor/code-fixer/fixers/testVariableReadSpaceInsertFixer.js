import { processTestCases } from './processTestCases.js';
import { variableReadSpaceInsertFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/variableReadSpaceInsertFixer.js';

export function testVariableReadSpaceInsertFixer(logger) {
	const cases = [
	{'code': 'forward :x', 'logged': false},
	{'code': 'forward:x', 'to': 'forward :x', 'logged': true},
	{'code': 'setXY:x :y', 'to': 'setXY :x :y', 'logged': true},
	{'code': 'setXYZ:x :y :z', 'to': 'setXYZ :x :y :z', 'logged': true},
	{'code': 'setXYZ:x:y :z', 'to': 'setXYZ :x :y :z', 'logged': true},
	{'code': 'setXYZ:x:y:z', 'to': 'setXYZ :x :y :z', 'logged': true},
	{'code': 'print :x + x:y', 'to': 'print :x + x :y', 'logged': true}
	];
	processTestCases(cases, variableReadSpaceInsertFixer, logger);
};