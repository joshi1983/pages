import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { Colour } from '../../../../../modules/Colour.js';
import { isPenOpaque } from '../../../../../modules/drawing/vector/drawing_optimization/hiding/isPenOpaque.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { stopsToGradient } from './stopsToGradient.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testIsPenOpaque(logger) {
	const cases = [
	{'in': new ShapeStyle(), 'out': true},
	{'in': new ShapeStyle({'pen': {'width': 0}}), 'out': false},
	{'in': new ShapeStyle({'pen': {'color': Transparent}}), 'out': false},
	{'in': new ShapeStyle({'pen': {'color': new AlphaColour('#1000')}}), 'out': false},
	{'in': new ShapeStyle({'pen': {'color': new Colour('#fff')}}), 'out': true},
	{'in': new ShapeStyle({'pen': {'gradient':
		stopsToGradient([[0, new Colour('red')], [1, new Colour('black')]])}}), 'out': true},
	{'in': new ShapeStyle({'pen': {'gradient':
		stopsToGradient([[0, Transparent], [1, new Colour('black')]])}}), 'out': false},
	];
	testInOutPairs(cases, isPenOpaque, logger);
};