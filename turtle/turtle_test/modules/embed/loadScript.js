import { Camera } from '../drawing/vector/Camera.js';
import { CanvasVector2DDrawer } from '../drawing/drawers/CanvasVector2DDrawer.js';
import { compile } from '../parsing/compile.js';
import { ConsoleParseLogger } from '../parsing/loggers/ConsoleParseLogger.js';
import { dragTranslation } from './dragTranslation.js';
import { fetchText } from '../fetchText.js';
import { LogoParser } from '../parsing/LogoParser.js';
import { LogoProgramExecuter } from '../parsing/execution/LogoProgramExecuter.js';
import { mouseWheel } from './mouseWheel.js';
import { PinchListener } from '../components/PinchListener.js';
import { Turtle } from '../command-groups/Turtle.js';
import { Vector2DDrawing } from '../drawing/vector/Vector2DDrawing.js';

export async function loadScript(script) {
	let code;
	if (script.hasAttribute('src'))
		code = await fetchText(script.getAttribute('src'));
	else
		code = script.innerText;
	const displayId = script.dataset.displayId;
	if (typeof displayId !== 'string')
		console.error('data-display-id must be specified as a string');
	else if (document.getElementById(displayId) === null)
		console.error(`Unable to find element with id "${displayId}".  The element should exist so it can be used to show a WebLogo drawing.`);
	else {
		const displayElement = document.getElementById(displayId);
		displayElement.classList.add('weblogo-embed-display');
		displayElement.innerHTML = ''; // remove any children.
		const bounds = displayElement.getBoundingClientRect();
		if (bounds.height < 1 || bounds.width < 1)
			console.warn(`The initial dimensions of display element with id "${displayId}" will make it invisible.  width=${bounds.width}, height=${bounds.height}`);
		const logger = new ConsoleParseLogger();
		const extraProcedures = new Map();
		const tree = LogoParser.getParseTree(code, logger, extraProcedures);
		const compileOptions = {
			'translateToJavaScript': true,
			'mergeJavaScriptInstructions': true,
			'forProduction': true
		};
		const initialVariables = new Map();
		const program = compile(code, tree, logger, extraProcedures, compileOptions, initialVariables);
		const w = Math.max(10, Math.ceil(bounds.width)), h = Math.max(10, Math.ceil(bounds.height));
		const canvases = [];
		for (let i = 0; i < 3; i++) {
			const canvas = document.createElement('canvas');
			canvas.setAttribute('height', h);
			canvas.setAttribute('width', w);
			canvases.push(canvas);
			displayElement.appendChild(canvas);
		}
		const camera = new Camera();
		camera.setZoomScale(0.1);
		const settings = {'animationTime': 0};
		const drawing = new Vector2DDrawing();
		drawing.setDimensions(w, h);
		const drawer = new CanvasVector2DDrawer(canvases, w, h);
		const turtle = new Turtle(settings, drawing);
		function redraw() {
			drawing.drawAsSingleLayer(drawer, camera);
		}
		mouseWheel(displayElement, camera, redraw);
		dragTranslation(displayElement, camera, redraw);
		PinchListener.bind(displayElement, function(pinchEvent) {
			camera.setZoomScale(camera.getZoomScale() * pinchEvent);
			redraw();
			if (typeof event.preventDefault === 'function')
				event.preventDefault();
			return false;
		});
		const executer = new LogoProgramExecuter(turtle, program);
		executer.addEventListener('execution-stopped', function() {
			const box = drawing.getBoundingBox();
			const dx = box.max.getX() - box.min.getX();
			const dy = box.max.getY() - box.min.getY();
			const w = drawer.width;
			const h = drawer.height;
			const scale = Math.max(dy * 1.1 / h, dx * 1.1 / w, 0.01);
			drawer.clear();
			camera.setZoomScale(1/scale);
			camera.position.assign(box.getCentre().multiply(-1));
			redraw();
		});
		executer.startContinuousExecution();
	}
};