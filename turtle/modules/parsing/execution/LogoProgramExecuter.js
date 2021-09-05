import { EventDispatcher } from '../../EventDispatcher.js';
import { ExecutionContext } from './ExecutionContext.js';
import { LogoProgram } from './LogoProgram.js';
import { MaximumSpeed } from './speedModes/MaximumSpeed.js';

export class LogoProgramExecuter extends EventDispatcher {
	constructor(turtle, logoProgram) {
		if (typeof turtle !== 'object')
			throw new Error(`turtle must be an object.  Not: ${turtle}`);
		if (!(logoProgram instanceof LogoProgram))
			throw new Error(`logoProgram must be a LogoProgram.  Not: ${logoProgram}`);

		super(['breakpoint', 'exception', 'program-changed', 'execution-stopped', 'execution-started']);
		this.turtle = turtle;
		this.instructionExecutionCount = 0;
		this.speedMode = new MaximumSpeed();
		this.setProgram(logoProgram);
		this.breakpoints = new Map();
	}

	addBreakpoint(breakpoint) {
		if (!this.breakpoints.has(breakpoint.instructionIndex))
			this.breakpoints.set(breakpoint.instructionIndex, []);
		this.breakpoints.get(breakpoint.instructionIndex).push(breakpoint);
	}

	assignProgramAndContextFrom(executer) {
		if (!(executer instanceof LogoProgramExecuter))
			throw new Error('executer must be an instance of LogoProgramExecuter');

		this.setProgram(executer.executionContext.logoProgram);
		this.executionContext = executer.executionContext;
	}

	executeInstruction() {
		const instruction = this.executionContext.getNextInstruction();
		try {
			if (instruction === undefined) {
				this.isHalted = true;
				super._dispatchEvent('execution-stopped', {'cause': 'halted-normal'});
			}
			else {
				instruction.execute(this.executionContext);
				if (!instruction.isControllingInstructionIndex)
					this.executionContext.instructionIndex++;
			}
		}
		catch (e) {
			this.pauseContinuousExecution();
			this.isHalted = true;
			super._dispatchEvent('exception', {
				'e': e,
				'instruction': instruction
			});
		}
	}

	executeInstructionsSync(numInstructions) {
		if (!this.isHalted) {
			/*
			The following for-loops are nearly duplicated for the small performance benefit of 
			avoiding the breakpoint check repeatedly when there are no breakpoints.
			*/
			if (this.breakpoints.size === 0) {
				for (var i = 0; i < numInstructions; i++) {
					this.executeInstruction();
					if (this.isHalted === true) {
						this.instructionExecutionCount += i;
						break;
					}
				}
			}
			else {
				for (var i = 0; i < numInstructions; i++) {
					this.executeInstruction();
					if (this.isHalted === true) {
						this.instructionExecutionCount += i;
						break;
					}
					else if (this.breakpoints.has(this.executionContext.instructionIndex)) {
						const bucket = this.breakpoints.get(this.executionContext.instructionIndex);
						let matchFound = false;
						for (let j = 0; j < bucket.length; j++) {
							const breakpoint = bucket[j];
							if (breakpoint.isMatched(this.executionContext)) {
								super._dispatchEvent('breakpoint', {});
								this.pauseContinuousExecution();
								matchFound = true;
								break;
							}
						}
						if (matchFound === true)
							break;
					}
				}
			}
			if (this.isHalted === false) {
				this.instructionExecutionCount += numInstructions;
			}
		}
	}

	getGlobalVariables() {
		if (this.executionContext === undefined)
			return new Map();
		else
			return this.executionContext.globalVariables;
	}

	isPaused() {
		return this.continuousInterval === undefined;
	}

	isPausedOrHalted() {
		return this.isPaused() || this.isHalted;
	}

	// In other words, halt.
	pauseContinuousExecution() {
		if (this.continuousInterval !== undefined) {
			clearInterval(this.continuousInterval);
			this.continuousInterval = undefined;
			this.speedMode.stoppedTiming();
			super._dispatchEvent('execution-stopped', {});
		}
	}

	removeBreakpoint(breakpoint) {
		const bucket = this.breakpoints.get(breakpoint.instructionIndex);
		if (bucket !== undefined) {
			const index = bucket.indexOf(breakpoint);
			if (index !== -1) {
				bucket.splice(index, 1);
				if (bucket.length === 0)
					this.breakpoints.delete(breakpoint.instructionIndex);
			}
		}
	}

	restart() {
		this.isHalted = false;
		this.executionContext = new ExecutionContext(this.turtle, this.executionContext.logoProgram);
	}

	setProgram(logoProgram) {
		if (typeof logoProgram !== 'object')
			throw new Error('logoProgram must be an object.  It should be the result of compiling Logo code');
		this.executionContext = new ExecutionContext(this.turtle, logoProgram);
		this.isHalted = false;
		this.speedMode.stoppedTiming();
		super._dispatchEvent('program-changed', {});
		if (this.continuousInterval !== undefined)
			super._dispatchEvent('execution-started', {});
	}

	setSpeedMode(newMode) {
		this.speedMode = newMode;
		newMode.stoppedTiming();
	}

	startContinuousExecution() {
		if (this.continuousInterval === undefined) {
			const outer = this;
			this.continuousInterval = setInterval(function() {
				const startTime = new Date().getTime();
				outer.executeInstructionsSync(outer.speedMode.getInstructionsPerInterval());
				const stopTime = new Date().getTime();
				outer.speedMode.setLastIntervalTime(stopTime - startTime);
			}, 20);
			super._dispatchEvent('execution-started', {});
		}
	}
};