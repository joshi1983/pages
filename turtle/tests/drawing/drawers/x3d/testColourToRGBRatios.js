import { AlphaColour } from '../../../../modules/AlphaColour.js';
import { Colour } from '../../../../modules/Colour.js';
import { ColourToRGBRatios } from '../../../../modules/drawing/drawers/x3d/ColourToRGBRatios.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
await Colour.asyncInit();

export function testColourToRGBRatios(logger) {
	const cases = [
		{'in': new AlphaColour('black'), 'out': '0 0 0'},
		{'in': new Colour(0, 0, 0), 'out': '0 0 0'},
		{'in': new Colour(255, 0, 0), 'out': '1 0 0'},
		{'in': new Colour(0, 255, 0), 'out': '0 1 0'},
		{'in': new Colour(0, 0, 255), 'out': '0 0 1'},
		{'in': new Colour(255, 255, 255), 'out': '1 1 1'},
	];
	testInOutPairs(cases, ColourToRGBRatios, logger);
};