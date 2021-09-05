import { Colour } from '../../modules/Colour.js';
import { getAverageColour } from '../../modules/colour/getAverageColour.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';
await Colour.asyncInit();

function wrappedGetAverageColour(colours) {
	const result = getAverageColour(colours);
	return result.toString();
}

export function testGetAverageColour(logger) {
	const cases = [
	{'in': [], 'out': '#000000'},
	{'in': [new Colour("white")], 'out': '#FFFFFF'},
	{'in': [new Colour("#F00"), new Colour("#000")], 'out': '#800000'},
	];
	testInOutPairs(cases, wrappedGetAverageColour, logger);
};