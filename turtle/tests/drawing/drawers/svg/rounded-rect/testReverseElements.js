import { ArcShape } from '../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { reverseElements } from '../../../../../modules/drawing/drawers/svg/rounded-rect/reverseElements.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

export function testReverseElements(logger) {
	const center = new Vector3D(10, 11, 12);
	const arcRadius = 5;
	const angle1 = 1;
	const arc = new ArcShape(center, 0, arcRadius, angle1);
	const elements = [new Vector3D(0, 1, 2), arc, new Vector3D(3, 4, 5)];
	reverseElements(elements);
	if (!(elements[0] instanceof Vector3D))
		logger(`Expected elements[0] to be a Vector3D but got ${elements[0]}`);
	else if (elements[0].getX() !== 3)
		logger(`Expected elements[0].getX() to return 3 but got ${elements[0].getX()}`);
	if (!(elements[1] instanceof ArcShape))
		logger(`Expected elements[1] to be an ArcShape but got ${elements[1]}`);
	else {
		const reversedArc = elements[1];
		if (reversedArc.radius !== arcRadius)
			logger(`Expected reversedArc.radius to be ${arcRadius} but got ${reversedArc.radius}`);
	}
	if (!(elements[2] instanceof Vector3D))
		logger(`Expected elements[2] to be an Vector3D but got ${elements[2]}`);
	else {
		if (elements[2].getX() !== 0)
			logger(`Expected elements[2].getX() to be 0 but got ${elements[2].getX()}`);
	}
	if (arc.angle !== angle1)
		logger(`Expected arc.angle to be ${angle1} but got ${arc.angle}`);
	if (arc.rotationRadians !== 0)
		logger(`Expected arc.rotationRadians to be 0 but got ${arc.rotationRadians}`);
	if (arc.radius !== arcRadius)
		logger(`Expected arc.radius to be ${arcRadius} but got ${arc.radius}`);
};