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

	/* Never call this when the instruction will be asyncronous.  */
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

	/*
	Very similar to executeInstruction() but returns a promise for any asyncronous instructions.
	*/
	executeInstructionAsync() {
		const instruction = this.executionContext.getNextInstruction();
		let result;
		try {
			if (instruction === undefined) {
				this.isHalted = true;
				super._dispatchEvent('execution-stopped', {'cause': 'halted-normal'});
			}
			else if (instruction.isAsync) {
				result = instruction.execute(this.executionContext);
				const outer = this;
				result.catch(function(e) {
					outer.pauseContinuousExecution();
					outer.isHalted = true;
					outer._dispatchEvent('exception', {
						'e': e,
						'instruction': instruction
					});
				});
				this.executionContext.instructionIndex++;
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
		return result;
	}

	async executeInstructionsAsync(numInstructions) {
		let promise;
		if (!this.isHalted) {
			/*
			The following for-loops are nearly duplicated for the small performance benefit of 
			avoiding the breakpoint check repeatedly when there are no breakpoints.
			*/
			if (this.breakpoints.size === 0) {
				for (var i = 0; i < numInstructions; i++) {
					promise = this.executeInstructionAsync();
					if (promise !== undefined) {
						await promise;
					}
					if (this.isHalted === true) {
						this.instructionExecutionCount += i;
						break;
					}
				}
			}
			else {
				for (var i = 0; i < numInstructions; i++) {
					promise = this.executeInstructionAsync();
					if (promise !== undefined) {
						await promise;
					}
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

	/*
	Never call this when the program contains an asyncronous instruction.
	*/
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
		return this.continuousInterval === undefined &&
			this.continuousTimeout === undefined;
	}

	isPausedOrHalted() {
		return this.isPaused() || this.isHalted;
	}

	// In other words, halt.
	pauseContinuousExecution() {
		if (this.continuousInterval !== undefined || this.continuousTimeout !== undefined) {
			if (this.continuousInterval !== undefined)
				clearInterval(this.continuousInterval);
			if (this.continuousTimeout !== undefined)
				clearTimeout(this.continuousTimeout);
			this.continuousInterval = undefined;
			this.continuousTimeout = undefined;
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
			this.startContinuousExecution(); 
			// run appropriately depending if the new program is async vs sync.
	}

	setSpeedMode(newMode) {
		this.speedMode = newMode;
		newMode.stoppedTiming();
	}

	startContinuousExecution() {
		if (this.executionContext.logoProgram.usesAsyncInstructions()) {
			this.startContinuousExecutionAsync();
			return;
		}
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

	startContinuousExecutionAsync() {
		/*
		If continuous execution is running syncronously, stop it.
		We don't want sync and async continuous execution happening concurrently.
		They'll interfere with each other.
		*/
		if (this.continuousInterval !== undefined) {
			clearInterval(this.continuousInterval);
			this.continuousInterval = undefined;
			this.speedMode.stoppedTiming();
		}
		if (this.continuousTimeout === undefined) {
			const outer = this;
			async function timeoutCallback() {
				const startTime = new Date().getTime();
				await outer.executeInstructionsAsync(outer.speedMode.getInstructionsPerInterval());
				const stopTime = new Date().getTime();
				outer.speedMode.setLastIntervalTime(stopTime - startTime);
				outer.continuousTimeout = setTimeout(timeoutCallback, 20);
			}
			this.continuousTimeout = setTimeout(timeoutCallback, 20);
			super._dispatchEvent('execution-started', {});
		}
	}
};