import { AlphaColour } from '../../modules/AlphaColour.js';
import { Colour } from '../../modules/Colour.js';
import { equalColours } from '../../modules/colour/equalColours.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';
import { Transparent } from '../../modules/Transparent.js';

export function testEqualColours(logger) {
	const cases = [
		{'inArgs': [new AlphaColour("#000"), new Colour("black")], 'out': true},
		{'inArgs': [new AlphaColour("#8000"), new Colour("black")], 'out': false},
		{'inArgs': [new Colour("#000"), new Colour("black")], 'out': true},
		{'inArgs': [new Colour("#f00"), new Colour("black")], 'out': false},
		{'inArgs': [new AlphaColour("#0000"), Transparent], 'out': false},
		{'inArgs': [Transparent, Transparent], 'out': true},
		{'inArgs': [Transparent, new Colour("black")], 'out': false},
	];
	// equalp should give the same result if the parameters are reversed so add test cases checking that.
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		cases.push({
			'inArgs': caseInfo.inArgs.slice().reverse(),
			'out': caseInfo.out
		});
	}
	testInOutPairs(cases, equalColours, logger);
};