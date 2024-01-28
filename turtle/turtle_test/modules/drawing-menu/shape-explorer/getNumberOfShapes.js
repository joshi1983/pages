import { GraphicsScreen } from '../../components/GraphicsScreen.js';

export function getNumberOfShapes() {
	return GraphicsScreen.drawing.foreground.shapes.length;
};