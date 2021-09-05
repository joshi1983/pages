import { AsyncParser } from '../../parsing/AsyncParser.js';
import { Camera } from '../../drawing/vector/Camera.js';
import { CanvasVector2DDrawer } from '../../drawing/drawers/CanvasVector2DDrawer.js';
import { compile } from '../../parsing/compile.js';
import { fetchText } from '../../fetchText.js';
import { LogoProgramExecuter } from '../../parsing/execution/LogoProgramExecuter.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { Turtle } from '../../command-groups/Turtle.js';
import { Vector2DDrawing } from '../../drawing/vector/Vector2DDrawing.js';

const parser = new AsyncParser(true);

export class ScriptExampleDisplay {
	constructor(url) {
		if (typeof url !== 'string')
			throw new Error('ScriptExampleDisplay requires url to be a string.  Not: ' + url);

		this.url = url;
		const div = document.createElement('div');
		div.classList.add('script-example-thumbnail');
		div.innerHTML = 'Loading script...';
		this.div = div;
		this.camera = new Camera();
		this.camera.setZoomScale(0.1);
		const w = 417;
		const h = 40;
		const canvases = [];
		for (let i = 0; i < 3; i++) {
			const canvas = document.createElement('canvas');
			canvas.setAttribute('height', h);
			canvas.setAttribute('width', w);
			canvases.push(canvas);
		}
		this.canvases = canvases;
		const outer = this;
		this.downloadPromise = fetchText('logo-scripts/' + url).then(function(code) {
			const parseLogger = new ParseLogger();
			const proceduresMap = new Map();
			return parser.parse(code, parseLogger, proceduresMap).then(function(tree) {
				if (parseLogger.hasLoggedErrors())
					div.innerHTML = 'Parse failed';
				else {
					try {
						const program = compile(code, tree, parseLogger, new Map(), {
							'forProduction': true,
							'translateToJavaScript': true,
							'mergeJavaScriptInstructions': true
						}, proceduresMap);
						if (parseLogger.hasLoggedErrors())
							div.innerHTML = 'Compilation failed';
						else {
							div.innerHTML = '';
							canvases.forEach(canvas => div.appendChild(canvas));
							const settings = {'animationTime': 0};
							outer.drawing = new Vector2DDrawing();
							outer.drawing.setDimensions(w, h);
							outer.drawer = new CanvasVector2DDrawer(canvases, w, h);
							const turtle = new Turtle(settings, outer.drawing);
							outer.drawing.addEventListener('addForegroundShape', function(e) {
								outer.drawer.drawShapes([e.details.shape.transformBy(outer.camera)]);
							});
							const executer = new LogoProgramExecuter(turtle, program);
							outer.executer = executer;
						}
					} catch (e) {
						console.error('Error while compiling code from ' + url, e);
						throw e;
					}
				}
			});
		});
	}

	isReadyToRun() {
		return this.executer !== undefined && !this.executer.isHalted;
	}

	redraw() {
		this.drawing.drawAsSingleLayer(this.drawer, this.camera);
	}

	resized() {
		const clientRect = this.canvases[0].getBoundingClientRect();
		const w = Math.floor(clientRect.width);
		const h = Math.floor(clientRect.height);
		if (w > 0) {
			this.drawer.setDimensions(w, h);
			this.drawing.setDimensions(w, h);
			this.canvases.forEach(function(canvas) {
				canvas.setAttribute('width', w);
				canvas.setAttribute('height', h);
			});
			this.updateCamera();
		}
	}

	updateCamera() {
		if (this.drawing.hasAnythingToClear()) {
			const box = this.drawing.getBoundingBox();
			const dx = box.max.getX() - box.min.getX();
			const dy = box.max.getY() - box.min.getY();
			const w = this.drawer.width;
			const h = this.drawer.height;
			const scale = Math.max(dy * 1.1 / h, dx * 1.1 / w, 0.01);
			this.drawer.clear();
			this.camera.setZoomScale(1/scale);
			this.camera.position.assign(box.getCentre().multiply(-1));
			this.redraw();
		}
	}
};