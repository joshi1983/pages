import { Export3DFileFormats } from '../Export3DFileFormats.js';
import { fetchJson } from '../../../fetchJson.js';
const data = await fetchJson('json/lineSegmentFormats.json');

const LineSegmentFileFormats = new Export3DFileFormats(data);

export { LineSegmentFileFormats };