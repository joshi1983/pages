import { GraphicsScreen } from '../components/GraphicsScreen.js';
const zoomNormalItem = document.getElementById('zoom-normal');

function zoomNormalClicked() {
	GraphicsScreen.setZoomScale(1);
	GraphicsScreen.redraw();
}

zoomNormalItem.addEventListener('click', zoomNormalClicked);
export function zoomNormal() {
	
};