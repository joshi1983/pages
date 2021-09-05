import { downloadDataUrl } from '../../../components/downloadDataUrl.js';
import { pointsToCSV } from './exporters/pointsToCSV.js';
import { pointsToMeshLabXYZ } from './exporters/pointsToMeshLabXYZ.js';
import { pointsToOBJ } from './exporters/pointsToOBJ.js';
import { pointsToPCD } from './exporters/pointsToPCD.js';
import { pointsToPLY } from './exporters/pointsToPLY.js';
import { pointsToPTS } from './exporters/pointsToPTS.js';
import { pointsToXYZ } from './exporters/pointsToXYZ.js';
import { StringUtils } from '../../../StringUtils.js';

const extensionConverterMap = new Map([
['csv', pointsToCSV],
['pcd', pointsToPCD],
['ply', pointsToPLY],
['pts', pointsToPTS],
]);

export function download(points, filename, format) {
	if (!(points instanceof Array))
		throw new Error(`points must be an Array but got ${points}`);
	if (typeof filename !== 'string')
		throw new Error(`filename must be a string but got ${filename}`);
	if (typeof format !== 'object')
		throw new Error(`format must be an object but got ${format}`);
	filename = StringUtils.forceFileExtension(filename, format.fileExtension);
	let content;
	const converter = extensionConverterMap.get(format.fileExtension);
	if (converter !== undefined)
		content = converter(points);
	else if (format.fileExtension === 'obj')
		content = pointsToOBJ(points, format.supportsColour);
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
	const dataUrl = 'data:application/octet-stream;base64,'+btoa(content);
	downloadDataUrl(filename, dataUrl);
};