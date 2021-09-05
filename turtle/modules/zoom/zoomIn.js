import { GraphicsScreen } from '../components/GraphicsScreen.js';
const zoomInItem = document.getElementById('zoom-in');

function zoomInClicked() {
	GraphicsScreen.setZoomScale(GraphicsScreen.getZoomScale() * 1.2);
	GraphicsScreen.redraw();
}

zoomInItem.addEventListener('click', zoomInClicked);
export function zoomIn() {
	
};