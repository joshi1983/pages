import { equalWithinThreshold } from '../../../../equalWithinThreshold.js';
import { getLengths } from './getLengths.js';
import { getTransformInfo } from './getTransformInfo.js';
import { LineCap } from '../../../vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../../../vector/shapes/style/LineJoinStyle.js';
import { Vector } from '../../../vector/Vector.js';
import { Vector3D } from '../../../vector/Vector3D.js';

export function isSimpleRect(path) {
	const elements = path.elements;
	if (elements.length < 4 || elements.length > 5)
		return false;
	if (!path.isClosed) {
		if (elements.length === 4)
			return false; // a rectangular U shape is not a rectangle because it is open.
		if (elements.length === 5 && path.style.isPenVisible()) {
			/*
			This can be extremely subtle but the point where the lines meet
			will look different if either of the line cap or line join style are not round.
			*/
			if (path.style.getLineJoinStyle() !== LineJoinStyle.Round ||
			path.style.getLineCap() !== LineCap.Round)
				return false;
		}
	}
	if (elements.some(e => !(e instanceof Vector3D)))
		return false;
	const lengthInfo = getLengths(elements);
	const lengths = lengthInfo.lengths;
	let length = lengthInfo.length;

	const errorThreshold = length * 0.000001;
	// if there are 5 points, is the last 1 equal to the first?
	if (elements.length === 5) {
		const displacement = elements[4].minus(elements[0]);
		const len = Vector.euclideanDistance(displacement.coords);
		if (len > errorThreshold)
			return false;
	}
	// Are opposite sides of equal length?
	if (!equalWithinThreshold(lengths[0], lengths[2], errorThreshold) ||
	!equalWithinThreshold(lengths[1], lengths[3], errorThreshold))
		return false;
	// At this point, we know the path is of a parallelogram.

	// 90 degree angles is the only distinction between parallelograms and rectangles.
	// are the angles 90 degrees?
	const v1 = elements[1].minus(elements[0]);
	const v2 = elements[2].minus(elements[1]);
	const cosRatio = Vector.dotProduct(v1.coords, v2.coords) / (v1.magnitude() * v2.magnitude());
	if (!equalWithinThreshold(cosRatio, 0, 0.0001))
		return false;
	/*
	A cos ratio of very close to 0 is very close to 90 degrees or -90 degrees.
	*/
	
	/* We don't want to use a rect element if we also have to transform a gradient. */
	const penGradient = path.style.getPenGradient();
	const fillGradient = path.style.getFillGradient();
	// if any gradients are used, check if the SVG transform attribute will be needed.
	if (penGradient !== undefined || fillGradient !== undefined) {
		const transformInfo = getTransformInfo(elements);
		const rotationRadians = transformInfo.rotationRadians % (Math.PI / 2);
		/*
		pi / 2 radians = 90 degrees.
		Any 90 degree rotation can be handled without an SVG transform attribute.
		*/
		if (Math.abs(rotationRadians) > 0.0001) {
			return false;
		}
	}
	return true;
};