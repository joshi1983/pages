import { lineToCircle } from './lineToCircle.js';

export function drawLine(svgDrawer, line) {
	const rounder = svgDrawer.rounder;
	const pos = line.position;
	const pos2 = line.endPoint;
	if (pos.equals(pos2) && line.style.getLineCap() === 'round') {
		svgDrawer.drawCircle(lineToCircle(line));
		return;
	}
	const attrMap = new Map([
		['x1', pos.getX()],
		['y1', pos.getY()],
		['x2', pos2.getX()],
		['y2', pos2.getY()]
	]);
	let coords = '';
	for (const [key, val] of attrMap) {
		const formattedVal = rounder.formatNumber(val);
		if (formattedVal !== '0') {
			// no need to specify the attribute unless it is not 0
			// since x1,y1,x2,y2 have 0 as their default values.
			coords += ` ${key}="${formattedVal}"`;
		}
	}
	svgDrawer.pushTag('<line' + coords + svgDrawer.getStrokeStyle(line.style, false) + ' />');
};