import { localFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/localFixer.js';
import { processTestCases } from './processTestCases.js';

export function testLocalFixer(logger) {
	const cases = [
		{'code': 'make "x 5', 'logged': false},
		{'code': 'to p\nlocalmake "x 5\nend', 'logged': false},
		{'code': 'to p\nlocal "x\nend', 'to': 'to p\n \nend', 'logged': true},
		{'code': 'to p :x\nlocal "x\nend', 'to': 'to p :x\n \nend', 'logged': true},
		{'code': 'to p\nlocal "x make "x 5\nend', 'to': 'to p\n  localmake "x 5\nend', 'logged': true},
		{'code': 'make "y 1\nto p\nlocal "x make "y 5\nend', 'to': 'make "y 1\nto p\n  make "y 5\nend', 'logged': true},
		// y is still global so don't change make to localmake.
		{'code': 'to p\nlocal "x print :x\nend\nto q\nlocalmake "x 3\np\nend',
			'to': 'to p\n:x  print :x\nend\nto q\nlocalmake "x 3\np\n:x end', 'logged': true},
		{'code': 'to p\n(LOCAL "tp "ps "h "dr)\nend',
			'to': 'to p\n    \nend',
			'logged': true},
		{
		'code': `to p
	(local "x "y)
	make "x 3
	make "y 5
	print :x
	print :y
end`, 'to': `to p
	  
	localmake "x 3
	localmake "y 5
	print :x
	print :y
end`, 'logged': true},
		{'code': `to p
	localmake "x 4
	q
end

to q
	print :x
end`, 'to': `to p
	localmake "x 4
	q
:x end

to q
	:x print :x
end`, 'logged': true}, // formatting is weird there but it is good enough for now.
// The Edit -> Format Code feature can fix the formatting but this test code is error-free.
{'code': `to drawShape :size
	localmake "gap : localmakw "squareSize :size - :gap
	localmake "numSides 32
	localmake "center pos
	repeat :numSides [
		jumpForward :gap
	]
end`, 'logged': false}
	];
	processTestCases(cases, localFixer, logger);
};