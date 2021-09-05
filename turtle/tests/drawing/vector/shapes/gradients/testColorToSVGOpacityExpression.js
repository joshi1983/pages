import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { colorToSVGOpacityExpression } from '../../../../../modules/drawing/vector/shapes/gradients/colorToSVGOpacityExpression.js';
import { Colour } from '../../../../../modules/Colour.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testColorToSVGOpacityExpression(logger) {
	const cases = [
		{'in': Transparent, 'out': ' stop-opacity="0"'},
		{'in': new AlphaColour('#8f00'), 'out': ' stop-opacity="0.5333333333333333"'},
		{'in': new Colour('#f00'), 'out': ''}
	];
	testInOutPairs(cases, colorToSVGOpacityExpression, logger);
};