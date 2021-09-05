import { AsyncParser } from '../../parsing/AsyncParser.js';
import { AsyncParseTask } from '../../parsing/AsyncParseTask.js';
import { Camera } from '../../drawing/vector/Camera.js';
import { CanvasVector2DDrawer } from '../../drawing/drawers/CanvasVector2DDrawer.js';
import { compile } from '../../parsing/compile.js';
import { fetchText } from '../../fetchText.js';
import { handleCompactKeywords } from './handleCompactKeywords.js';
import { LogoProgramExecuter } from '../../parsing/execution/LogoProgramExecuter.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { PriorityTextFetcher } from '../../PriorityTextFetcher.js';
import { treeToThumbnailSettings } from './treeToThumbnailSettings.js';
import { Turtle } from '../../command-groups/Turtle.js';
import { VectorDrawing } from '../../drawing/vector/VectorDrawing.js';
import { ZippedExamples } from './ZippedExamples.js';

await ZippedExamples.asyncInit();
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
		this.textFetcher = new PriorityTextFetcher('logo-scripts/' + url, PriorityTextFetcher.LOW_PRIORITY);
		function setAsyncParseTask(asyncParseTask) {
			outer.asyncParseTask = asyncParseTask;
		}
		this.parsePromise = this.textFetcher.promise.then(function(code) {
			outer.parseLogger = new ParseLogger();
			outer.code = code;
			let priority = AsyncParseTask.LOW_PRIORITY;
			if (outer.textFetcher.priority === PriorityTextFetcher.HIGH_PRIORITY)
				priority = AsyncParseTask.HIGH_PRIORITY;
			const promise = parser.parse(code, priority, outer.parseLogger, proceduresMap, setAsyncParseTask);
			return promise.then(function(tree) {
				if (outer.parseLogger.hasLoggedErrors()) {
					if (outer.div !== undefined)
						outer.div.innerHTML = 'Parse failed';
					throw new Error(`Parse failed for url: ${url}`);
				}
				else {
					outer.tree = tree;
					if (runImmediately)
						return outer.startRunning();
				}
			});
		});
	}

	_checkResizeNeeded() {
		if (this.canvases === undefined)
			return;
		const canvas = this.canvases[0];
		const clientRect = canvas.getBoundingClientRect();
		const w = Math.floor(clientRect.width);
		if (w !== Math.floor(canvas.width)) {
			this.resized();
		}
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

	decreasePriority() {
		this.textFetcher.priority = PriorityTextFetcher.LOW_PRIORITY;
		if (this.asyncParseTask !== undefined && this.asyncParseTask.priority !== AsyncParseTask.LOW_PRIORITY) {
			this.asyncParseTask.priority = AsyncParseTask.LOW_PRIORITY;
		}
	}

	increasePriority() {
		this.textFetcher.priority = PriorityTextFetcher.HIGH_PRIORITY;
		if (this.asyncParseTask !== undefined && this.asyncParseTask.priority !== AsyncParseTask.HIGH_PRIORITY) {
			this.asyncParseTask.priority = AsyncParseTask.HIGH_PRIORITY;
		}
		this._checkResizeNeeded();
	}

	isReadyToRun() {
		return this.executer !== undefined && !this.executer.isHalted;
	}

	redraw() {
		this._checkResizeNeeded();
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
			handleCompactKeywords(this.div);
		}
	}

	async startRunning() {
		if (this.div === undefined)
			this._initializeDOM();
		try {
			const program = compile(this.code, this.tree, this.parseLogger, new Map(), {
				'forProduction': true,
				'translateToJavaScript': true,
				'mergeJavaScriptInstructions': true,
				'parsedOptimize': true
			}, proceduresMap);
			if (this.parseLogger.hasLoggedErrors())
				this.div.innerHTML = 'Compilation failed';
			else {
				const settings = await treeToThumbnailSettings(program);
				this.div.innerHTML = '';
				this.canvases.forEach(canvas => this.div.appendChild(canvas));
				this.drawing = new VectorDrawing();
				this.drawing.setDimensions(w, h);
				this.drawer = new CanvasVector2DDrawer(this.canvases, w, h);
				const turtle = new Turtle(settings, this.drawing);
				const outer = this;
				outer.drawing.addEventListener('addForegroundShape', function(e) {
					outer._checkResizeNeeded();
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