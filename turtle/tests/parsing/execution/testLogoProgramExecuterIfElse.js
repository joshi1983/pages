import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterIfElse(logger) {
	const cases = [{'code': `to p
	repeat 2 [
		localmake "x ifElse even? repcount 1 0
		jumpLeft :x
	]
	print "hi
end

p`, 'messages': ['hi']},
	{'code': `to p
	repeat 2 [
		localmake "x ifElse even? repcount 1 0
		print :x
	]
end

p`, 'messages': ['0', '1']},
	{'code': `repeat 2 [
	make "x ifElse even? repcount 1 0
	print :x
]`, 'messages': ['0', '1']},
	{'code': `to p :height
	localmake "arcInfo [-0.255 0 16 53 0.85]
	jumpRight :height * item 1 :arcInfo
	localmake "arcAngle item 4 :arcInfo
	localmake "arcRadius :height * item 5 :arcInfo
	ifelse :arcAngle < 0 [
		arcLeft -:arcAngle :arcRadius
	] [
		arcRight :arcAngle :arcRadius
	]
end

p 100
print "hello`, 'messages': ['hello']},
	{'code': `repeat 2 [
	make "gap ifelse (even? repcount) 0.5 0.4
	print :gap
]`, 'messages': ['0.4', '0.5']},
	{'code': `make "radius 1
repeat 2 [
	make "gap :radius * ifelse (even? repcount) 0.5 0.4
	print :gap
]`, 'messages': ['0.4', '0.5']},
	{'code': `to double :x
	output :x * 2
end
	
make "radius 1
repeat 2 [
	make "gap :radius * ifelse (even? repcount) double 2 double 1
	print :gap
]`, 'messages': ['2', '4']}
	];
	processExecuterTestCases(cases, logger);
};