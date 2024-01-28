import { StringBuffer } from '../../../../StringBuffer.js';

export function pointsToCSV(points) {
	const result = new StringBuffer();
	result.append('x,y,z,red,green,blue\n');
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const coords = p.vector.coords;
		result.append(coords[0] + ',' + coords[1] + ',' + coords[2]);
		const rgbArray = p.colour.rgbArray;
		result.append(',' + rgbArray[0] + ',' + rgbArray[1] + ',' + rgbArray[2] + '\n'); 
	}
	return result.toString();
};