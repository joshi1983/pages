import { ArcShape } from '../../../vector/shapes/ArcShape.js';
import { equalWithinThreshold } from '../../../../equalWithinThreshold.js';
import { filterConnectedVectors } from './filterConnectedVectors.js';
import { getDistinctArcCenterPositions } from './getDistinctArcCenterPositions.js';
const angleErrorThreshold = 0.00001;
const radiusErrorThreshold = 0.00001;

export function isUTurnRect(path) {
	if (!path.isClosed) {
		return false;
	}
	const elements = filterConnectedVectors(path.elements);
	if (elements.length < 2 || elements.some(e => !(e instanceof ArcShape)))
		return false;
	const centerPositions = getDistinctArcCenterPositions(elements);
	if (centerPositions.length !== 2)
		return false;
	let angleTotal = elements[0].angle;
	let isFirstArc = true;
	let angleSign = Math.sign(elements[0].angle);
	for (let i = 1; i < elements.length * 2; i++) {
		const prev = elements[(i - 1) % elements.length];
		const current = elements[i % elements.length];
		if (!prev.getEndPoint().equalsCloseEnough(current.getStartPoint())) {
			if (isFirstArc === false &&
			!equalWithinThreshold(Math.abs(angleTotal), Math.PI, angleErrorThreshold))
				return false;
			angleTotal = 0;
			isFirstArc = false;
		}
		if (!equalWithinThreshold(prev.radius, current.radius, radiusErrorThreshold)) {
			return false;
		}
		if (Math.sign(current.angle) !== angleSign)
			return false;
		angleTotal += current.angle;
	}
	if (!equalWithinThreshold(Math.abs(angleTotal), Math.PI / 2, 0.00001) &&
	!equalWithinThreshold(Math.abs(angleTotal), Math.PI, 0.00001))
		return false;
	return true;
};