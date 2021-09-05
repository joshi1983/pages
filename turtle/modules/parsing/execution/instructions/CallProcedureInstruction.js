import { LogoInstruction } from './LogoInstruction.js';
import { ExecutingProcedure } from '../ExecutingProcedure.js';
import { Procedure } from '../../Procedure.js';

export class CallProcedureInstruction extends LogoInstruction {
	static _name = 'call-proc';

	constructor(procedure, parseTreeToken) {
		if (!(procedure instanceof Procedure))
			throw new Error('procedure must be a Procedure.  Passed is: ' + procedure);
		super(true, parseTreeToken);
		this.procedure = procedure;
		this.reversedParameters = this.procedure.getReversedParameters();
	}

	static createFromDTO(dto, token, proceduresMap) {
		return new CallProcedureInstruction(proceduresMap.get(dto.procName), token);
	}

	execute(context) {
		const paramCount = this.procedure.parameters.length;
		const execProc = new ExecutingProcedure(this.procedure,
			context.instructionIndex + 1, context.repcountStack.length, context.forcountStack.length, context.valueStack.length - paramCount);
		context.procedureStack.push(execProc);
		const revParams = this.reversedParameters;
		/* Avoiding the Array's forEach method for a tiny performance gain */
		for (let i = 0; i < revParams.length; i++) {
			execProc.localVariables.set(revParams[i], context.valueStack.pop());
		}
		context.instructionIndex = 0;
	}

	toDTO() {
		return {
			'name': CallProcedureInstruction._name,
			'procName': this.procedure.name
		};
	}
}