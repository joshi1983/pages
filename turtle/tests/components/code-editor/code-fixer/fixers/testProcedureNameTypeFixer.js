import { procedureNameTypeFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/procedureNameTypeFixer.js';
import { processTestCases } from './processTestCases.js';

export function testProcedureNameTypeFixer(logger) {
	const cases = [
	{'code': 'print "Define', 'logged': false},
	{'code': 'to 1\nend', 'to': 'to p1\nend', 'logged': true},
	{'code': 'to 1\nprint "hi\nend', 'to': 'to p1\nprint "hi\nend', 'logged': true},
	{'code': 'to 1\nend\n1', 'to': 'to p1\nend\np1', 'logged': true},
	{'code': 'to 1 :x\nend\n1 2', 'to': 'to p1 :x\nend\np1 2', 'logged': true},
	{'code': 'to 1 :x :y\nend\n1 2 3', 'to': 'to p1 :x :y\nend\np1 2 3', 'logged': true},
	{'code': 'to 1a\nend', 'to': 'to p1a\nend', 'logged': true, 'ignoreParseErrors': true},
	{'code': 'to 1a\nend\n1a', 'to': 'to p1a\nend\np1a', 'logged': true, 'ignoreParseErrors': true},
	];
	processTestCases(cases, procedureNameTypeFixer, logger);
};