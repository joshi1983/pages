import { fetchJson } from '../../../../modules/fetchJson.js';
import { validate3DExportFormatGeneric } from '../validate3DExportFormatGeneric.js';
const data = await fetchJson('json/lineSegmentFormats.json');

export function testLineSegmentFormatsJSON(logger) {
	validate3DExportFormatGeneric(data, logger);
};