import { createEllipticalGradient } from '../drawing/turtle-draw-state/createEllipticalGradient.js';
import { createLinearGradient } from '../drawing/turtle-draw-state/createLinearGradient.js';
import { createRadialGradient } from '../drawing/turtle-draw-state/createRadialGradient.js';
import { gradientSpreadMethod } from '../parsing/parse-tree-analysis/string-formats/gradientSpreadMethod.js';
import { Vector } from '../drawing/vector/Vector.js';

export class GradientCommands {
	constructor(turtle) {
		if (typeof turtle !== 'object')
			throw new Error(`GradientCommands constructor requires turtle to be an object but got ${turtle}`);
		this.turtle = turtle;
	}

	createEllipticalGradient(outerCentre, radius1, radius2, colorStops) {
		let rotationRadians = this.turtle.drawState.getHeading();
		return createEllipticalGradient(outerCentre, radius1, radius2, rotationRadians, colorStops, "pad");
	}

	createLinearGradient(p1, p2, colorStops, spreadMethod) {
		const msg = gradientSpreadMethod(spreadMethod);
		if (msg === undefined) {
			if (p1.length === p2.length && Vector.coordsEqual(p1, p2))
				throw new Error(`Can not create linear gradient where the start and end points are the same.  Both are specified as ${p1}`);

			return createLinearGradient(p1, p2, colorStops, spreadMethod);
		}
		else
			throw new Error(msg);
	}

	createRadialGradient(outerCentre, radius, colorStops) {
		return createRadialGradient(outerCentre, outerCentre, radius, colorStops, "pad");
	}

	createRadialGradient2(outerCentre, focus, radius, colorStops, spreadMethod) {
		const msg = gradientSpreadMethod(spreadMethod);
		if (msg === undefined)
			return createRadialGradient(outerCentre, focus, radius, colorStops, spreadMethod);
		else
			throw new Error(msg);
	}
};