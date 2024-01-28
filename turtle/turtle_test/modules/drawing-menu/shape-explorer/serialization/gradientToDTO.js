import { LinearGradient } from '../../../drawing/vector/shapes/gradients/LinearGradient.js';
import { linearGradientToDTO } from './linearGradientToDTO.js';
import { radialGradientToDTO } from './radialGradientToDTO.js';
import { RadialGradient } from '../../../drawing/vector/shapes/gradients/RadialGradient.js';
import { SpreadMethod } from '../../../drawing/vector/shapes/gradients/SpreadMethod.js';

function colorStopsToDTO(colorStops) {
	const result = {};
	for (const [key, value] of colorStops) {
		result[key] = value;
	}
	return result;
}

export function gradientToDTO(gradient) {
	let result;
	if (gradient instanceof LinearGradient)
		result = linearGradientToDTO(gradient);
	else if (gradient instanceof RadialGradient)
		result = radialGradientToDTO(gradient);
	else
		result = {};
	Object.assign(result, {
		'type': gradient.constructor.name,
		'colorStops': colorStopsToDTO(gradient.colorStops),
		'spreadMethod': SpreadMethod.getNameFor(gradient.spreadMethod)
	});
	return result;
};