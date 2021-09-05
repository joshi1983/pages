/*
Responsible for scheduling the execution of example programs and 
giving priority to ones that are visible.
*/
import { ScriptExampleDisplay } from './ScriptExampleDisplay.js';
import { ScriptExampleDisplayRepository } from './ScriptExampleDisplayRepository.js';
const minInstructions = 100;
const initialInstructions = 1000;
const maxInstructions = 200000;
const idealMiliseconds = 15;

class PrivateScriptExampleExecutionScheduler {
	constructor() {
		this.examples = [];
		this.previousTotalInstructions = [];
		this.totalInstructions = initialInstructions;
	}

	_executeChunk() {
		const readyToRun = this._getReadyToRun();
		if (readyToRun.length > 0) {
			let startT = new Date().getTime();
			const numInstructions = Math.max(1, this.totalInstructions / readyToRun.length);
			for (let i = 0; i < readyToRun.length; i++) {
				const script = readyToRun[i];
				script.executer.executeInstructionsSync(numInstructions);
				if (script.executer.isHalted)
					script.updateCamera();
			}
			let lapsedMs = Math.max(2, new Date().getTime() - startT);
			const totalInstructions = Math.max(minInstructions, Math.min(maxInstructions, this.totalInstructions * idealMiliseconds / lapsedMs));
			if (this.previousTotalInstructions.length >= 10)
				this.previousTotalInstructions.shift(this.previousTotalInstructions.length - 11);
			this.previousTotalInstructions.push(totalInstructions);
			this.totalInstructions = Math.min(...this.previousTotalInstructions);
		}
		else {
			if (this.examples.length === 0)
				this.stop();
		}
	}

	_getReadyToRun() {
		const result = [];
		// Avoiding the filter method because it is a little slower here.
		for (let i = 0; i < this.examples.length; i++) {
			if (this.examples[i].isReadyToRun())
				result.push(this.examples[i]);
		}
		return result;
	}

	_start() {
		if (this._t === undefined) {
			const outer = this;
			this._t = setInterval(function() {
				outer._executeChunk();
			}, 20);
		}
	}

	refreshPriorities(filteredExamples) {
		if (!(filteredExamples instanceof Array))
			throw new Error('filteredExamples must be an Array');

		this.examples = filteredExamples.map(e => ScriptExampleDisplayRepository.get(e.filename, true));
		this._start();
	}

	// Stops all example program scheduling.
	stop() {
		if (this._t !== undefined) {
			clearInterval(this._t);
			this._t = undefined;
			this.previousTotalInstructions = [];
			this.totalInstructions = initialInstructions;
		}
	}
}

const ScriptExampleExecutionScheduler = new PrivateScriptExampleExecutionScheduler();
export { ScriptExampleExecutionScheduler };