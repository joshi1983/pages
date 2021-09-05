import { Canvas2DGridDrawer } from '../../drawing/Canvas2DGridDrawer.js';
import { CanvasVector2DDrawer } from '../../drawing/drawers/CanvasVector2DDrawer.js';
import { Colour } from '../../Colour.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
import { GraphicsScreenRedrawDispatcher } from './GraphicsScreenRedrawDispatcher.js';
import { Transparent } from '../../Transparent.js';
await Colour.asyncInit();
let t = undefined;
const gridDrawer = new Canvas2DGridDrawer();
const black = new Colour('#000');
const white = new Colour('#fff');

// There will be some 3D drawers.
// This checks if the 2D drawer is active because our grid is specific to that drawer.
function isUsing2DDrawer() {
	return GraphicsScreen.drawer instanceof CanvasVector2DDrawer;
}

export function redrawGrid(screenColor) {
	let gridColour = black;
	if (screenColor !== Transparent && screenColor.isDark())
		gridColour = white;
	gridDrawer.setGridColour(gridColour);
	gridDrawer.redraw(GraphicsScreen.camera, GraphicsScreen.drawer);
};

function _redrawGrid() {
	const screenColor = GraphicsScreen.drawing.getScreenColor();
	redrawGrid(screenColor);
}

function startContinuousRedraw() {
	if (t === undefined) {
		t = setInterval(_redrawGrid, 300);
	}
}

function stopContinuousRedraw() {
	if (t !== undefined) {
		clearInterval(t);
		t = undefined;
	}
}

function bindEvents() {
	const container = GraphicsScreen.container;
	const foregroundCanvas = isUsing2DDrawer() ? GraphicsScreen.drawer.getForegroundCanvas() : undefined;
	if (foregroundCanvas === undefined)
		container.appendChild(gridDrawer.canvas);
	else
		container.insertBefore(gridDrawer.canvas, foregroundCanvas);
	container.addEventListener('mousemove', startContinuousRedraw);
	container.addEventListener('mouseleave', stopContinuousRedraw);
	GraphicsScreenRedrawDispatcher.addEventListener('redrawNeeded', _redrawGrid);
}

bindEvents();
