import { DeepEquality } from '../modules/DeepEquality.js';

export function testDeepEquality(logger) {
	const cases = [
		{'in': [null, null], 'out': true},
		{'in': [{}, {}], 'out': true},
		{'in': [[], []], 'out': true},
		{'in': [0, 0], 'out': true},
		{'in': [{'x': 1}, {'x': 1}], 'out': true},
		{'in': [{'p': {}}, {'p': {}}], 'out': true},
		{'in': [1, 2], 'out': false},
		{'in': [null, {}], 'out': false},
		{'in': [null, []], 'out': false},
		{'in': [null, 0], 'out': false},
		{'in': [{'x': 1}, 0], 'out': false},
		{'in': [{'x': 1}, {}], 'out': false},
		{'in': [null, 0], 'out': false},
		{'in': [{'x': 1}, {'x': 2}], 'out': false},
		{'in': [{'p': {'x': 1}}, {'p': {'x': 2}}], 'out': false},
		{'in': [new Map(), new Map()], 'out': true},
		{'in': [new Map(), []], 'out': false},
		{'in': [[], new Map()], 'out': false},
		{'in': [new Map([[0, '#fff']]), new Map()], 'out': false},
		{'in': [new Map([[0, '#fff']]), new Map([[0, '#ffe']])], 'out': false},
		{'in': [new Map([[0, '#fff']]), new Map([[1, '#fff']])], 'out': false},
	];
	cases.forEach(function(caseInfo) {
		const actualResult = DeepEquality.equals(caseInfo.in[0], caseInfo.in[1]);
		if (actualResult !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for checking equality of ' + JSON.stringify(caseInfo.in[0]) + ' with ' + JSON.stringify(caseInfo.in[1]));
	});
}