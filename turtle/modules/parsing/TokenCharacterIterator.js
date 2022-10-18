function sanitizeToken(token) {
	if (token instanceof Array) {
		token = {'colIndex': token[0], 'lineIndex': token[1]};
	}
	return token;
}

export class TokenCharacterIterator {
	constructor(code) {
		if (typeof code !== 'string')
			throw new Error(`code must be a string but got: ${code}`);
		this.code = code;
		this.index = 0;
		this.colIndex = 0;
		this.lineIndex = 0;
	}

	assignLocation(token) {
		token = sanitizeToken(token);
		if (typeof token !== 'object')
			throw new Error(`token expected to be an object.  Not: ${token}`);
		this.colIndex = token.colIndex;
		this.lineIndex = token.lineIndex;
	}

	equalsLocation(token) {
		token = sanitizeToken(token);
		return this.colIndex === token.colIndex &&
			this.lineIndex === token.lineIndex;
	}

	getChar() {
		return this.code.charAt(this.index);
	}

	next() {
		if (this.index >= this.code.length)
			throw new Error(`Can not go past index ${this.code.length - 1}.  index=${this.index}`);
		const ch = this.code.charAt(this.index++);
		if (ch === '\n') {
			this.lineIndex++;
			this.colIndex = 0;
		}
		else
			this.colIndex++;
	}
};