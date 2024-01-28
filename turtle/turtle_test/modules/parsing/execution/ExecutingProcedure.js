export class ExecutingProcedure {
	constructor(procedure, returnInstructionIndex, repcountStackHeight, forStackHeight, valueStackHeight) {
		if (typeof returnInstructionIndex !== 'number')
			throw new Error('returnInstructionIndex must be a number');
		if (typeof repcountStackHeight !== 'number')
			throw new Error('repcountStackHeight must be a number');
		if (typeof forStackHeight !== 'number')
			throw new Error('forStackHeight must be a number');
		if (typeof valueStackHeight !== 'number')
			throw new Error('valueStackHeight must be a number');
		this.procedure = procedure;

		this.repcountStackHeight = repcountStackHeight;
		this.forStackHeight = forStackHeight;
		this.valueStackHeight = valueStackHeight;
		this.returnInstructionIndex = returnInstructionIndex;
		this.localVariables = new Map();
		// includes actual parameter values and local variables
		// maps variable name to value.
	}
};