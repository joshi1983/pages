import { canDrawingBeExportedToPointCloud } from './canDrawingBeExportedToPointCloud.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';

export function isPointCloudSelectable() {
	const drawing = GraphicsScreen.getDrawing();
	return canDrawingBeExportedToPointCloud(drawing);
};