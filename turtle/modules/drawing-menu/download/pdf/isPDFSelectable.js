import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { isDrawableToPDF } from '../../../drawing/drawers/pdf/isDrawableToPDF.js';

export function isPDFSelectable() {
	const drawing = GraphicsScreen.getDrawing();
	return isDrawableToPDF(drawing);
};