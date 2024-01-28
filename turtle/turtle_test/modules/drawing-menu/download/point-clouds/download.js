import { downloadDataUrl } from '../../../components/downloadDataUrl.js';
import { pointsToCSV } from './exporters/pointsToCSV.js';
import { pointsToMeshLabXYZ } from './exporters/pointsToMeshLabXYZ.js';
import { pointsToPCD } from './exporters/pointsToPCD.js';
import { pointsToPTS } from './exporters/pointsToPTS.js';
import { pointsToXYZ } from './exporters/pointsToXYZ.js';
import { StringUtils } from '../../../StringUtils.js';

export function download(points, filename, format) {
	if (!(points instanceof Array))
		throw new Error(`points must be an Array but got ${points}`);
	if (typeof filename !== 'string')
		throw new Error(`filename must be a string but got ${filename}`);
	if (typeof format !== 'object')
		throw new Error(`format must be an object but got ${format}`);
	filename = StringUtils.forceFileExtension(filename, format.fileExtension);
	let content;
	if (format.fileExtension === 'csv')
		content = pointsToCSV(points);
	else if (format.fileExtension === 'pcd')
		content = pointsToPCD(points);
	else if (format.fileExtension === 'pts')
		content = pointsToPTS(points);
	else if (format.fileExtension === 'xyz') {
		if (format.name.toLowerCase().indexOf('chemical geometry') !== -1)
			content = pointsToXYZ(points, true);
		else if (format.name.toLowerCase().indexOf('point count') !== -1)
			content = pointsToXYZ(points, false);
		else
			content = pointsToMeshLabXYZ(points);
	}
	else
		throw new Error(`Unsupported point cloud format: ${format}`);
	const dataUrl = 'data:application/octet-stream;base64,'+btoa(content);;
	downloadDataUrl(filename, dataUrl);
};