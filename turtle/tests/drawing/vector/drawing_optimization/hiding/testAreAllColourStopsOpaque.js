import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { areAllColourStopsOpaque } from '../../../../../modules/drawing/vector/drawing_optimization/hiding/areAllColourStopsOpaque.js';
import { Colour } from '../../../../../modules/Colour.js';
import { createRadialGradient } from '../../../../helpers/createRadialGradient.js';
import { EaseInOut } from '../../../../../modules/drawing/vector/easing/EaseInOut.js';
import { stopsToGradient } from './stopsToGradient.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

export function testAreAllColourStopsOpaque(logger) {
	const cases = [
	{'in': createRadialGradient(), 'out': false},
	{'in': stopsToGradient([[0, Transparent], [1, new Colour('blue')]]),
		'out': false},
	{'in': stopsToGradient([[0, new AlphaColour('red')], [1, new Colour('blue')]]),
		'out': true},
	{'in': stopsToGradient([[0, new AlphaColour('#1234')], [1, new Colour('blue')]]),
		'out': false},
	{'in': stopsToGradient([[0, new Colour('red')], [1, new Colour('blue')]]),
		'out': true},
	{'in': stopsToGradient([
		[0, new Colour("red")],
		[1, [new Colour("blue"), new EaseInOut()]]
	]), 'out': true},
	{'in': stopsToGradient([
		[0, new Colour("red")],
		[1, [Transparent, new EaseInOut()]]
	]), 'out': false},
	{'in': stopsToGradient([
		[0, new Colour("red")],
		[1, [new AlphaColour('#4321'), new EaseInOut()]]
	]), 'out': false},
	];
	testInOutPairs(cases, areAllColourStopsOpaque, logger);
};