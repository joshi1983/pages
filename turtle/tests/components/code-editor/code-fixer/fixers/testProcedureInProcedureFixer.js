import { procedureInProcedureFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/procedureInProcedureFixer.js';
import { processTestCases } from './processTestCases.js';

export function testProcedureInProcedureFixer(logger) {
	const cases = [
	{'code': '', 'logged': false},
	{'code': 'to p\nend', 'logged': false},
	{'code': 'to p\nend\nto q\nend', 'logged': false},
	{'code': `to p
to q
end`, 'to': `to p
end to q
end`,
	'logged': true
	}
	];
	processTestCases(cases, procedureInProcedureFixer, logger);
};