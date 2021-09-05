import { GraphicsScreen } from '../components/GraphicsScreen.js';
const zoomOutItem = document.getElementById('zoom-out');

function zoomOutClicked() {
	GraphicsScreen.setZoomScale(GraphicsScreen.getZoomScale() / 1.2);
	GraphicsScreen.redraw();
}

zoomOutItem.addEventListener('click', zoomOutClicked);
export function zoomOut() {
	
};