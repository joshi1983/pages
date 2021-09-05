import { ArrayUtils } from '../../../../ArrayUtils.js';
import { getBlue } from '../../../../colour/getBlue.js';
import { getGreen } from '../../../../colour/getGreen.js';
import { getRed } from '../../../../colour/getRed.js';

function toLine(options) {
	return function(lineSegment) {
		const p1 = lineSegment.point1;
		const p2 = lineSegment.point2;
		const vals = [
		p1.getX(), p1.getY(), p1.getZ(),
		p2.getX(), p2.getY(), p2.getZ()
		];
		if (options.includeColour) {
			const c = lineSegment.colour;
			vals.push(getRed(c), getGreen(c), getBlue(c));
		}
		return vals.join(',');
	};
}

export function csv(lineSegments, options) {
	const columnNames = ['x1', 'y1', 'z1', 'x2', 'y2', 'z2'];
	if (options.includeColour)
		columnNames.push('red', 'green', 'blue');
	const lines = [columnNames.join(',')];
	ArrayUtils.pushAll(lines, lineSegments.map(toLine(options)));
	return lines.join('\n');
};