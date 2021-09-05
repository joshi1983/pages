import { fullCircleArcFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/fullCircleArcFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testFullCircleArcFixer(logger) {
	const cases = [{
		'code': `beginpath
arc 36 :x`,
		'logged': false
	},{
		'code': `beginpath
circle :x`,
		'logged': false
	},{
		'code': `beginpath
arc 360 :x`,
		'to': `beginpath
circle  :x`,
		'logged': true
	},{
		'code': `beginpath
arc 360 3`,
		'to': `beginpath
circle  3`,
		'logged': true
	}];
	processTestCases(cases, fullCircleArcFixer, logger);
};