import { CallCommandInstruction } from './CallCommandInstruction.js';
import { CallProcedureInstruction } from './CallProcedureInstruction.js';
import { Command } from '../../Command.js';
import { isNumber } from '../../../isNumber.js';
import { isSupportedByHighOrderInvoke } from '../../isSupportedByHighOrderInvoke.js';
import { LogoInstruction } from './LogoInstruction.js';
await Command.asyncInit();

export class CallHighOrderInstruction extends LogoInstruction {
	static _name = 'call-high-order';

	constructor(numArgs, parseTreeToken) {
		if (!isNumber(numArgs))
			throw new Error('numArgs must be a number.  Passed is: ' + numArgs);
		super(false, parseTreeToken);
		this.numArgs = numArgs;
		this.skipValidationAndSanitization = false;
	}

	static createFromDTO(dto, token, proceduresMap) {
		return new CallHighOrderInstruction(dto.numArgs, token);
	}

	execute(context) {
		let cprocName = context.valueStack.pop();
		if (typeof cprocName !== 'string')
			throw new Error('command or procedure name must be a string but got ' + cprocName);
		const info = Command.getCommandInfo(cprocName);
		if (info === undefined) {
			cprocName = cprocName.toLowerCase();
			const procedure = context.logoProgram.procedures.get(cprocName);
			if (procedure === undefined)
				throw new Error(`Unable to get procedure with name "${cprocName}"`);
			const procCall = new CallProcedureInstruction(procedure, this.parseTreeToken);
			procCall.execute(context);
			super.isControllingInstructionIndex = true;
		}
		else {
			if (!isSupportedByHighOrderInvoke(info))
				throw new Error(`Unable to call command ${info.primaryName} dynamically`);
			const cmd = new CallCommandInstruction(info, this.numArgs, this.parseTreeToken);
			cmd.execute(context);
			super.isControllingInstructionIndex = false;
		}
	}

	toDTO() {
		return {
			'name': CallHighOrderInstruction._name,
			'numArgs': this.numArgs
		};
	}
}