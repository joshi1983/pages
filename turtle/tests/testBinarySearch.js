import { binarySearch } from '../modules/binarySearch.js';
import { DeepEquality } from '../modules/DeepEquality.js';

function compareNumbers(num1, num2) {
	return num1 - num2;
}

export function testBinarySearch(logger) {
	const cases = [
	{
		'array': [],
		'targetValue': 5,
		'result': {
			'failingAtIndex': 0
		}
	},
	{
		'array': [5],
		'targetValue': 5,
		'result': 0
	},
	{
		'array': [1, 5, 10],
		'targetValue': 5,
		'result': 1
	},
	{
		'array': [1, 2, 3, 5],
		'targetValue': 5,
		'result': 3
	},
	{
		'array': [5, 7, 9, 15],
		'targetValue': 5,
		'result': 0
	},
	{
		'array': [7, 9, 15],
		'targetValue': 5,
		'result': {
			'failingAtIndex': 0
		}
	},
	{
		'array': [7, 9, 15],
		'targetValue': 25,
		'result': {
			'failingAtIndex': 2
		}
	}
	];
	cases.forEach(function(caseInfo, index) {
		const result = binarySearch(caseInfo.array, compareNumbers, caseInfo.targetValue);
		if (!DeepEquality.equals(result, caseInfo.result))
			logger(`Case ${index}. Expected ${JSON.stringify(caseInfo.result)} but got ${JSON.stringify(result)}`);
	});
};