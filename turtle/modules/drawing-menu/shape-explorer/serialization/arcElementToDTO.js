import { MathCommands } from '../../../command-groups/MathCommands.js';

export function arcElementToDTO(arcShape) {
	const result = {
		'rotation': arcShape.rotationRadians / MathCommands.degToRadianScale,
		'radius': arcShape.radius,
		'angle': arcShape.angle / MathCommands.degToRadianScale
	};
	return result;
};