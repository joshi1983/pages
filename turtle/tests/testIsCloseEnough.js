import { isCloseEnough } from './helpers/isCloseEnough.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';

export function testIsCloseEnough(logger) {
	const cases = [
		{
			'in': [0, 0],
			'out': true
		},
		{
			'in': [0, 1],
			'out': false
		},
		{
			'in': [6.123233995736766e-17, 0],
			'out': true
		},
		{
			'in': [[], []],
			'out': true
		},
		{
			'in': [[1], [1]],
			'out': true
		},
		{
			'in': [[1, 2], [1, 2]],
			'out': true
		},
		{
			'in': [[1], [1, 2]],
			'out': false
		},
		{
			'in': [[6.123233995736766e-17], [0]],
			'out': true
		},
		{
			'in': [[[6.123233995736766e-17]], [[0]]],
			'out': true
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = isCloseEnough(...caseInfo.in);
		if (result !== caseInfo.out)
			plogger(`Expected result of ${caseInfo.out} but got ${result}`);
	});
};