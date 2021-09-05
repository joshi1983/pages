import { Code } from '../code-editor/Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { getDownscaledForegroundImageData } from './getDownscaledForegroundImageData.js';
import { GraphicsScreen } from '../GraphicsScreen.js';

/*
Looks for good times to redraw the Graphics Screen using downscaling.

listens for events that are signs not to use downscaling.
	These signs would include:
	- GraphicsScreen redrawing.
	- logo program executing and not paused
	- GraphicsScreen refresh turtle requested

- when a reasonable period lapsed since the last bad sign to downscale, start downscaling.
	- if any bad sign is found while downscaling, abort it. 
	Abort as in don't putImageData on the downscaled graphics.
*/

let t;
const delayInterval = 50;
let isDownscaling = false, isDownscalingAborted;
let scaleFactor = 2;
const MIN_SCALE_FACTOR = 2;
const MAX_SCALE_FACTOR = 2; // 4 might be good at some point.

async function startDownscaling() {
	isDownscaling = true;
	isDownscalingAborted = false;
	const imageData = await getDownscaledForegroundImageData(scaleFactor);
	if (!isDownscalingAborted) {
		const foregroundCanvas = GraphicsScreen.canvases[1];
		const ctx = foregroundCanvas.getContext('2d');
		ctx.putImageData(imageData, 0, 0);
	}

	isDownscaling = false;
	isDownscalingAborted = false;
	if (scaleFactor !== MAX_SCALE_FACTOR) {
		scaleFactor = MAX_SCALE_FACTOR;
		delayDownscaling();
	}
}

function isCodeExecuterReadyForDownscaling() {
	const executer = Code.executer;
	if (executer === undefined) {
		return false;
	}
	if (executer.isPausedOrHalted())
		return true;
	return false;
}

/*
Downscaling would waste resources if the Code Editor was filling the screen 
and hiding the graphics screen.
*/
function isCodeEditorMaximized() {
	return CodeEditor.isMaximized === true &&
	CodeEditor.isVisible;
}

function downscalingFinalChecks() {
	if (GraphicsScreen._turtleRefreshRequested ||
	!isCodeExecuterReadyForDownscaling() ||
	isCodeEditorMaximized() ||
	GraphicsScreen.drawing.hasTaintedShapes())
		delayDownscaling();
	else {
		startDownscaling();
	}
}

function delayDownscaling() {
	if (isDownscaling) {
		isDownscalingAborted = true;
	}
	if (t !== undefined)
		clearTimeout(t);
	t = setTimeout(downscalingFinalChecks, delayInterval);
}

function busyEvent() {
	scaleFactor = MIN_SCALE_FACTOR;
	delayDownscaling();
}

setTimeout(function() {
	GraphicsScreen.addEventListener('redraw', busyEvent);
	GraphicsScreen.addEventListener('refresh-turtle', busyEvent);
	GraphicsScreen.camera.addEventListener('change', busyEvent);
	GraphicsScreen.camera.position.addEventListener('change', busyEvent);
	CodeEditor.addEventListener('layout', busyEvent);
	delayDownscaling();
}, 5000); // give a little time for modules to initialize.
// Hopefully the delay helps the listeners do their intended jobs.
// Sometimes when loading WebLogo, busyEvent doesn't get triggered when it should.