import { Breakpoint } from
'../../../parsing/execution/BreakPoint.js';
import { EventDispatcher } from
'../../../EventDispatcher.js';
import { ExecutingProcedure } from
'../../../parsing/execution/ExecutingProcedure.js';
import { isNumber } from
'../../../isNumber.js';
import { LogoProgramExecuter } from
'../../../parsing/execution/LogoProgramExecuter.js';
import { Turtle } from
'../../../command-groups/Turtle.js';
import { VectorDrawing } from
'../../../drawing/vector/VectorDrawing.js';

/*
This will do similar to executeLogoProcedure to run the animation.setup procedure.

We want to check for lots of problems including:
- is the return value a Map?  If no, yield error message.
- if the return value is a Map:
	- are unrecognized keys on the Map?  If yes, return warnings about each recognized key.
	- is duration missing?  If yes, return an error message.
	- is every recognized key holding a valid value?
		- for example, duration must be a positive real number.
		- thumbnailTime must also be a number.
- Does the procedure take too long to halt?
	- if yes, return an error message.

If all is successful or the worst we find is a warning,
return the resulting duration.
*/

const keyTypesMap = new Map([
	['duration', 'num'],
	['thumbnailTime', 'num']
]);

export { keyTypesMap };

export class AnimationSetupTest extends EventDispatcher {
	constructor(program) {
		super(['animation-setup-result', 'error', 'warning']);
		this.program = program;
	}

	dispose() {
		this.program = undefined;
		this.running = false;
		this.removeAllEventListeners();
		if (this.executer !== undefined) {
			this.executer.pauseContinuousExecution(false);
			this.executer.disconnect();
			this.executer = undefined;
		}
	}

	start() {
		if (this.running === true)
			throw new Error(`AnimationSetupTest can't start because it is already running.`);

		this.running = true;
		const program = this.program;
		const proc = program.procedures.get('animation.setup');
		// if animation.setup is not defined, just give default settings.
		if (proc === undefined || (proc !== undefined && proc.parameters.length !== 0)) {
			if (proc !== undefined && proc.parameters.length !== 0)
				this._dispatchEvent('error', {'msg': `The animation.setup procedure must have 0 parameters. ${proc.parameters.length} found instead.`});
			this._dispatchEvent('animation-setup-result', {
				'duration': 10 // default duration
			});
			return;
		}

		const drawing = new VectorDrawing();
		const settings = {
			'animationTime': 0,
			'animationDurationSeconds': 10
		};
		const turtle = new Turtle(settings, drawing);
		const executer = new LogoProgramExecuter(turtle, program);
		this.executer = executer;
		executer.executionContext.procedureStack.push(new ExecutingProcedure(proc, -1, 0, 0, 0));
		executer.addBreakpoint(new Breakpoint(-1, undefined, function() {
			return true;
		}));
		const maxInstructions = 5000;
		const outer = this;
		executer.addEventListener('execution-stopped', function() {
			const vStack = executer.executionContext.valueStack;
			const result = vStack[vStack.length - 1];
			if (!(result instanceof Map))
				outer._dispatchEvent('error', {'msg': 'result from animation.setup must be a plist but something else was specified.'});
			else {
				for (const key of result.keys()) {
					if (!keyTypesMap.has(key))
						outer._dispatchEvent('warning', {'msg': `result from animation.setup contains an unrecognized property name ${key}.  animation.setup is expected to have properties such as ${Array.from(keyTypesMap.keys()).join(',')}`});
					else {
						const expectedType = keyTypesMap.get(key);
						const val = result.get(key);
						if (expectedType === 'num' && !isNumber(val)) {
							outer._dispatchEvent('error', {'msg': `The value of property ${key} from animation.setup is expected to be a number but another value type was specified.`});
						}
						else if (key === 'duration' && val <= 0) {
							outer._dispatchEvent('error', {'msg': `The duration must be over 0 but you specified a duration of ${val} seconds in animation.setup.`});
						}
					}
				}
			}
			let duration = result.get('duration');
			if (!isNumber(duration) || duration <= 0)
				duration = 10;
			outer._dispatchEvent('animation-setup-result', {
				'duration': duration
			});
		});
		executer.addEventListener('exception', function(event) {
			outer._dispatchEvent('error', {'msg': 'Exception', 'details': event.details});
		});
		function checkExecutionLimit() {
			if (executer.instructionExecutionCount > maxInstructions) {
				outer._dispatchEvent('error', {
					'msg': 'Excution time limit exceeded in the animation.setup procedure.  The procedure needs to complete quicker.  Consider removing some loops, recursion, or some procedure calls out of animation.setup.'
				});
			}
		}
		this.t = setInterval(checkExecutionLimit, 20);
		executer.startContinuousExecution();
	}
};