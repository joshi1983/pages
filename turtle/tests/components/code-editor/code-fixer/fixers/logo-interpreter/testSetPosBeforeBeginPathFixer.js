import { setPosBeforeBeginPathFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/setPosBeforeBeginPathFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testSetPosBeforeBeginPathFixer(logger) {
	const cases = [{
		'code': `beginpath
setpos [200 -200]`,
		'to': `
setpos [200 -200]beginpath`,
		'logged': true
	}];
	processTestCases(cases, setPosBeforeBeginPathFixer, logger);
};