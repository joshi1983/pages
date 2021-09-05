import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterWithSwap(logger) {
	const cases = [{
		'code': 'make "x 0 make "y 1 print :x print :y',
		'messages': ['0', '1']
	},{
		'code': 'make "x 0 make "y 1 swap "x "y print :x print :y',
		'messages': ['1', '0']
	}/*,{
		'code': 'to p\nlocalmake "x 0 localmake "y 1 swap "x "y print :x print :y\nend\np',
		'messages': ['1', '0']
	},{
		'code': 'to p\nlocalmake "x 0 make "y 1 swap "x "y print :x print :y\nend\np',
		'messages': ['1', '0']
	},{
		'code': 'to p\nmake "x 0 localmake "y 1 swap "x "y print :x print :y\nend\np',
		'messages': ['1', '0']
	}*/];
	processExecuterTestCases(cases, logger);
};