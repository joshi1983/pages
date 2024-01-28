export class Token {
	constructor(s, colIndex, lineIndex) {
		if (typeof s !== 'string')
			throw new Error('Token requires a string');
		if (typeof colIndex !== 'number')
			throw new Error('colIndex must be a number');
		if (colIndex < 0)
			throw new Error('colIndex must be at least 0 but was specified as ' + colIndex);
		if (typeof lineIndex !== 'number')
			throw new Error('lineIndex must be a number');
		this.s = s;
		this.colIndex = colIndex;
		this.lineIndex = lineIndex;
	}

	isComment() {
		return this.s.charAt(0) === ';';
	}

	isCommandName() {
		return this.s.length > 0 && !this.isStringLiteral() && !this.isVariableReadReference();
	}

	// For long string literals only
	isComplete() {
		if (this.s.charAt(0) === "'") {
			return this.s.length > 1 && this.s.charAt(this.s.length - 1) === "'";
		}
	}

	isStringLiteral() {
		return this.s.length > 0 && this.s.charAt(0) === '"';
	}

	isVariableReadReference() {
		return this.s.length > 0 && this.s.charAt(0) === ':';
	}
}