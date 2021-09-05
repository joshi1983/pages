import { AlphaColour } from '../../AlphaColour.js';
import { setSnapshotStyle } from '../../drawing/AspectRatioDrawer.js';
import { CanvasVector2DDrawer } from '../../drawing/drawers/CanvasVector2DDrawer.js';
import { Code } from '../../components/code-editor/Code.js';
import { FastExecuter } from './FastExecuter.js';
import { getAnimationSetup } from '../../drawing/vector/animation/getAnimationSetup.js';
import { getSnapshotStyleFromProgram } from '../../drawing/vector/animation/getSnapshotStyleFromProgram.js';
import { GraphicsScreen } from '../../components/GraphicsScreen.js';
import { isNumber } from '../../isNumber.js';
import { isUsingAnimationTime } from './isUsingAnimationTime.js';
import { redrawGrid } from '../../components/graphics-screen/showGridDuringHover.js';
import { ToastMessages } from '../../components/ToastMessages.js';
import { Transparent } from '../../Transparent.js';

const canvasContainer = document.getElementById('graphics-screen');
const canvases = canvasContainer.querySelectorAll(':scope > canvas');
const backgroundCanvas = canvases[0];
const foregroundCanvas = canvases[2];
const backgroundCtx = backgroundCanvas.getContext('2d');
const ctx = foregroundCanvas.getContext('2d');
const drawer = new CanvasVector2DDrawer(undefined, 100, 100);
let latestScreenColor = GraphicsScreen.drawing.getScreenColor();

function updateBackground(box, drawing) {
	const screenColor = drawing.getScreenColor();
	latestScreenColor = screenColor;
	backgroundCtx.clearRect(0, 0, box.width, box.height);
	if (screenColor !== Transparent) {
		if (screenColor instanceof AlphaColour)
			backgroundCtx.fillStyle = AlphaColour.getRGBAExpression(screenColor);
		else if (screenColor !== Transparent)
			backgroundCtx.fillStyle = screenColor.to6DigitHTMLCode();
		backgroundCtx.fillRect(0, 0, box.width, box.height);
	}
}

class PrivateLiveRedrawer {
	isUsingAnimationTime() {
		return isUsingAnimationTime(this.executer, Code.sourceCode);
	}

	async startDrawing() {
		/*
		The executer is checked in case startDrawing() is called 
		before the executer is finished compiling the program.
		*/
		if (this.drawingPromise === undefined && this.executer !== undefined &&
		this.executer.isReadyToGetDrawing()) {
			this._redrawNeeded = false;
			this.drawingPromise = this.executer.getDrawing(this._t, this._duration);
			const drawing = await this.drawingPromise;
			// draw to the canvas element.
			this.drawingPromise = undefined;
			// draw to canvas.
			const box = foregroundCanvas.getBoundingClientRect();
			drawing.setDimensions(box.width, box.height);
			drawer.setDimensions(box.width, box.height);
			const drawerForegroundCanvas = drawer.canvases[1];
			drawerForegroundCanvas.setAttribute('width', box.width);
			drawerForegroundCanvas.setAttribute('height', box.height);
			drawing.drawAsSingleLayer(drawer, GraphicsScreen.camera);
			updateBackground(box, drawing);
			ctx.clearRect(0, 0, box.width, box.height);
			ctx.drawImage(drawerForegroundCanvas, 0, 0);
		}
	}

	redrawNeeded(animationTime) {
		if (this._t !== animationTime) {
			this.setAnimationTimeWithoutRedraw(animationTime);
			this._redrawNeeded = true;
			if (isNumber(this._duration)) {
				this.startDrawing();
			}
			if (this.executer !== undefined && this.executer.program !== undefined &&
			isNumber(this._t) && isNumber(this._duration))
				getSnapshotStyleFromProgram(this.executer.program, this._t, this._duration).then(function(snapshotStyle) {
					setSnapshotStyle(snapshotStyle);
					redrawGrid(latestScreenColor);
				});
		}
	}

	async refreshProgram() {
		try {
			this.executer = new FastExecuter(Code.sourceCode, 200);
			await this.executer.compile();
		}
		catch (e) {
			if (typeof e === 'string')
				ToastMessages.warn(`Unable to show live preview because ${e}`, false);
			else
				throw e;
			return;
		}
		const animationSetup = await getAnimationSetup(this.executer.program);
		if (!isNumber(animationSetup))
			throw new Error(`Expected a number representing animation duration but got ${animationSetup}`);
		this._duration = animationSetup;
		this.startDrawing();
	}

	setAnimationTimeWithoutRedraw(t) {
		if (!isNumber(t))
			throw new Error(`t must be a number.  Not: ${t}`);
		this._t = t;
	}

	stop() {
		if (this.executer !== undefined) {
			this.executer.stop();
		}
	}
};

const LiveRedrawer2 = new PrivateLiveRedrawer();
export { LiveRedrawer2 };