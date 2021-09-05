import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { colorToContext2DExpression } from '../../../../../modules/drawing/vector/shapes/gradients/colorToContext2DExpression.js';
import { Colour } from '../../../../../modules/Colour.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testColorToContext2DExpression(logger) {
	const cases = [
		{'in': Transparent, 'out': 'transparent'},
		{'in': new AlphaColour('#8f00'), 'out': 'rgba(255,0,0, 0.5333333333333333)'},
		{'in': new Colour('#f00'), 'out': '#FF0000'}
	];
	testInOutPairs(cases, colorToContext2DExpression, logger);
};