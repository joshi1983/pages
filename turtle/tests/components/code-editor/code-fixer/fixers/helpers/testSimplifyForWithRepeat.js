import { Command } from
'../../../../../../modules/parsing/Command.js';
import { processTestCases } from '../processTestCases.js';
import { simplifyForWithRepeat } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifyForWithRepeat.js';

await Command.asyncInit();

export function testSimplifyForWithRepeat(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'for [] []', 'logged': false},
		{'code': 'for ["i 0 10] []', 'logged': false},
			// must be in a procedure because affects to a global variable
			// might be desirable after the program halts.
			// Maybe the user wants to run print :i in the Commander Box.
			// We don't want a fixer to change the overall effects of
			// running the program outside of benefitial changes like executing faster.
		{'code': `to p
	for ["i 0 10] []
	print :i
end`, 'logged': false},
		{'code': `to p
	for ["i 0] []
end`, 'logged': false},
		{'code': `to p :i
	for ["i 0 10] []
end`, 'to': `to p :i
	repeat 11   []
end`, 'logged': true},
		{'code': `to p
	for ["i 0 10] []
end`, 'to': `to p
	repeat 11   []
end`, 'logged': true},
		{'code': `to p
	for ["i 0 10 0.1] []
end`, 'to': `to p
	repeat 101    []
end`, 'logged': true},
		{'code': `to p
	for ["i 1 10] [ print :i ]
end`, 'to': `to p
	repeat 10   [ print repcount ]
end`, 'logged': true},
		{'code': `to p
	for ["i 0 10] [ print :i ]
end`, 'to': `to p
	repeat 11   [ print ( repcount- 1)]
end`, 'logged': true},
		{'code': `to p
	for ["i 3 10] [ print :i ]
end`, 'to': `to p
	repeat 8   [ print ( repcount+ 2)]
end`, 'logged': true},
		{'code': `to p
	for ["i 3 10] [ print :i * 2 ]
end`, 'to': `to p
	repeat 8   [ print ( repcount+ 2 ) *2]
end`, 'logged': true},
		{'code': `to p
	for ["i 1 10 1] [ print :i ]
end`, 'to': `to p
	repeat 10    [ print repcount ]
end`, 'logged': true},
		{'code': `to p
	for ["i 0 10 0.1] [ print :i ]
end`, 'logged': false},
		// We don't want to convert to repeat when the :i would become something 
		// as complicated as
		// (repcount - 1) * 0.1
	];
	processTestCases(cases, simplifyForWithRepeat, logger);
};