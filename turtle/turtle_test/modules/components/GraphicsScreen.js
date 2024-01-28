/*
This represents the graphics area in the main area of the application.
There is only one GraphicsScreen.
*/
import { Camera } from '../drawing/vector/Camera.js';
import { CanvasVector2DDrawer } from '../drawing/drawers/CanvasVector2DDrawer.js';
import { Colour } from '../Colour.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { isNumber } from '../isNumber.js';
import { Transparent } from '../Transparent.js';
import { TurtleDrawState } from '../drawing/TurtleDrawState.js';
import { Vector2DDrawing } from '../drawing/vector/Vector2DDrawing.js';
await Colour.asyncInit();

class PrivateGraphicsScreen extends EventDispatcher {
	constructor() {
		super(['redraw', 'refresh-turtle']);
		this.camera = new Camera();
		this.drawing = new Vector2DDrawing();
		this._initializeContainer();
		const size = this.getCanvasDimensions();
		this.drawer = new CanvasVector2DDrawer(this.canvases, size.w, size.h);
		this._initializeCanvasUpdateListeners();
		this.redraw();
	}

	_initializeContainer() {
		this.container = document.getElementById('graphics-screen');
		const layerCount = Vector2DDrawing.getLayerCount();
		this.canvases = [];
		for (let i = 0; i < layerCount; i++) {
			const canvas = document.createElement('canvas');
			this.container.appendChild(canvas);
			this.canvases.push(canvas);
		}
		this.canvases[layerCount - 1].classList.add('turtle-display');
	}

	_initializeCanvasUpdateListeners() {
		const outer = this;
		function updateCanvasDimensions() {
			outer.updateCanvasDimensions();
		}
		window.addEventListener('resize', updateCanvasDimensions);
		updateCanvasDimensions();
	}

	getCanvasDimensions() {
		return {
			'w': Math.floor(this.container.offsetWidth),
			'h': Math.floor(this.container.offsetHeight)
		};
	}

	getDrawing() {
		return this.drawing;
	}

	getZoomScale() {
		return this.camera.getZoomScale();
	}

	redraw() {
		if (this.drawing.getScreenColor() === Transparent) {
			this.drawer.clearScreen(Colour.WHITE);
		}
		this.drawing.drawAsSingleLayer(this.drawer, this.camera);
		this.refreshTurtle();
		this._dispatchEvent('redraw');
	}

	_refreshTurtle() {
		this._turtleRefreshRequested = false;
		if (this.turtleDrawState !== undefined) {
			const transformedState = new TurtleDrawState();
			transformedState.setPosition(this.camera.transform(this.turtleDrawState.getPosition()));
			// almost always true but checking to be safe.
			if (isNumber(this.turtleDrawState.getHeading()))
				transformedState.setHeading(this.turtleDrawState.getHeading());
			transformedState.isTurtleVisible = this.turtleDrawState.isTurtleVisible;
			transformedState.setPenColor(this.turtleDrawState.getPenColor());
			this.drawer.refreshTurtle(transformedState);
		}
		this._dispatchEvent('refresh-turtle');
	}

	refreshTurtle() {
		this._turtleRefreshRequested = true;
	}

	setTurtleDrawState(turtleDrawState) {
		if (!(turtleDrawState instanceof TurtleDrawState))
			throw new Error('turtleDrawState must be an instance of TurtleDrawState');
		this.turtleDrawState = turtleDrawState;
		this.refreshTurtle();
		const outer = this;
		turtleDrawState.addEventListener('change', function() {
			outer.refreshTurtle();
		});
	}

	setZoomScale(zoomScale) {
		this.camera.setZoomScale(zoomScale);
	}

	updateCanvasDimensions() {
		const size = this.getCanvasDimensions();
		const outer = this;
		this.canvases.forEach(function(canvas) {
			canvas.setAttribute('width', size.w);
			canvas.setAttribute('height', size.h);
		});
		this.drawing.setDimensions(size.w, size.h);
		this.redraw();
	}
}

setTimeout(function() {
	import('./graphics-screen/cameraToTurtleButton.js');
	import('./graphics-screen/CursorStatus.js');
	import('./graphics-screen/CursorRefresher.js');
	import('./graphics-screen/DownscalingRedrawer.js');
	import('./graphics-screen/mouseWheelZoom.js');
	import('./graphics-screen/moveCameraOnDrag.js');
	import('./graphics-screen/multitouchZoom.js');
	import('./graphics-screen/showGridDuringHover.js');
}, 0);

const GraphicsScreen = new PrivateGraphicsScreen();
export {  GraphicsScreen };