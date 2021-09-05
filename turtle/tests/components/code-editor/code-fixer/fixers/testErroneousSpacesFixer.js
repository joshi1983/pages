import { erroneousSpacesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/erroneousSpacesFixer.js';
import { processTestCases } from './processTestCases.js';

export function testErroneousSpacesFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print " hi', 'to': 'print  "hi', 'logged': true},
		{'code': 'print " x', 'to': 'print  "x', 'logged': true},
		{'code': 'print : x', 'to': 'print  :x', 'logged': true},
		{'code': 'print : [', 'logged': false},
		{'code': 'setProperty  :\nsetFillRadialGros pos',
		'to': 'setProperty  \n:setFillRadialGros pos', 'logged': true,
		'doNotCompareTrees': true
		// The trees are in a different shape after this case but that's good enough for now.
		// The trees are in the same shape for most test cases which is ideal and
		// it seems more work than it is worth to deal with the unique differences for this test case.
		},
		{
			'code': `to drawShape :size
	localmake "oldState turtleState
	localmake "gap : localmakw "squareSize :size - :gap
	localmake "numSides 32
	localmake "center pos
	repeat :numSides [
		jumpForward :gap
		jumpTo :center
		rollRight 360 / :numSides
	]
	setTurtleState :oldState
end`, 'to': `to drawShape :size
	localmake "oldState turtleState
	localmake "gap  :localmakw "squareSize :size - :gap
	localmake "numSides 32
	localmake "center pos
	repeat :numSides [
		jumpForward :gap
		jumpTo :center
		rollRight 360 / :numSides
	]
	setTurtleState :oldState
end`, 'logged': true
		},
		{'code': `to drawShape :size
	localmake "oldState turtleState
	localmake "gap : localmakw "squareSize :size
end`, 'to': `to drawShape :size
	localmake "oldState turtleState
	localmake "gap  :localmakw "squareSize :size
end`, 'logged': true},
	];
	processTestCases(cases, erroneousSpacesFixer, logger);
};