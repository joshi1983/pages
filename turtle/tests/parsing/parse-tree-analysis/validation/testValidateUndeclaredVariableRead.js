import { validateUndeclaredVariableRead } from '../../../../modules/parsing/parse-tree-analysis/validation/validateUndeclaredVariableRead.js';
import { processValidationTestCases } from './processValidationTestCases.js';

export function testValidateUndeclaredVariableRead(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'make "x 5', 'error': false},
		{'code': 'to p\nlocalmake "x 5\nend', 'error': false},
		{'code': 'print :x', 'error': true},
		{'code': 'make "x 1', 'error': false},
		{'code': 'for ["x 1 5 1] [print :x]', 'error': false},
		{'code': 'for ["x 1 5 1] [print :X]', 'error': false}, // x is X because case insensitive.
		{'code': 'for ["x 1 5 1] [print :y]', 'error': true},
		{'code': 'make "x 1\nprint :x', 'error': false},
		{'code': 'to hello :x\nprint :x\nend', 'error': false},
		{'code': 'to hello :x\nprint :y\nend', 'error': true},
		{'code': 'make "y 1\nto hello :x\nprint :y\nend', 'error': false},
		{'code': 'to hello :x\nprint :y\nend\nmake "y 1', 'error': false},
		{'code': 'to hello :x\nlocalmake "y 1\nprint :y\nend', 'error': false},
		{'code': 'to hello :x\nfor ["y 1 5 1] [print :x]\nend', 'error': false},
		{'code': 'to hello :x\nfor ["y 1 5 1] [print :y]\nend', 'error': false},
		{'code': 'to p\nprint :x\nlocalmake "x 1\nprint :x\nend', 'error': true},
		{'code': 'to p\nlocalmake "x :x + 1\nprint :x\nend', 'error': true},
		{'code': 'to p\nmake "x :X + 15\nprint :x\nend', 'error': true},
		{'code': 'to p\nmake "x 5\nEnd\nto p2\np\neNd\nprint :X', 'error': true},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\np\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\np2\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\nprint :x', 'error': true},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\np3\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\np2\nprint :x', 'error': false},
		{'code': 'to p\nmake "x 5\nend\nto p2\np\nend\nto p3\np2\nend\np\nprint :x', 'error': false},
		{'code': 'make "x 1\nmake "x :x + 1', 'error': false},
		{'code': 'make "x :x + 1', 'error': true},
		{'code': 'to p\nmake "x :x + 1\nend', 'error': true},
		{'code': 'to p\nmake "x 5\nrepeat 2[\nMake "x :x + 1\n]\nend', 'error': false},
		{'code': 'to p\nprint :x\nmake "x 5\nend', 'error': true},
		{'code': 'to p\nrepeat 2[\nmake "x :x + 1\n]\nend', 'error': true},
		{'code': 'to p\nlocalmake "x :x + 1\nend', 'error': true},
		{'code': 'to p\nlocalmake "x 5\nrepeat 2 [\nlocalmake "x :x + 1\n]\nend', 'error': false},
		{'code': 'to p\nrepeat 2 [\nlocalmake "x :x + 1\n]\nend', 'error': true},
		{'code': `make "x 3
to p1
	make "x 6
end
print :x`,
			'error': false // There should be no problem.  The 3 should be printed.
		},
		{'code': 'make "x createPList\nsetProperty "x 0 "red', 'error': false},
		{'code': 'make "X createPList\nsetProperty "x 0 "red', 'error': false},// test variable name case-insensitive.
		{'code': 'make "x createPList\nsetProperty "X 0 "red', 'error': false}, // test variable name case-insensitive.
		{'code': 'to p\nmake "x createPList\nsetProperty "x 0 "red\nend', 'error': false},
		{'code': 'to p\nlocalmake "x createPList\nsetProperty "x 0 "red\nend', 'error': false},
		{'code': `to p
	localmake "x createPList
	setProperty "x "y 2
	output :x
end`, 'error': false},
		{'code': 'setProperty "x 0 "red', 'error': true},
		{'code': 'setProperty "x 0 \'red\'', 'error': true},
		{'code': `to p1
	make "x 0
end

to p2
	make "x 0
	make "x :x + 3
end`, 'error': false},
		{'code': `to p
	repeat 2 [
		print :x
		localmake "x 4
	]
end`, 'error': true},
		{'code': `to map :procName :listValue
	localmake "result []
	repeat count :listValue [
		queue2 "result (invoke :procName item repcount :listValue)
	]
	output :result
end`, 'error': false, 'warning': false},
		{'code': `to drawShape :size
	localmake "gap : localmakw "squareSize :size - :gap
	localmake "numSides 32
	localmake "center pos
	repeat :numSides [
		jumpForward :gap
	]
end`, 'error': false},
// the : localmakw  is erroneous but other validators will point that out instead of this one.
	];
	processValidationTestCases(cases, logger, validateUndeclaredVariableRead);
}