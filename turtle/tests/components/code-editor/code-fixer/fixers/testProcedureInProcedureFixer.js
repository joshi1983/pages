import { procedureInProcedureFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/procedureInProcedureFixer.js';
import { processTestCase } from './processTestCase.js';

export function testProcedureInProcedureFixer(logger) {
	const cases = [
	/*{'code': '', 'to': '', 'logged': false},
	{'code': 'to p\nend', 'to': 'to p\nend', 'logged': false},
	{'code': 'to p\nend\nto q\nend', 'to': 'to p\nend\nto q\nend', 'logged': false},
	*/{'code': `to p
to q
end`, 'to': `to p
end to q
end`,
	'logged': true
	}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, procedureInProcedureFixer, logger);
	});
};