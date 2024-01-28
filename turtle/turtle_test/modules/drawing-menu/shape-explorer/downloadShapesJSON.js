import { downloadDataUrl } from '../../components/downloadDataUrl.js';
import { GraphicsScreen } from '../../components/GraphicsScreen.js';
import { shapesToJSON } from './serialization/shapesToJSON.js';
import { StringBuffer } from '../../StringBuffer.js';

export function downloadShapesJSON() {
	const json = shapesToJSON(GraphicsScreen.drawing.foreground.shapes);
	const dataUrl = 'data:application/octet-stream;base64,'+btoa(json);
	const filename = 'shapes.json';
	downloadDataUrl(filename, dataUrl);
};