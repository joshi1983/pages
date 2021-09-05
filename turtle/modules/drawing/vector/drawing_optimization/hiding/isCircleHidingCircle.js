import { isFillOpaque } from './isFillOpaque.js';
import { isFillTransparent } from './isFillTransparent.js';
import { isPenOpaque } from './isPenOpaque.js';
import { Vector } from '../../Vector.js';
const errorToleranceThreshold = 0.000001;

export function isCircleHidingCircle(containerCircle, containedCircle) {
	let containedRadius = containedCircle.radius;
	if (containedCircle.style.isPenVisible()) {
		containedRadius += containedCircle.style.getPenWidth() / 2;
	}
	let containerOpaqueRadius = containerCircle.radius;
	if (isPenOpaque(containerCircle.style)) {
		containerOpaqueRadius += containerCircle.style.getPenWidth() / 2;
	}
	if (!isFillOpaque(containerCircle.style)) {
		if (!isPenOpaque(containerCircle.style))
			return false;
		if (!isFillTransparent(containedCircle.style))
			return false;
		const minContainerRadius = containerCircle.radius - containerCircle.style.getPenWidth() / 2;
		const maxContainerRadius = containerCircle.radius + containerCircle.style.getPenWidth() / 2;
		const minContainedRadius = containedCircle.radius - containedCircle.style.getPenWidth() / 2;
		const maxContainedRadius = containedCircle.radius + containedCircle.style.getPenWidth() / 2;
		const centerSeparation = Vector.euclideanDistance(containerCircle.position.minus(containedCircle.position).coords);
		if (minContainedRadius + errorToleranceThreshold < centerSeparation + minContainerRadius)
			return false;
		if (maxContainedRadius + centerSeparation > maxContainerRadius + errorToleranceThreshold)
			return false;
		return true;
	}
	const maxSeparation = containerOpaqueRadius - containedRadius;
	if (maxSeparation < 0)
		return false;
	const centerSeparation = Vector.euclideanDistance(containerCircle.position.minus(containedCircle.position).coords);
	return centerSeparation <= maxSeparation;
};