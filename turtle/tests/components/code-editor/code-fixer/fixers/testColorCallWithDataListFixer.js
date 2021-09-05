import { colorCallWithDataListFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/colorCallWithDataListFixer.js';
import { processTestCases } from './processTestCases.js';

/*
This is mostly fixing code written for:
https://github.com/rmmh/papert
which used to be hosted at
http://logo.twentygototen.org

Several example programs for it were mentioned at:
https://www.reddit.com/r/programming/comments/adz5d/what_is_the_coolest_thing_you_have_done_with_logo/
*/
export function testColorCallWithDataListFixer(logger) {
	const cases = [
		{'code': 'COLOR "red', 'logged': false},
		// I didn't see any examples of colour names being used at 
		// https://www.reddit.com/r/programming/comments/adz5d/what_is_the_coolest_thing_you_have_done_with_logo/
		// so I don't want to change the code.
		// Not changing the code is less likely to introduce unwanted changes than changing it.

		{'code': 'COLOR [1 2 3]', 'to': 'setPenColor [1 2 3]', 'logged': true},
		{'code': 'COLOUR [1 2 3]', 'to': 'setPenColor [1 2 3]', 'logged': true},
		{'code': 'COLOR [rand 255 rand 255 rand 255]', 'to': 'setPenColor [rand 255 rand 255 rand 255]', 'logged': true},
		{'code': 'COLOUR [rand 255 rand 255 rand 255]', 'to': 'setPenColor [rand 255 rand 255 rand 255]', 'logged': true},
	];
	processTestCases(cases, colorCallWithDataListFixer, logger);
};