import { processFixerCases } from './processFixerCases.js';
import { removeTrivialInfiniteLoops } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/removeTrivialInfiniteLoops.js';

export function testRemoveTrivialInfiniteLoops(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `while x
wend`, 'changed': false},
	{'code': `do while x
loop`, 'changed': false},
	{'code': `while 1
wend`, 'to': ''},
	{'code': `do while 1
loop`, 'to': ''},
	{'code': `do until 0
loop`, 'to': ''},
	{'code': `do
loop until 0`, 'to': ''},
	];
	processFixerCases(cases, removeTrivialInfiniteLoops, logger);
};