import { ArcShape } from '../../vector/shapes/ArcShape.js';
import { equalWithinThreshold } from '../../../equalWithinThreshold.js';
import { getArcs } from './rounded-rect/getArcs.js';
import { getCornerPositionDistances } from './rounded-rect/getCornerPositionDistances.js';
import { getDistance } from './getDistance.js';
import { getTransformInfo } from './rounded-rect/getTransformInfo.js';
import { Vector2D } from '../../vector/Vector2D.js';
import { Vector3D } from '../../vector/Vector3D.js';

const radianAngleThreshold = 0.0001;

export function drawRoundedRect(svgDrawer, path) {
	const rounder = svgDrawer.rounder;
	let info = getTransformInfo(path);
	// FIXME: the following line should be removed and code should be fixed until all automated tests pass.
	info.elements = path.elements;
	const arcs = getArcs(info.elements);
	let arc;
	if (info.elements[0] instanceof Vector3D)
		arc = arcs[arcs.length - 1];
	else
		arc = arcs[0];
	const cornerRadius = arc.radius;
	const lengths = getCornerPositionDistances(info.elements);
	let width = cornerRadius * 2 + lengths[0];
	let height = cornerRadius * 2 + lengths[1];
	let directionVector1;
	let directionVector2;
	if (arc.angle > 0) {
		directionVector1 = arcs[1].position.minus(arcs[0].position);
		directionVector2 = arcs[2].position.minus(arcs[1].position);
	}
	else {
		directionVector1 = arcs[0].position.minus(arcs[3].position);
		directionVector2 = arcs[0].position.minus(arcs[1].position);
	}
	if (arc.angle < 0) {
		const temp = width;
		width = height;
		height = temp;
	}
	directionVector1 = Vector3D.normalize(directionVector1);
	directionVector2 = Vector3D.normalize(directionVector2);
	let rotationRadians = Math.atan2(directionVector1.getY(), directionVector1.getX());
	let rotation = '';
	if (!equalWithinThreshold(rotationRadians, 0, radianAngleThreshold) && 
	!equalWithinThreshold(rotationRadians, 2 * Math.PI, radianAngleThreshold)) {
		rotation = ` transform="rotate(${rotationRadians * 180 / Math.PI})"`;
	}
	let p = arc.position.minus(directionVector1.minus(directionVector2).multiply(cornerRadius));
	if (!(path.elements[0] instanceof Vector3D)) {
		p = p.plus(directionVector2.multiply(lengths[1]));
	}
	p = p.getXYVector();
	p = Vector2D.rotate(p, -rotationRadians);
	const x = p.getX();
	const y = p.getY();
	let xStr = rounder.formatNumber(x);
	let yStr = rounder.formatNumber(y);
	const cornerRadiusRounded = rounder.formatNumber(cornerRadius);
	if (xStr === '0')
		xStr = '';
	else
		xStr = ` x="${xStr}"`;
	if (yStr === '0')
		yStr = '';
	else
		yStr = ` y="${yStr}"`;
	svgDrawer.pushTag(`<rect${xStr}${yStr} width="${rounder.formatNumber(width)}" height="${rounder.formatNumber(height)}"${svgDrawer.getStyleAttributes(path.style)}${rotation} rx="${cornerRadiusRounded}" />`);
};