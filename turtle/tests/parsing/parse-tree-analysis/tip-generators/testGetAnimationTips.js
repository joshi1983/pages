import { getAnimationTips } from '../../../../modules/parsing/parse-tree-analysis/tip-generators/getAnimationTips.js';
import { processTipsTestCases } from './processTipsTestCases.js';

export function testGetAnimationTips(logger) {
	const cases = [
		{'code': '', 'numTips': 0},
		{'code': `animation.image 100 100 'https://i.giphy.com/media/ftAP63cOawNMdjc3Zo/giphy.webp' 0.4`, 'numTips': 0},
		{'code': 'print animation.time', 'numTips': 1},
		{'code': 'print animation.timeRatio', 'numTips': 1},
		{'code': 'print animation.clampedTimeRatio', 'numTips': 1},
		{'code': 'to animation.setup\nfd animation.time\nlocalmake "result createPList\noutput :result\nend', 'numTips': 1},
		{'code': 'to animation.setup\nfd animation.timeRatio\nlocalmake "result createPList\noutput :result\nend', 'numTips': 1},
		{'code': 'to animation.setup\nfd animation.clampedTimeRatio\nlocalmake "result createPList\noutput :result\nend', 'numTips': 1}
	];
	processTipsTestCases(cases, getAnimationTips, logger);
};