import { canDrawingBeExportedToLineSegments } from './canDrawingBeExportedToLineSegments.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';

export function isLineSegmentsSelectable() {
	const drawing = GraphicsScreen.getDrawing();
	return canDrawingBeExportedToLineSegments(drawing);
};