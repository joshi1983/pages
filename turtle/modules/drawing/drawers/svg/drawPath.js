import { drawRoundedRect } from './drawRoundedRect.js';
import { drawSimpleRect } from './drawSimpleRect.js';
import { isRoundedRect } from './rounded-rect/isRoundedRect.js';
import { isSimpleRect } from './simple-rect/isSimpleRect.js';
import { StringBuffer } from '../../../StringBuffer.js';
import { Vector } from '../../vector/Vector.js';

export function drawPath(svgDrawer, path) {
	const rounder = svgDrawer.rounder;
	if (isSimpleRect(path)) {
		drawSimpleRect(svgDrawer, path);
	}
	else if (isRoundedRect(path)) {
		drawRoundedRect(svgDrawer, path);
	}
	else if (!path.containsNonPoints()) {
		const points = path.elements.map(function(p) {
			return rounder.formatNumber(p.getX()) + ',' + rounder.formatNumber(p.getY());
		});
		let tagName;
		if (path.isClosed)
			tagName = 'polygon';
		else
			tagName = 'polyline';
		svgDrawer.pushTag('<' + tagName + ' points="' + points.join(", ") + '" ' + svgDrawer.getStyleAttributes(path.style) + ' />');
	}
	else {
		const startPoint = path.getStartPoint();
		const tagString = new StringBuffer();
		tagString.append('<path d="M' + rounder.formatNumber(startPoint.getX()) + ' ' + rounder.formatNumber(startPoint.getY()));
		let prevPos = startPoint.getXYVector();
		for (let i = 0; i < path.elements.length; i++) {
			const element = path.elements[i];
			if (element instanceof Vector) {
				if (i !== 0 && !rounder.equalsCloseEnough(prevPos, element.getXYVector())) {
					tagString.append(` L ${rounder.formatNumber(element.getX())} ${rounder.formatNumber(element.getY())}`);
					prevPos = element.getXYVector();
				}
			}
			else {
				const arc = element;
				const centre = arc.position;
				const offset = -arc.rotationRadians - Math.PI * 0.5;
				const start = arc.getStartPoint();
				const end = arc.getEndPoint();
				const largeArcFlag = Math.abs(arc.angle) < Math.PI ? 0 : 1;
				const counterClockwiseFlag = arc.angle < 0 ? 1 : 0;
				if (!rounder.equalsCloseEnough(prevPos, start.getXYVector()))
					tagString.append(` L ${rounder.formatNumber(start.getX())} ${rounder.formatNumber(start.getY())}`);
				tagString.append(` A ${rounder.formatNumber(arc.radius)} ${rounder.formatNumber(arc.radius)} 0 ${largeArcFlag} ${counterClockwiseFlag} ${
					rounder.formatNumber(end.getX())} ${rounder.formatNumber(end.getY())}`);
				prevPos = end.getXYVector();
			}
		}
		if (path.isClosed)
			tagString.append(' z');
		tagString.append('" ' + svgDrawer.getStyleAttributes(path.style) + '/>');
		svgDrawer.pushTag(tagString.toString());
	}
};