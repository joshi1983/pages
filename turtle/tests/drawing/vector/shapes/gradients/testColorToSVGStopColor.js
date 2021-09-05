import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { colorToSVGStopColor } from '../../../../../modules/drawing/vector/shapes/gradients/colorToSVGStopColor.js';
import { Colour } from '../../../../../modules/Colour.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testColorToSVGStopColor(logger) {
	const cases = [
		{'in': Transparent, 'out': 'black'},
		{'in': new AlphaColour('#8f00'), 'out': '#F00'},
		{'in': new AlphaColour('#88123456'), 'out': '#123456'},
		{'in': new Colour('#123456'), 'out': '#123456'},
		{'in': new Colour('#f00'), 'out': '#F00'}
	];
	testInOutPairs(cases, colorToSVGStopColor, logger);
};