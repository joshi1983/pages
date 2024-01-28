import { GraphicsScreen } from '../GraphicsScreen.js';
import { PinchListener } from '../PinchListener.js';
const container = GraphicsScreen.container;

function scaleChanged(scaleFactor) {
	GraphicsScreen.setZoomScale(GraphicsScreen.getZoomScale() * scaleFactor);
	GraphicsScreen.redraw();
}

PinchListener.bind(container, scaleChanged);
