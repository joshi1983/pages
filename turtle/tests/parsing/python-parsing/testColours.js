import { Colours } from '../../../modules/parsing/python-parsing/Colours.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testColours(logger) {
	const cases = [
	{'in': 'abcdefg', 'out': undefined},
	{'in': 'aliceblue', 'out': '#F0F8FF'},
	];
	testInOutPairs(cases, Colours.nameToHex, logger);
};