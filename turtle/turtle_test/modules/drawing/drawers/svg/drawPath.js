import { ArcShape } from '../../vector/shapes/ArcShape.js';
import { drawRoundedRect } from './drawRoundedRect.js';
import { drawSimpleRect } from './drawSimpleRect.js';
import { isRoundedRect } from './rounded-rect/isRoundedRect.js';
import { isSimpleRect } from './simple-rect/isSimpleRect.js';
import { StringBuffer } from '../../../StringBuffer.js';
import { Vector } from '../../vector/Vector.js';

const twoPi = 2 * Math.PI;
const almostTwoPi = twoPi - 0.01;
const tinyAngleStep = 0.0002;

function formatPoint(rounder, p) {
	return `${rounder.formatNumber(p.getX())} ${rounder.formatNumber(p.getY())}`;
}

function hasEqualFormattedEndCoords(rounder, element, formattedEndCoords) {
	if (!(element instanceof ArcShape))
		return false;
	else {
		const end = element.getEndPoint();
		const endCoords = formatPoint(rounder, end);
		return endCoords === formattedEndCoords;
	}
}

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
		const elements = path.elements;
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
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
				const formattedRadius = rounder.formatNumber(arc.radius);
				let endCoords = formatPoint(rounder, end);
				if (i + 2 <= elements.length && hasEqualFormattedEndCoords(rounder, elements[i + 1], endCoords)) {
					/*
					This is a rare case.
					An example named "Mohamed Sewelam Logo" makes use of this.
					Arcs of exactly 360 or -360 degrees can be problematic.
					This code helps us export an SVG that looks how we want.
					It looks like the problem is if 1 arc ends at exactly the same point as a consecutive arc.
					The SVG ends up not showing anything.

					The following code simulates an angle just a bit closer to 0 so the 2 end points aren't rounded to exactly the same point.
					Ideally, we'd have a way to reuse the exact same points and express a full 360 degree circle in an SVG path element 
					but I couldn't find that ideal solution reasonably quickly.
					Official documentation for path A command is at:
					https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#arcs
					*/
					let angle = arc.angle;
					const tinyAngleStep2 = Math.sign(angle) * tinyAngleStep;
					for (let i = 0; i < 4; i++) {
						angle -= tinyAngleStep2 * (1 << i);
						const end2 = ArcShape.getEndPoint(arc, angle);
						endCoords = formatPoint(rounder, end2);
						if (!hasEqualFormattedEndCoords(rounder, elements[i + 1], endCoords))
							break;
					}
				}
				tagString.append(` A ${formattedRadius} ${formattedRadius} 0 ${largeArcFlag} ${counterClockwiseFlag} ${endCoords}`);
				prevPos = end.getXYVector();
			}
		}
		if (path.isClosed)
			tagString.append(' z');
		tagString.append('" ' + svgDrawer.getStyleAttributes(path.style) + '/>');
		svgDrawer.pushTag(tagString.toString());
	}
};