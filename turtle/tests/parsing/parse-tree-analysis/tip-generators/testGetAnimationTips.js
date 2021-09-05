import { getAnimationTips } from '../../../../modules/parsing/parse-tree-analysis/tip-generators/getAnimationTips.js';
import { processTipsTestCases } from './processTipsTestCases.js';

export function testGetAnimationTips(logger) {
	const cases = [
		{'code': '', 'numTips': 0},
		{'code': 'to animation.setup\nfd animation.time\nlocalmake "result createPList\noutput :result\nend', 'numTips': 1}
	];
	processTipsTestCases(cases, getAnimationTips, logger);
};