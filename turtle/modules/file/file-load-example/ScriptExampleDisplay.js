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
const w = 417;
const h = 40;
const proceduresMap = new Map();

export class ScriptExampleDisplay {
	constructor(url, runImmediately) {
		if (typeof url !== 'string')
			throw new Error('ScriptExampleDisplay requires url to be a string.  Not: ' + url);
		if (typeof runImmediately !== 'boolean')
			throw new Error(`runImmediately must be boolean.  Not: ${runImmediately}`);

		if (runImmediately)
			this._initializeDOM();
		this.url = url;
		const outer = this;
		this.downloadPromise = fetchText('logo-scripts/' + url).then(function(code) {
			outer.parseLogger = new ParseLogger();
			outer.code = code;
			return parser.parse(code, outer.parseLogger, proceduresMap).then(function(tree) {
				if (outer.parseLogger.hasLoggedErrors()) {
					if (outer.div !== undefined)
						outer.div.innerHTML = 'Parse failed';
				}
				else {
					outer.tree = tree;
					if (runImmediately)
						outer.startRunning();
				}
			});
		});
	}

	_initializeDOM() {
		const div = document.createElement('div');
		div.classList.add('script-example-thumbnail');
		div.innerHTML = 'Loading script...';
		this.div = div;
		this.camera = new Camera();
		this.camera.setZoomScale(0.1);
		const canvases = [];
		for (let i = 0; i < 3; i++) {
			const canvas = document.createElement('canvas');
			canvas.setAttribute('height', h);
			canvas.setAttribute('width', w);
			canvases.push(canvas);
		}
		this.canvases = canvases;
	}

	isReadyToRun() {
		return this.executer !== undefined && !this.executer.isHalted;
	}

	redraw() {
		this.drawing.drawAsSingleLayer(this.drawer, this.camera);
	}

	resized() {
		if (this.canvases === undefined)
			throw new Error('resized should not be called until you call startRunning().' +
				'It is not called here because an exception should help find the problem in the caller instead of masking the problem.');
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

	startRunning() {
		if (this.div === undefined)
			this._initializeDOM();
		try {
			const program = compile(this.code, this.tree, this.parseLogger, new Map(), {
				'forProduction': true,
				'translateToJavaScript': true,
				'mergeJavaScriptInstructions': true
			}, proceduresMap);
			if (this.parseLogger.hasLoggedErrors())
				this.div.innerHTML = 'Compilation failed';
			else {
				this.div.innerHTML = '';
				this.canvases.forEach(canvas => this.div.appendChild(canvas));
				const settings = {
					'animationTime': 0,
					'animationDurationSeconds': 10
				};
				this.drawing = new Vector2DDrawing();
				this.drawing.setDimensions(w, h);
				this.drawer = new CanvasVector2DDrawer(this.canvases, w, h);
				const turtle = new Turtle(settings, this.drawing);
				const outer = this;
				this.drawing.addEventListener('addForegroundShape', function(e) {
					outer.drawer.drawShapes([e.details.shape.transformBy(outer.camera)]);
				});
				const executer = new LogoProgramExecuter(turtle, program);
				this.executer = executer;
			}
		} catch (e) {
			console.error('Error while compiling code from ' + this.url, e);
			throw e;
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