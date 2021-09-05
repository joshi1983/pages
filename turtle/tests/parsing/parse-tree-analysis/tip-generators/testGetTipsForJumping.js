import { getTipsForJumping } from '../../../../modules/parsing/parse-tree-analysis/tip-generators/getTipsForJumping.js';
import { processTipsTestCases } from './processTipsTestCases.js';

export function testGetTipsForJumping(logger) {
	const cases = [
		{'code': '', 'numTips': 0},
		{'code': `p
jumpForward 100
left 90`, 'numTips': 0},
		{'code': `to p
end
		
p
jumpForward 100
left 90`, 'numTips': 0},
		{'code': `p
jumpForward 100
p`, 'numTips': 0},
		{'code': `to p
end
		
p
jumpForward 100
p`, 'numTips': 0},
		{'code': `right 45
jumpForward 100
left 90`, 'numTips': 0},
		{'code': `right 90
jumpForward 100
left 45`, 'numTips': 0},
		{'code': `right 90
jumpForward 100
left 90`, 'numTips': 1},
		{'code': `right 90
jumpBackward 100
left 90`, 'numTips': 1},
		{'code': `left 90
jumpForward 100
right 90`, 'numTips': 1},
		{'code': `make "x 90
left :x
jumpForward 100
right :x`, 'numTips': 1},
		{'code': `left 90
jumpBackward 100
right 90`, 'numTips': 1},
		{'code': `right 90
jumpBackward 100
right -90`, 'numTips': 1},
		{'code': `left -90
jumpForward 100
right -90`, 'numTips': 1},
		{'code': `left -90
jumpBackward 100
right -90`, 'numTips': 1},
		{'code': `LEFT -90
JUMPBackward 100
RIGHT -90`, 'numTips': 1}
	];
	processTipsTestCases(cases, getTipsForJumping, logger);
};