import { pointsToMeshLabXYZ } from './pointsToMeshLabXYZ.js';
import { StringBuffer } from '../../../../StringBuffer.js';
/*
XYZ format is mostly for chemistry but the xyz extention is sometimes also used for other kinds of
point clouds.

More details on the chemistry-related format is at:
https://en.wikipedia.org/wiki/XYZ_file_format
The following also describes the chemistry-related format:
https://dbpedia.org/page/XYZ_file_format
*/

/*
The format function is to perform the "10.5" format mentioned at:
https://openbabel.org/wiki/XYZ_(format)
Results should be similar to "       -0.70136" shown in their example.
*/
export function format(num) {
	let result = num.toFixed(5);
	if (result.length < 14)
		result = ' '.repeat(14 - result.length) + result;
		// pad with leading spaces.

	return ' ' + result;
	/* always ensure at least 1 space is before the number.
	*/
};

export function pointsToXYZ(points, includeAtom) {
	if ((typeof includeAtom) !== 'boolean')
		throw new Error(`includeAtom must be boolean but found ${includeAtom}`);

	const result = new StringBuffer();
	result.append(points.length + '\n');
	if (includeAtom)
		result.append('; A point cloud exported from WebLogo, the C is added only to conform to the file format\n');
	else
		result.append('; This is a point cloud exported from WebLogo\n');
	if (includeAtom) {
		for (let i = 0; i < points.length; i++) {
			const coords = points[i].vector.coords;
			result.append('C');
			result.append(format(coords[0]) + format(coords[1]) + format(coords[2]) + '\n');
		}
	}
	else {
		result.append(pointsToMeshLabXYZ(points));
	}
	return result.toString();
};