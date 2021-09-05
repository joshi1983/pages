import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { Colour } from '../../../../../modules/Colour.js';
import { isFillOpaque } from '../../../../../modules/drawing/vector/drawing_optimization/hiding/isFillOpaque.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { stopsToGradient } from './stopsToGradient.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testIsFillOpaque(logger) {
	const cases = [
	{'in': new ShapeStyle(), 'out': false},
	{'in': new ShapeStyle({'pen': {'width': 0}}), 'out': false},
	{'in': new ShapeStyle({'material': {'fill': {'color': Transparent}}}), 'out': false},
	{'in': new ShapeStyle({'material': {'fill': {'color': new AlphaColour('#1000')}}}), 'out': false},
	{'in': new ShapeStyle({'material': {'fill': {'color': new Colour('#fff')}}}), 'out': true},
	{'in': new ShapeStyle({'material': {'fill': {'gradient':
	stopsToGradient([[0, new Colour('red')], [1, new Colour('black')]])}}}), 'out': true},
	{'in': new ShapeStyle({'material': {'fill': {'gradient':
	stopsToGradient([[0, Transparent], [1, new Colour('black')]])}}}), 'out': false},
	];
	testInOutPairs(cases, isFillOpaque, logger);
};