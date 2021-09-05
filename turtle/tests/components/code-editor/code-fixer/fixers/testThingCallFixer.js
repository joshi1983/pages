import { thingCallFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/thingCallFixer.js';
import { processTestCases } from './processTestCases.js';

export function testThingCallFixer(logger) {
	const cases = [
		{'code': 'print thing :x', 'logged': false},
		{'code': 'print thing str :x', 'logged': false},
		{'code': 'print thing 1 + 2', 'logged': false},
		{'code': 'thing "*', 'logged': false}, // invalid identifier
		{'code': '[thing ]', 'logged': false},
		{'code': 'to p\nthing \nend', 'logged': false},
		{'code': 'to p\nprint thing \nend', 'logged': false},

		{'code': 'make "x 4\nprint thing "x', 'to': 'make "x 4\nprint :x ', 'logged': true},
		{'code': 'print thing "x', 'to': 'print :x ', 'logged': true},
		{'code': 'thing "x', 'to': ':x ', 'logged': true},
		{'code': 'print 4 + thing "x', 'to': 'print 4 + :x ', 'logged': true},
		{'code': 'print -thing "x', 'to': 'print -:x ', 'logged': true},
		{'code': 'print thing "x + 4', 'to': 'print :x  + 4', 'logged': true},
		{'code': 'print thing "x + 4 + 1', 'to': 'print :x  + 4 + 1', 'logged': true},
		{'code': 'print thing "x * 2 + 4', 'to': 'print :x  * 2 + 4', 'logged': true},
		{'code': 'print thing "x / 2 * 5 + 4', 'to': 'print :x  / 2 * 5 + 4', 'logged': true},
		{'code': 'print thing "x + 2 * 4', 'to': 'print :x  + 2 * 4', 'logged': true},
		{'code': 'print [thing "x]', 'to': 'print [:x ]', 'logged': true},
		{'code': 'to p\nprint thing "x\nend', 'to': 'to p\nprint :x \nend', 'logged': true},
	];
	processTestCases(cases, thingCallFixer, logger);
};