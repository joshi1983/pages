import { formatNumber } from '../../../../formatNumber.js';
import { getBlue } from '../../../../colour/getBlue.js';
import { getGreen } from '../../../../colour/getGreen.js';
import { getRed } from '../../../../colour/getRed.js';

function roundSmart(num) {
	return formatNumber(num, 6);
}

function pointToLine(point) {
	const colour = point.colour;
	return point.vector.coords.map(roundSmart).join(' ') + ' ' +
		getRed(colour) + ' ' +
		getGreen(colour) + ' ' +
		getBlue(colour);
}

export function pointsToPLY(points) {
	const header = `ply
format ascii 1.0
element vertex 6564
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header\n`;
	return header + points.map(pointToLine).join('\n');
};