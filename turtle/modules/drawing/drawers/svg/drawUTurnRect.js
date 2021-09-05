import { equalWithinThreshold } from '../../../equalWithinThreshold.js';
import { formatDegreeAngle } from '../../vector/shapes/math/formatDegreeAngle.js';
import { getUTurnRectInfo } from './u-turn-rect/getUTurnRectInfo.js';
import { Vector2D } from '../../vector/Vector2D.js';
const radianAngleThreshold = 0.00001;

export function drawUTurnRect(svgDrawer, path) {
	const info = getUTurnRectInfo(path.elements);
	const rounder = svgDrawer.rounder;
	const width = info.width;
	const height = info.height;
	let rotation = '';
	if (!equalWithinThreshold(info.rotationRadians, 0, radianAngleThreshold)) {
		rotation = ` transform="rotate(${formatDegreeAngle(info.rotationRadians * 180 / Math.PI)})"`;
	}
	const p = Vector2D.rotate(info.position.getXYVector(), -info.rotationRadians);
	const x = p.getX();
	const y = p.getY();
	let xFormatted = ` x="${rounder.formatNumber(x)}"`;
	if (xFormatted.indexOf('"0"') !== -1)
		xFormatted = '';
	let yFormatted = ` y="${rounder.formatNumber(y)}"`;
	if (yFormatted.indexOf('"0"') !== -1)
		yFormatted = '';
	const rxFormatted = ` rx="${rounder.formatNumber(info.cornerRadius)}"`;
	svgDrawer.pushTag(`<rect${xFormatted}${yFormatted} width="${rounder.formatNumber(width)}" height="${rounder.formatNumber(height)}"${svgDrawer.getStyleAttributes(path.style, false)}${rotation}${rxFormatted} />`);
};