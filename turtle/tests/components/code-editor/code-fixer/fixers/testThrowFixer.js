import { processTestCases } from './processTestCases.js';
import { throwFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/throwFixer.js';

/*
This is for a command like:
https://fmslogo.sourceforge.io/manual/command-catch.html
*/
export function testThrowFixer(logger) {
	const cases = [
		{'code': 'p', 'logged': false},
		{'code': 'throw ', 'logged': false},
		{'code': '[throw "tag]', 'logged': false}, 
			// parent is not an instruction list.
		{'code': '[(throw "tag)]', 'logged': false}, 

		{'code': 'throw "tag', 'to': ' ', 'logged': true},
		{'code': '(throw "tag 1)', 'to': '  ', 'logged': true},
		{'code': 'throw "hi print "bye', 'to': '   ', 'logged': true},
		{'code': `to p
	throw "hi
end`, 'to': `to p
	stop 
end`, 'logged': true},
		{'code': 'if true [ throw "tag ]', 'to': 'assert not  true  ', 'logged': true},
		{'code': 'if true [ (throw "tag 3) ]', 'to': 'assert not  true   ', 'logged': true},
		{'code': 'if :x [ throw "tag ]', 'to': 'assert not  :x  ', 'logged': true},
		{'code': 'if or :x :y [ throw "tag ]', 'to': 'assert not  or :x :y  ', 'logged': true},
		{'code': 'if or :x :y [ (throw "tag 4) ]', 'to': 'assert not  or :x :y   ', 'logged': true},
	];
	processTestCases(cases, throwFixer, logger);
};