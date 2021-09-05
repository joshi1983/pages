import { CachedParseTree } from
'../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { EventDispatcher } from
'../../../EventDispatcher.js';
import { exceptionToString } from
'../../../exceptionToString.js';
import { getProceduresMap } from
'../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { isNumber } from
'../../../isNumber.js';
import { LogoProgramExecuter } from
'../../../parsing/execution/LogoProgramExecuter.js';
import { mightInitialRandomSeedBeUsed } from
'../../../parsing/parse-tree-analysis/mightInitialRandomSeedBeUsed.js';
import { shouldTestDifferentAnimationTimes } from
'./shouldTestDifferentAnimationTimes.js';
import { Turtle } from
'../../../command-groups/Turtle.js';
import { Vector2DDrawing } from
'../../../drawing/vector/Vector2DDrawing.js';

export class RandomExecutionTester extends EventDispatcher {
	constructor(program, duration) {
		if (!isNumber(duration))
			throw new Error(`duration must be a number but found ${duration}`);
		if (typeof program !== 'object')
			throw new Error(`program must be an object but found ${program}`);
		if (typeof program.parseTree !== 'object')
			throw new Error(`program.parseTree must be an object but found ${program.parseTree}`);
		super(['complete', 'failure', 'runCountChanged']);
		const proceduresMap = getProceduresMap(program.parseTree);
		const initialVariablesMap = new Map();
		const cachedParseTree = new CachedParseTree(program.parseTree, proceduresMap, initialVariablesMap);
		this.duration = duration;
		this.program = program;
		this.rangeAnimationTime = shouldTestDifferentAnimationTimes(cachedParseTree);
		this.rangeRandomSeed = mightInitialRandomSeedBeUsed(cachedParseTree);
		this.runCount = 0;
	}

	_randomizeSettings() {
		const settings = this.execution.turtle.settings;
		this.previousSettings = {
			'animationTime': settings.animationTime,
			'seedNumber': settings.seedNumber
		};
		settings.seedNumber ++;
		const motionBlurOffset = 0.2;
		const minTime = -motionBlurOffset;
		const maxTime = this.duration + motionBlurOffset;
		settings.animationTime = Math.random() * (maxTime - minTime) + minTime;
	}

	_restartExecution() {
		this.execution.restart();
		this.execution.startContinuousExecution();
	}

	dispose() {
		this.stop();
		this.execution = undefined;
		this.previousSettings = undefined;
		this.removeAllEventListeners();
	}

	start() {
		if (this.execution === undefined) {
			const settings = {
				'animationDurationSeconds': 10,
				'animationTime': -0.1,
				'seedNumber': 0
			};
			const drawing = new Vector2DDrawing();
			const turtle = new Turtle(settings, drawing);
			this.execution = new LogoProgramExecuter(turtle, this.program);
			const outer = this;
			this.execution.addEventListener('exception', function(e) {
				outer._dispatchEvent('failure', {
					'animationTime': settings.animationTime,
					'msg': `Failed with message: ${exceptionToString(e)}`
				});
			});
			this.execution.addEventListener('execution-stopped', function() {
				outer.runCount++;
				outer._dispatchEvent('runCountChanged', {'count': outer.runCount});
				if (outer.rangeRandomSeed || outer.rangeAnimationTime) {
					outer._randomizeSettings();
					outer._restartExecution();
				}
				else {
					outer._dispatchEvent('complete', {});
				}
			});
		}
		this.execution.startContinuousExecution();
	}

	stop() {
		if (this.execution !== undefined &&
		!this.execution.isPausedOrHalted()) {
			const dispatchStopped = false;
			this.execution.pauseContinuousExecution(dispatchStopped);
		}
	}
};