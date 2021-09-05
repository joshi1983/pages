
/*
The StringBuffer is intended to improve performance for algorithms that build a long string 1 character at a time.
The problem with repeatedly running something like s += c for a long string s and a character c is that 
every += takes time proportional to the long string's length.  
This string buffer class should help by limiting the string size for each concatenation to 100 length and calculating 
the long string only after everything is done.
*/
export class StringBuffer {
	constructor(maxChunkSize) {
		if (maxChunkSize === undefined)
			maxChunkSize = 100;
		else if (typeof maxChunkSize !== 'number')
			throw new Error('maxChunkSize must either be a number or be left undefined.  Not: ' + maxChunkSize);
		this.clear();
		this.maxChunkSize = maxChunkSize;
	}

	_flush() {
		if (this.currentChunk !== '') {
			this.strings.push(this.currentChunk);
			this.currentChunk = '';
		}
	}

	append(s) {
		if (typeof s !== 'string')
			throw new Error('s must be a string. Not: ' + s);
		if (s === '')
			return; // nothing to do so skip the rest to be efficient.

		if (s.length > this.maxChunkSize) {
			this._flush();
			this.strings.push(s);
		}
		else {
			if (this.currentChunk.length > this.maxChunkSize)
				this._flush();
			this.currentChunk += s;
		}
	}

	clear() {
		this.strings = [];
		this.currentChunk = '';
	}

	toString() {
		return this.strings.join('') + this.currentChunk;
	}
};