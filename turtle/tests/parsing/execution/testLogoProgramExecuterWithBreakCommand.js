import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterWithBreakCommand(logger) {
	const cases = [
		{'code': 'repeat 2 [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'for ["i 0 3] [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'while true [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'do.while [print "yo break print "yay] true print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'until false [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': `repeat 2 [
	make "z 0
	print ['before if, z=' :z]
	if :z < 0.0001 [
		break ; z < 0 so this should exit the repeat-loop.
	]
	print ["z= :z]
]
print "after`,
		'messages': ['[before if, z= 0]', 'after']
		},
		{
			'code': `repeat 2 [
	make "z 0
	print ['before if, z=' :z]
	if :z < 0.0001 [
		break ; z < 0 so this should exit the repeat-loop.
	]
	print ["z= :z]
	for ["x -1 1] [
	]
]
print "after`,
		'messages': ['[before if, z= 0]', 'after']
		},
		{'code': `print 'before all'
repeat 2 [
	make "z 0
	print ['before if, z=' :z]
	if :z < 0.0001 [
		break ; z < 0 so this should exit the repeat-loop.
	]
	print ["z= :z]
	for ["x -1 1] [
		print "hi
	]
]
print "after`,
		'messages': ['before all', '[before if, z= 0]', 'after']
		},
		{'code': `print 'before all'
repeat 2 [
	make "z 0
	print ['before if, z=' :z]
	if :z < 0.0001 [
		break ; z < 0 so this should exit the repeat-loop.
	]
	print ["z= :z]
	for ["x -1 1] [
		for ["y -1 1] [
			print "hi
		]
	]
]
print "after`,
		'messages': ['before all', '[before if, z= 0]', 'after']
		}
	];
	processExecuterTestCases(cases, logger);
};