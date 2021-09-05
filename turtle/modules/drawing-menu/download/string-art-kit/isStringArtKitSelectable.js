import { canDrawingBeExportedToStringArtKit } from './canDrawingBeExportedToStringArtKit.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';

export function isStringArtKitSelectable() {
	const drawing = GraphicsScreen.getDrawing();
	return canDrawingBeExportedToStringArtKit(drawing);
};