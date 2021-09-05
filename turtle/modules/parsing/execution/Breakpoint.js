export class Breakpoint {
	constructor(instructionIndex, procedureName, isMatched) {
		if (typeof instructionIndex !== 'number')
			throw new Error('instructionIndex must be a number');
		if (procedureName !== undefined && typeof procedureName !== 'string')
			throw new Error('procedureName must be either undefined or a string');
		if (isMatched !== undefined && typeof isMatched !== 'function')
			throw new Error('isMatched must either be undefined or a function');

		this.instructionIndex = instructionIndex;
		this.procedureName = procedureName;
		if (typeof isMatched === 'function')
			this.isMatched = isMatched;
	}

	isMatched(executionContext) {
		// Check that the breakpoint's procedure matches the current procedure.
		if (this.procedureName === undefined) {
			if (executionContext.procedureStack.length !== 0)
				return false;
		}
		else if (executionContext.procedureStack.length === 0) {
			return false;
		}
		else if (executionContext.getCurrentExecutingProcedure().procedure.name !== this.procedureName) {
			return false;
		}
		return true;
	}

	getLineNumber(instructionTuples) {
		// if the instructionIndex can't be of a real instruction,
		// return -1.
		if (this.instructionIndex < 0)
			return -1;

		instructionTuples = instructionTuples.
			filter(tuple => tuple[0] === this.procedureName);
		const instructionTuple = instructionTuples[this.instructionIndex];
		if (instructionTuple === undefined)
			return -1;
		return instructionTuple[2].parseTreeToken.lineIndex;
	}
};