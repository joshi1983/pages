import { analyzeCodeQuality } from '../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { AsyncParser } from '../../parsing/AsyncParser.js';
import { AsyncParseTask } from '../../parsing/AsyncParseTask.js';
import { compile } from '../../parsing/compile.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { isNumber } from '../../isNumber.js';
import { LogoProgramExecuter } from '../../parsing/execution/LogoProgramExecuter.js';
import { noop } from '../../noop.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { Turtle } from '../../command-groups/Turtle.js';
import { VectorDrawing } from '../../drawing/vector/VectorDrawing.js';

const parser = new AsyncParser();
const fastCompileOptions = {
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'forProduction': true,
	'parsedOptimize': true
};
export class FastExecuter {
	constructor(maxTime) {
		if (!isNumber(maxTime))
			throw new Error(`maxTime must be a number instead of ${maxTime}`);
		this.maxTime = maxTime;
	}

	compile(code) {
		if (typeof code !== 'string')
			throw new Error(`code must be a string.  Not: ${code}`);

		const parseLogger = new ParseLogger();
		const outer = this;
		return new Promise(function(resolve, reject) {
			const proceduresMap = new Map();
			parser.parse(code, AsyncParseTask.HIGH_PRIORITY, parseLogger, proceduresMap).then(function(tree) {
				if (parseLogger.hasLoggedErrors())
					reject('Parsing failed');
				else {
					const procedures = getProceduresMap(tree);
					analyzeCodeQuality(tree, parseLogger, procedures, new Map(), {});
					if (parseLogger.hasLoggedErrors())
						reject('Code quality problems found');
					else {
						const initialVariables = new Map();
						const program = compile(code, tree, parseLogger, procedures,
							fastCompileOptions, initialVariables);
						if (program !== undefined) {
							outer.program = program;
							resolve();
						}
						else {
							reject('Failed to compile');
						}
					}
				}
			}).catch(function(errorDetails) {
				reject(`Failed to parse.  errorDetails: ${errorDetails}`);
			});
		});
	}

	getDrawing(animationTimeSeconds, durationSeconds) {
		if (!isNumber(animationTimeSeconds))
			throw new Error(`animationTimeSeconds must be a number.  Not: ${animationTimeSeconds}`);
		if (!isNumber(durationSeconds))
			throw new Error(`durationSeconds must be a number.  Not: ${durationSeconds}`);
		if (this.getDrawingPromise !== undefined)
			return this.getDrawingPromise; // prevent getting more than 1 drawing concurrently.
		const outer = this;
		this.getDrawingPromise = new Promise(function(resolve, reject) {
			const settings = {
				'animationTime': animationTimeSeconds,
				'animationDurationSeconds': durationSeconds
			};
			const drawing = new VectorDrawing();
			const turtle = new Turtle(settings, drawing);
			/*
			Since we don't need to listen for dispatched events,
			we can safely improve performance slightly by replacing the associated method to noop.
			*/
			turtle._dispatchEvent = noop;
			turtle.drawState._dispatchEvent = noop;
			drawing._dispatchEvent = noop;
			const executer = new LogoProgramExecuter(turtle, outer.program);
			let isResolved = false;
			function interceptedResolve(e) {
				if (!isResolved) {
					resolve(outer.executer.turtle.drawing);
					isResolved = true;
					executer.pauseContinuousExecution(true);
					outer.interceptedResolve = undefined;
					outer.executer = undefined;
					outer.getDrawingPromise = undefined;
				}
			}
			executer.addEventListener('exception,execution-stopped', interceptedResolve);
			// add listeners to call onException and onComplete.
			// use setTimeout to preempt execution after this.maxTime.
			setTimeout(interceptedResolve, outer.maxTime);
			executer.startContinuousExecution();
			outer.executer = executer;
			outer.interceptedResolve = interceptedResolve;
		});
		return this.getDrawingPromise;
	}

	isReadyToGetDrawing() {
		return this.program !== undefined;
	}

	stop() {
		if (this.executer !== undefined) {
			if (typeof this.interceptedResolve === 'function')
				this.interceptedResolve();
			this.interceptedResolve = undefined;
		}
	}
};