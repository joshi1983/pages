import { mix } from '../../../modules/command-groups/helpers/mix.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { Transparent } from '../../../modules/Transparent.js';

export function testMix(logger) {
	const cases = [
		{'inArgs': [2, 3, 0.5], 'out': 2.5},
		{'inArgs': [[0, 0, 0, 0, 0], [2, 4, 6, 8, 10], 0.5], 'out': [1, 2, 3, 4, 5]},
		{'inArgs': [[0, 0, 0], Transparent, 0.5], 'out': [127.5, 0, 0, 0]},
		{"inArgs": [[0, 0, 0], "#0fff", 0.5], 'out': [127.5, 127.5, 127.5, 127.5]},
		{"inArgs": ["#fff", Transparent, 0.5], 'out': [127.5, 255, 255, 255]},
		{"inArgs": ["#fff", Transparent, 1], 'out': [255, 255, 255, 255]},
		{"inArgs": ["#fff", Transparent, 0], 'out': [0, 255, 255, 255]}
	];
	testInOutPairs(cases, mix, logger);
};