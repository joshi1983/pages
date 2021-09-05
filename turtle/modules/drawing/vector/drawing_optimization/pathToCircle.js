import { ArcShape } from '../shapes/ArcShape.js';
import { CircleShape } from '../shapes/CircleShape.js';
import { clampRadianAngle } from '../../../clampRadianAngle.js';
import { equalWithinThreshold } from '../../../equalWithinThreshold.js';
import { Transparent } from '../../../Transparent.js';
import { Vector } from '../Vector.js';
import { Vector3D } from '../Vector3D.js';
const twoPi = Math.PI * 2;
const angleErrorThreshold = 0.0001;

function filterElements(elements) {
	const result = [];
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (element instanceof ArcShape) {
			result.push(element);
		}
		else {
			if (i > 0) {
				const prev = elements[i - 1];
				if (prev instanceof ArcShape &&
				Vector.coordsEqualEnough(prev.getEndPoint().coords, element.coords)) {
					continue;
				}
			}
			if (i < elements.length - 1) {
				const next = elements[i + 1];
				if (next instanceof ArcShape &&
				Vector.coordsEqualEnough(next.getStartPoint().coords, element.coords))
					continue;
			}
			result.push(element);
		}
	}
	return result;
}

export function pathToCircle(path) {
	const elements = filterElements(path.elements);
	const firstElement = elements[0];
	const lastElement = elements[elements.length - 1];
	if (firstElement.style === undefined)
		return;
	const style = path.style.deepClone();
	if (path.isClosed === false) {
		style.setFillColor(Transparent);
	}
	let angleTotal = 0;
	for (let i = 0; i < elements.length; i++) {
		const shape = elements[i];
		if (!(shape instanceof ArcShape))
			return;
		if (i > 0) {
			const prev = elements[i - 1];
			if (!equalWithinThreshold(shape.radius, prev.radius, angleErrorThreshold))
				return;
			if (!Vector.coordsEqualEnough(prev.getEndPoint().coords, shape.getStartPoint().coords))
				return;
			if (!Vector.coordsEqualEnough(prev.position.coords, shape.position.coords))
				return;
		}
		angleTotal += shape.angle;
	}
	if (Math.abs(angleTotal) > twoPi ||
	!equalWithinThreshold(Math.abs(angleTotal), twoPi, angleErrorThreshold))
		return;
	const radius = firstElement.radius;
	return new CircleShape(firstElement.position, radius, style);
};