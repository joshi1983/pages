import { Export3DFileFormats } from '../Export3DFileFormats.js';
import { fetchJson } from '../../../fetchJson.js';
const data = await fetchJson('json/pointCloudFormats.json');

const PointCloudFileFormats = new Export3DFileFormats(data);

export { PointCloudFileFormats };