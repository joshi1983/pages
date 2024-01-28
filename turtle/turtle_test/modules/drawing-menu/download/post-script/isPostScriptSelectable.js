import { canDrawingBeExportedToPostScript } from './canDrawingBeExportedToPostScript.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';

export function isPostScriptSelectable() {
	const drawing = GraphicsScreen.getDrawing();
	return canDrawingBeExportedToPostScript(drawing);
};