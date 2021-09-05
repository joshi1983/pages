import { downloadDataUrl } from '../../../components/downloadDataUrl.js';
import { csv } from './exporters/csv.js';
import { obj } from './exporters/obj.js';
import { ply } from './exporters/ply.js';
import { StringUtils } from '../../../StringUtils.js';

const extensionConverterMap = new Map();
[csv, obj, ply].forEach(converter => extensionConverterMap.set(converter.name, converter));

export function download(lineSegments, filename, format) {
	if (!(lineSegments instanceof Array))
		throw new Error(`lineSegments must be an Array but got ${lineSegments}`);
	if (typeof filename !== 'string')
		throw new Error(`filename must be a string but got ${filename}`);
	if (typeof format !== 'object')
		throw new Error(`format must be an object but got ${format}`);
	filename = StringUtils.forceFileExtension(filename, format.fileExtension);
	let content;
	const converter = extensionConverterMap.get(format.fileExtension);
	if (converter !== undefined) {
		const options = {'includeColour': format.supportsColour};
		content = converter(lineSegments, options);
	}
	else
		throw new Error(`Unsupported line segments format: ${format}`);
	const dataUrl = 'data:application/octet-stream;base64,'+btoa(content);
	downloadDataUrl(filename, dataUrl);
};