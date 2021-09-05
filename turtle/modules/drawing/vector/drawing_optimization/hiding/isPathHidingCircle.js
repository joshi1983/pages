import { Colour } from '../../../../Colour.js';
import { Vector } from '../../Vector.js';

const twoPI = Math.PI * 2;

function isFullCircleArc(element) {
	return element.angle === twoPI;
};

function getOpaquePenPadding(style) {
	if (style.pen.gradient === undefined && style.isPenVisible()) {
		const penColor = style.pen.color;
		if (penColor instanceof Colour)
			return style.getPenWidth() / 2;
	}
	return 0;
}

function getMaxVisibleRadius(circle) {
	if (circle.style.isPenVisible())
		return circle.radius + circle.style.getPenWidth() / 2;
	else
		return circle.radius;
}

export function isPathHidingCircle(path, circle) {
	const fullCircleArcs = path.elements.filter(isFullCircleArc);
	const maxVisibleRadius = getMaxVisibleRadius(circle);
	const opaquePenPadding = getOpaquePenPadding(path.style);
	for (let i = 0; i < fullCircleArcs.length; i++) {
		const arc = fullCircleArcs[i];
		const minOpaqueRadius = arc.radius + opaquePenPadding;
		if (minOpaqueRadius >= maxVisibleRadius) {
			const deltaCoords = Vector.minusCoords(arc.position.coords, circle.position.coords);
			const delta = Vector.euclideanDistance(deltaCoords);
			if (minOpaqueRadius >= delta + maxVisibleRadius) {
				return true;
			}
		}
	}
	return false;
};