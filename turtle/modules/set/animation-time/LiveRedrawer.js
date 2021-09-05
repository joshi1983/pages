import { Code } from '../../components/code-editor/Code.js';
import { GraphicsScreen } from '../../components/GraphicsScreen.js';
import { isUsingAnimationTime } from '../../parsing/parse-tree-analysis/isUsingAnimationTime.js';
import { LogoProgramExecuter } from '../../parsing/execution/LogoProgramExecuter.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { Settings } from '../../Settings.js';
import { Turtle } from '../../command-groups/Turtle.js';
import { Vector2DDrawing } from '../../drawing/vector/Vector2DDrawing.js';

const offscreenSettings = {};
const offscreenDrawing = new Vector2DDrawing();
const offscreenTurtle = new Turtle(offscreenSettings, offscreenDrawing);
let offscreenExecuter = undefined;

class PrivateLiveRedrawer {
	constructor() {
		this._needRedraw = false;
	}

	getTimeoutInterval() {
		return 200;
	}

	isProgramUsingAnimationTime() {
		const tree = Code.tree;
		if (tree === undefined)
			return false;
		return isUsingAnimationTime(tree);
	}

	redrawNeeded(newAnimationTime) {
		this._needRedraw = true;
		this.newAnimationTime = newAnimationTime;
		if (offscreenExecuter === undefined)
			this.refreshProgram();
		startTimer();
	}

	refreshProgram() {
		Code.refreshProgram(new ParseLogger());
		if (Code.latestProgram !== undefined) {
			this.program = Code.latestProgram;
			if (offscreenExecuter === undefined) {
				offscreenExecuter = new LogoProgramExecuter(offscreenTurtle, this.program);
				offscreenExecuter.addEventListener('execution-stopped', function(event) {
					if (typeof event === 'object' && event.cause === 'halted-normal') {
						if (t === undefined)
							copyOffscreenToScreen();
					}
				});
			}
			else
				offscreenExecuter.setProgram(this.program);
		}
	}

	stop() {
		stop();
	}
};

const LiveRedrawer = new PrivateLiveRedrawer();
let t = undefined;
let lastRedrawAnimationTime;
let isDrawingReady = false;

function copyOffscreenToScreen() {
	lastRedrawAnimationTime = offscreenSettings.animationTime;
	offscreenExecuter.pauseContinuousExecution();
	Settings.executer.assignProgramAndContextFrom(offscreenExecuter);
	Settings.turtle.drawState.assign(offscreenTurtle.drawState);
	GraphicsScreen.drawing.assign(offscreenTurtle.drawing);
	// refresh the whole drawing in the canvas.
	GraphicsScreen.redraw();
}

function stop() {
	if (t !== undefined) {
		clearTimeout(t);
		t = undefined;
		if (isDrawingReady)
			copyOffscreenToScreen();
	}
}

function redraw() {
	stop();
	if (LiveRedrawer.newAnimationTime !== lastRedrawAnimationTime) {
		offscreenSettings.animationTime = LiveRedrawer.newAnimationTime;
		offscreenDrawing.clearScreen();
		offscreenTurtle.drawState.reset();
		offscreenExecuter.restart();
		offscreenExecuter.startContinuousExecution();
		t = setTimeout(redraw, LiveRedrawer.getTimeoutInterval());
		isDrawingReady = true;
	}
}

function startTimer() {
	if (t === undefined) {
		t = setTimeout(redraw, LiveRedrawer.getTimeoutInterval());
	}
}

export { LiveRedrawer };