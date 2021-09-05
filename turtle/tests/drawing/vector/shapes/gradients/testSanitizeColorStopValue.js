import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { Colour } from '../../../../../modules/Colour.js';
import { EaseEase } from '../../../../../modules/drawing/vector/easing/EaseEase.js';
import { EaseLinear } from '../../../../../modules/drawing/vector/easing/EaseLinear.js';
import { GradientStopPoint } from '../../../../../modules/drawing/vector/shapes/gradients/GradientStopPoint.js';
import { sanitizeColorStopValue } from '../../../../../modules/drawing/vector/shapes/gradients/sanitizeColorStopValue.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Transparent } from '../../../../../modules/Transparent.js';

const easeLinear = new EaseLinear();

function equals(val1, val2) {
	if (val1 === val2)
		return true;
	if (val1.equals(val2))
		return true;
	return false;
}

export function testSanitizeColorStopValue(logger) {
	const cases = [
		{'in': Transparent, 'out': new GradientStopPoint(Transparent, easeLinear)},
		{'in': 'red', 'out': new GradientStopPoint(new Colour('red'), easeLinear)},
		{'in': new Colour('red'), 'out': new GradientStopPoint(new Colour('red'), easeLinear)},
		{'in': '#0123', 'out': new GradientStopPoint(new AlphaColour('#0123'), easeLinear)},
		{'in': new AlphaColour('#0123'), 'out': new GradientStopPoint(new AlphaColour('#0123'), easeLinear)},
		{'in': [new Colour('red'), new EaseEase()], 'out': new GradientStopPoint(new Colour('red'), new EaseEase())},
	];
	cases.forEach(caseInfo => caseInfo.equals = equals);
	testInOutPairs(cases, sanitizeColorStopValue, logger);
};