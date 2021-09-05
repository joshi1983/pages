import { fetchJson } from '../../../../modules/fetchJson.js';
import { validate3DExportFormatGeneric } from '../validate3DExportFormatGeneric.js';
const data = await fetchJson('json/pointCloudFormats.json');

export function testPointCloudFormatsJSON(logger) {
	validate3DExportFormatGeneric(data, logger);
};