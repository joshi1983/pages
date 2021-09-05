import { AlphaColour } from
'../../../../../modules/AlphaColour.js';
import { Colour } from
'../../../../../modules/Colour.js';
import { isFillTransparent } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isFillTransparent.js';
import { ShapeStyle } from
'../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Transparent } from
'../../../../../modules/Transparent.js';

export function testIsFillTransparent(logger) {
	const cases = [
	{'in': new ShapeStyle(), 'out': true},
	{'in': new ShapeStyle({'material': {'fill': {'color': Transparent}}}), 'out': true},
	{'in': new ShapeStyle({'material': {'fill': {'color': new AlphaColour('#0000')}}}), 'out': true},
	{'in': new ShapeStyle({'material': {'fill': {'color': new AlphaColour('#0fff')}}}), 'out': true},
	{'in': new ShapeStyle({'material': {'fill': {'color': new Colour('#800')}}}), 'out': false},
	{'in': new ShapeStyle({'material': {'fill': {'color': new AlphaColour('#8000')}}}), 'out': false},
	];
	testInOutPairs(cases, isFillTransparent, logger);
};