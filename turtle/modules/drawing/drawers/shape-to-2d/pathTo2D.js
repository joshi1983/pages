import { ArcShape } from
'../../vector/shapes/ArcShape.js';
import { arcTo2D } from './arcTo2D.js';
import { PathShape } from
'../../vector/shapes/PathShape.js';
import { Vector3D } from '../../vector/Vector3D.js';

/**
Tries to get a 2D version of the pathShape.
*/
export function pathTo2D(pathShape) {
	const firstElement = pathShape.elements[0];
	if (firstElement instanceof Vector3D) {
		const elements = [];
		let isCloneNeeded = false;
		for (const element of pathShape.elements) {
			if (element instanceof Vector3D) {
				if (element.getZ() !== 0)
					isCloneNeeded = true;
				elements.push(new Vector3D(element.getX(), element.getY(), 0));
			}
			else if (element instanceof ArcShape) {
				if (element.position.getZ() !== 0)
					isCloneNeeded = true;
				elements.push(arcTo2D(element));
			}
			else {
				
				isCloneNeeded = false;
			}
		}
		if (isCloneNeeded)
			return new PathShape(elements, pathShape.isClosed, pathShape.style.deepClone());
	}
	return pathShape;
};