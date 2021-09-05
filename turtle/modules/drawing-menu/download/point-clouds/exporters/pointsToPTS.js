import { StringBuffer } from '../../../../StringBuffer.js';

/*
Described at:
http://paulbourke.net/dataformats/pts/

Also described at:
https://gmv.cast.uark.edu/uncategorized/file-formats-exporting-your-data
*/
export function pointsToPTS(points) {
	const result = new StringBuffer();
	result.append('' + points.length + '\n');
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const coords = p.vector.coords;
		result.append(coords[0] + ' ' + coords[1] + ' ' + coords[2]);
		const rgbArray = p.colour.rgbArray;
			result.append(' 1 ' + rgbArray[0] + ' ' + rgbArray[1] + ' ' + rgbArray[2]);
		result.append('\n'); // end line
	}
	return result.toString();
};