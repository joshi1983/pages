import { LineSegmentShape } from '../shapes/LineSegmentShape.js';
import { mergeOverlappingParallelLines } from './mergeOverlappingParallelLines.js';
import { PathShape } from '../shapes/PathShape.js';
import { Vector3D } from '../Vector3D.js';

function getEndPoint(element) {
	if (element instanceof Vector3D)
		return element;
	else
		return element.getEndPoint();
}

function getStartPoint(element) {
	if (element instanceof Vector3D)
		return element;
	else
		return element.position;
}

export function mergePathWithLine(path, line1) {
	if (path.preventPathJoin === true)
		return; // do not join.
	if (path.getStartPoint().equalsCloseEnough(line1.position) ||
	path.getEndPoint().equalsCloseEnough(line1.endPoint)) {
		line1.swapEndPoints();
	}
	if (path.elements.length >= 2) {
		if (path.elements[path.elements.length - 1] instanceof Vector3D) {
			const prevEndPoint = getEndPoint(path.elements[path.elements.length - 2]);
			const lastLine = new LineSegmentShape(prevEndPoint, path.elements[path.elements.length - 1]);
			const result = mergeOverlappingParallelLines(lastLine, line1);
			if (result !== undefined) {
				if (!result.position.equals(prevEndPoint))
					result.swapEndPoints();

				if (result.position.equals(prevEndPoint)) {
					const newElements = path.elements.slice(0);
					newElements[path.elements.length - 1] = result.endPoint;
					return new PathShape(newElements, false, path.style);
				}
			}
		}
		if (path.elements[0] instanceof Vector3D) {
			const prevEndPoint = getStartPoint(path.elements[1]);
			const lastLine = new LineSegmentShape(prevEndPoint, path.elements[0]);
			const result = mergeOverlappingParallelLines(lastLine, line1);
			if (result !== undefined) {
				if (!result.endPoint.equals(prevEndPoint))
					result.swapEndPoints();

				if (result.endPoint.equals(prevEndPoint)) {
					const newElements = path.elements.slice(0);
					newElements[0] = result.position;
					return new PathShape(newElements, false, path.style);
				}
			}
		}
	}
	if (path.getEndPoint().equalsCloseEnough(line1.position)) {
		const newElements = path.elements.slice(0);
		newElements.push(line1.endPoint);
		return new PathShape(newElements, false, path.style);
	}
	else if (path.getStartPoint().equalsCloseEnough(line1.endPoint)) {
		const newElements = path.elements.slice(0);
		newElements.unshift(line1.position);
		return new PathShape(newElements, false, path.style);
	}
};