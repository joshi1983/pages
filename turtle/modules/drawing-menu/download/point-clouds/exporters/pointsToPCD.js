import { StringBuffer } from '../../../../StringBuffer.js';
/*
Format described at:
https://en.wikipedia.org/wiki/Point_Cloud_Library#File_structure
*/

/*
Described at:
https://stackoverflow.com/questions/63614203/how-to-obtain-color-information-from-a-point-cloud-and-display-it-qt
*/
function colourToPCDFloat(colour) {
	// Adapted from code at:
	// https://stackoverflow.com/questions/42699162/javascript-convert-array-of-4-bytes-into-a-float-value-from-modbustcp-read
	var buf = new ArrayBuffer(4);
	var view = new DataView(buf);
	const rgbArray = colour.rgbArray;
	view.setUint8(0, 0);
	view.setUint8(1, rgbArray[0]);
	view.setUint8(2, rgbArray[1]);
	view.setUint8(3, rgbArray[2]);

	return view.getFloat32(0);
}

export function pointsToPCD(points) {
	const result = new StringBuffer();
	result.append(`# .PCD v.7 - Point Cloud Data file format
VERSION .7
FIELDS x y z rgb
SIZE 4 4 4 4
TYPE F F F F
COUNT 1 1 1 1
WIDTH ${points.length}
HEIGHT 1
VIEWPOINT 0 0 0 1 0 0 0
POINTS ${points.length}
DATA ascii\n`);
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const coords = p.vector.coords;
		const colour = p.colour;
		result.append(coords[0] + ' ' + coords[1] + ' ' + coords[2] + ' ' + colourToPCDFloat(colour) + '\n');
	}
	return result.toString();
};