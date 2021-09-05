import { isotoxalStar } from '../../../../modules/command-groups/helpers/drawing/isotoxalStar.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Turtle } from '../../../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function verifyAlwaysCentered(logger) {
	const cases = [
		[100, 50, 4],
		[50, 100, 4]
	];
	const settings = {'animationTime': 0};
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const drawing = new Vector2DDrawing();
		const turtle = new Turtle(settings, drawing);
		const args = caseInfo;
		turtle.isotoxalStar(...args);
		const shapes = drawing.getShapesArray();
		if (shapes.length !== 1)
			plogger(`Expected 1 shape but found ${shapes.length}`);
		else if (!(shapes[0] instanceof PathShape))
			plogger(`Expected a PathShape but found ${shapes[0]}`);
		else if (shapes[0].elements.length === 0)
			plogger(`Expected a PathShape to have at least 1 for elements.length but found ${shapes[0].elements.length}`);
		else {
			const path = shapes[0];
			let total = new Vector3D(0, 0, 0);
			const elements = path.elements;
			let startIndex = 0;
			if (elements[0].equalsCloseEnough(elements[elements.length - 1]))
				startIndex++; // don't let an equal start and end point bias the test result.
				// An equal first and ending point should look the same as having the first point removed.

			for (let i = startIndex; i < elements.length; i++) {
				const e = elements[i];
				if (!(e instanceof Vector3D))
					plogger(`Expected every element in PathShape to be a Vector3D but found something else at index ${i}.  That something else is ${e}`);
				else {
					total = total.plus(e);
				}
			}
			if (!total.equalsCloseEnough(new Vector3D(0, 0, 0)))
				plogger(`Expected the isotoxalStar points to add up to 0, 0, 0 but got ${total}`);
		}
	});
}

export function testIsotoxalStar(logger) {
	wrapAndCall([verifyAlwaysCentered], logger);
};