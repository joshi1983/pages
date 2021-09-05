import { compileRectProgram } from '../../../../parsing/compiling/compileRectProgram.js';
import { EventDispatcher } from '../../../../EventDispatcher.js';
import { LogoProgramExecuter } from '../../../../parsing/execution/LogoProgramExecuter.js';

export class RectRenderer extends EventDispatcher {
	constructor(rect, shape, treeRoot, proceduresMap, isForProduction) {
		if (!(proceduresMap instanceof Map))
			throw new Error(`proceduresMap must be a Map but got ${proceduresMap}`);
		if (typeof isForProduction !== 'boolean')
			throw new Error(`isForProduction must be boolean but got ${isForProduction}`);
		super(['success']);
		this.isForProduction = isForProduction;
		this.proceduresMap = proceduresMap;
		this.rect = rect;
		this.shape = shape;
		this.treeRoot = treeRoot;
	}

	abort() {
		if (this.executer !== undefined)
			this.executer.pauseContinuousExecution();
		this.isAborted = true;
		this.rect.dispose();
		this.dispose();
	}

	complete() {
		this.shape.rects.push(this.rect);
		this._dispatchEvent('success');
	}

	/*
	Disposes only this renderer.
	Does not dispose the rect or shape.
	*/
	dispose() {
		this.shape = undefined;
		this.rect = undefined;
		if (this.executer !== undefined)
			this.executer.pauseContinuousExecution();
		this.executer = undefined;
	}

	start(turtle) {
		if (this.executer !== undefined)
			throw new Error('Can not start because this is already started.');
		const program = compileRectProgram(this.rect, this.shape.procedureName,
			this.shape.initialVariables, this.proceduresMap, this.isForProduction);
		this.executer = new LogoProgramExecuter(turtle, program);
		const outer = this;
		this.executer.addEventListener('execution-stopped', function(e) {
			if (e.details.cause === 'halted-normal') {
				outer.complete();
			}
		});
		this.executer.startContinuousExecution();
	}
};