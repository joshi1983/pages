import { equalWithinThreshold } from '../../../equalWithinThreshold.js';
import { formatDegreeAngle } from '../../vector/shapes/math/formatDegreeAngle.js';
import { getLengths } from './simple-rect/getLengths.js';
import { getTransformInfo } from './simple-rect/getTransformInfo.js';
import { Vector2D } from '../../vector/Vector2D.js';

/*
Draws to SVG using the rect element documented at:
https://developer.mozilla.org/en-US/docs/web/svg/element/rect
*/
const radianAngleThreshold = 0.0001;

export function drawSimpleRect(svgDrawer, path) {
	const transformInfo = getTransformInfo(path.elements);
	const elements = transformInfo.elements;
	const lengthInfo = getLengths(elements);
	const width = lengthInfo.lengths[0];
	const height = lengthInfo.lengths[1];
	const rotationRadians = transformInfo.rotationRadians;
	const p = Vector2D.rotate(elements[0].getXYVector(), -rotationRadians);
	const x = p.getX();
	const y = p.getY();
	const rounder = svgDrawer.rounder;
	let rotation = '';
	if (!equalWithinThreshold(rotationRadians, 0, radianAngleThreshold)) {
		rotation = ` transform="rotate(${formatDegreeAngle(rotationRadians * 180 / Math.PI)})"`;
	}
	let xFormatted = ` x="${rounder.formatNumber(x)}"`;
	if (xFormatted.indexOf('"0"') !== -1)
		xFormatted = '';
	let yFormatted = ` y="${rounder.formatNumber(y)}"`;
	if (yFormatted.indexOf('"0"') !== -1)
		yFormatted = '';
	svgDrawer.pushTag(`<rect${xFormatted}${yFormatted} width="${rounder.formatNumber(width)}" height="${rounder.formatNumber(height)}"${svgDrawer.getStyleAttributes(path.style, false)}${rotation} />`);
};