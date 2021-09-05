import { DeepEquality } from '../modules/DeepEquality.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';

export function testDeepEquality(logger) {
	const cases = [
		{'inArgs': [null, null], 'out': true},
		{'inArgs': [{}, {}], 'out': true},
		{'inArgs': [[], []], 'out': true},
		{'inArgs': [0, 0], 'out': true},
		{'inArgs': [{'x': 1}, {'x': 1}], 'out': true},
		{'inArgs': [{'p': {}}, {'p': {}}], 'out': true},
		{'inArgs': [1, 2], 'out': false},
		{'inArgs': [null, {}], 'out': false},
		{'inArgs': [null, []], 'out': false},
		{'inArgs': [null, 0], 'out': false},
		{'inArgs': [{'x': 1}, 0], 'out': false},
		{'inArgs': [{'x': 1}, {}], 'out': false},
		{'inArgs': [null, 0], 'out': false},
		{'inArgs': [{'x': 1}, {'x': 2}], 'out': false},
		{'inArgs': [{'p': {'x': 1}}, {'p': {'x': 2}}], 'out': false},
		{'inArgs': [new Map(), new Map()], 'out': true},
		{'inArgs': [new Map(), []], 'out': false},
		{'inArgs': [[], new Map()], 'out': false},
		{'inArgs': [new Map([[0, '#fff']]), new Map()], 'out': false},
		{'inArgs': [new Map([[0, '#fff']]), new Map([[0, '#ffe']])], 'out': false},
		{'inArgs': [new Map([[0, '#fff']]), new Map([[1, '#fff']])], 'out': false},
		{'inArgs': [NaN, NaN], 'out': true},
		{'inArgs': [NaN, undefined], 'out': false},
		{'inArgs': [NaN, 0], 'out': false},
		{'inArgs': [NaN, null], 'out': false},
		{'inArgs': [NaN, {}], 'out': false},
		{'inArgs': [undefined, NaN], 'out': false},
	];
	testInOutPairs(cases, DeepEquality.equals, logger);
}