import { processTestCases } from './processTestCases.js';
import { webTurtleProcedureFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/webTurtleProcedureFixer.js';

export function testWebTurtleProcedureFixer(logger) {
	const cases = [
		{'code': 'to p\nmove 5\nend', 'logged': false},
		{'code': '# p\nmove 5\nreturn', 'to': 'to p\nmove 5\nend', 'logged': true},
		{'code': '# p\nmove 5\nRETURN', 'to': 'to p\nmove 5\nend', 'logged': true},
		{'code': 'return # p\nmove 5', 'to': 'return to p\nmove 5 end', 'logged': true},
	];
	processTestCases(cases, webTurtleProcedureFixer, logger);
};