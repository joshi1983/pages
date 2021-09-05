import { webTurtleProcedureFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/webTurtleProcedureFixer.js';
import { processTestCase } from './processTestCase.js';

export function testWebTurtleProcedureFixer(logger) {
	const cases = [
		{'code': 'to p\nmove 5\nend', 'logged': false},
		{'code': '# p\nmove 5\nreturn', 'to': 'to p\nmove 5\nend', 'logged': true},
		{'code': '# p\nmove 5\nRETURN', 'to': 'to p\nmove 5\nend', 'logged': true},
		{'code': 'return # p\nmove 5', 'to': 'return to p\nmove 5 end', 'logged': true},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, webTurtleProcedureFixer, logger);
	});
};