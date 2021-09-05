import { equalWithinThreshold } from '../../../../equalWithinThreshold.js';
import { LinearGradient } from './LinearGradient.js';
import { RadialGradient } from './RadialGradient.js';
import { SpreadMethod } from './SpreadMethod.js';

// This is a guard against results that would lead to unresponsive behaviour.
// The result from getNumCyclesForShapeAndGradient is used in loops which 
// we don't want running millions or billions of iterations through.
const absoluteMaxResult = 1000;

export function getNumCyclesForShapeAndGradient(shape, gradient) {
	if (gradient.spreadMethod === SpreadMethod.Pad)
		return 1;
	else {
		const box = shape.getBoundingBox();
		let gradientCycleSize;
		if (gradient instanceof RadialGradient)
			gradientCycleSize = gradient.radius;
		else if (gradient instanceof LinearGradient) {
			gradientCycleSize = gradient.from.minus(gradient.to).magnitude();
			if (box.isContaining(gradient.from) || box.isContaining(gradient.to)) {
				const threshold = gradientCycleSize * 0.00001;
				if (equalWithinThreshold(gradient.from.getY(), gradient.to.getY(), threshold))
					return Math.min(absoluteMaxResult, Math.ceil(2 * (box.max.getX() - box.min.getX()) / gradientCycleSize));
				if (equalWithinThreshold(gradient.from.getX(), gradient.to.getX(), threshold))
					return Math.min(absoluteMaxResult, Math.ceil(2 * (box.max.getY() - box.min.getY()) / gradientCycleSize));
			}
		}
		if (gradientCycleSize !== undefined)
			return Math.min(absoluteMaxResult, Math.ceil(box.getRadius() * 2 / gradientCycleSize));
	}
	return 20;
};