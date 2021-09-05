import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterWithSwap(logger) {
	const cases = [{
		'code': 'make "x 0 make "y 1 print :x print :y',
		'messages': ['0', '1']
	},{
		'code': 'make "x 0 make "y 1 swap "x "y print :x print :y',
		'messages': ['1', '0']
	},{
		'code': 'to p\nlocalmake "x 0 localmake "y 1 swap "x "y print :x print :y\nend\np',
		'messages': ['1', '0']
	},{
		'code': 'to p\nlocalmake "x 0 make "y 1 swap "x "y print :x print :y\nend\np',
		'messages': ['1', '0']
	},{
		'code': 'to p\nmake "x 0 localmake "y 1 swap "x "y print :x print :y\nend\np',
		'messages': ['1', '0']
	},{
		'code': `to p :sign
	localmake "x1 1
	localmake "x2 2
	localmake "x1_ :x1
	localmake "x2_ :x2
	if :sign < 0 [
		swap "x1_ "x2_
	]
	print [:x1_ :x2_]
end

p 1
p -1`,
		'messages': ['[1 2]', '[2 1]']
	}];
	processExecuterTestCases(cases, logger);
};