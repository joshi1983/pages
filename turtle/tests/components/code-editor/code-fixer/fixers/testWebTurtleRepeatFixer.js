import { processTestCase } from './processTestCase.js';
import { webTurtleRepeatFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/webTurtleRepeatFixer.js';

export function testWebTurtleRepeatFixer(logger) {
	const cases = [
		{'code': 'REPEAT 180[]', 'logged': false},
		{'code': 'REPEAT 180[\n  DRAW 3\n  RIGHT 2\n]', 'logged': false},
		{'code': 'REPEAT 180\nNEXT', 'to': 'REPEAT 180\n[]', 'logged': true},
		{'code': 'REPEAT 180\nfd 100\nNEXT', 'to': 'REPEAT 180\n[fd 100\n]', 'logged': true},
		{'code': 'REPEAT 180\n  DRAW 3\n  RIGHT 2\nNEXT', 'to': 'REPEAT 180\n  [DRAW 3\n  RIGHT 2\n]', 'logged': true},
		{'code': 'to p\nrepeat 4 move 5 next\nend', 'to': 'to p\nrepeat 4 [move 5 ]\nend', 'logged': true},
		{'code': `REPEAT 180
  DRAW 1
  RIGHT 2
NEXT
REPEAt 170
  DRAw 3
  RIGHt 4
NEXt`, 'to': `REPEAT 180
  [DRAW 1
  RIGHT 2
]
REPEAt 170
  [DRAw 3
  RIGHt 4
]`, 'logged': true},
		{'code': `repeat 6
  repeat 360
    draw 1
    right 1
  next
  right 60
next`, 'to': `repeat 6
  [repeat 360
    [draw 1
    right 1
  ]
  right 60
]`, 'logged': true}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		//caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, webTurtleRepeatFixer, logger);
	});
};