import { processFixerCases } from './processFixerCases.js';
import { removeRedundantScreenCalls } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/removeRedundantScreenCalls.js';

export function testRemoveRedundantScreenCalls(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'screen 1\n line -(100,100)', 'changed': false},
		{'code': 'goto 100\n200 screen 1\n line -(100,100)\n100 screen 9\ngoto 200', 'changed': false},
		{'code': 'screen 0', 'to': ''}, 
		// 0 is the default screen.
		// The screen mode would have been 0 before running that.

		{'code': 'screen 0\n line -(100,100)', 'to': '\n line -(100,100)'},
		{'code': 'screen 0\nscreen 9\n line -(100,100)', 'to': '\nscreen 9\n line -(100,100)'},
	];
	processFixerCases(cases, removeRedundantScreenCalls, logger);
};