function trimRight(s) {
	return s.replace(/\s+$/, '');
}

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

	endsWith(s) {
		if (s === '')
			return true;
		let tail = this.currentChunk;
		for (let i = this.strings.length - 1; i >= 0 && tail.length < s.length; i--)
			tail = this.strings[i] + tail;
		return tail.endsWith(s);
	}

	removeFromTail(count) {
		if (!Number.isInteger(count) || count < 0)
			throw new Error(`count must be a positive integer.  Not: ${count}`);
		if (count === 0)
			return; // nothing to do.
		if (count <= this.currentChunk.length) {
			this.currentChunk = this.currentChunk.substring(0, this.currentChunk.length - count);
			return;
		}
		if (this.strings.length === 0)
			throw new Error(`Can not remove ${count} characters because there are no strings in this StringBuffer.`);
		count -= this.currentChunk.length;
		this.currentChunk = '';
		let newLastIndex;
		for (newLastIndex = this.strings.length - 1;
		newLastIndex >= 0 && count >= this.strings[newLastIndex].length;
		newLastIndex--) {
			count -= this.strings[newLastIndex].length;
		}
		if (newLastIndex === -1) {
			this.strings.length = 0;// completely empty.
		}
		else {
			const lastString = this.strings[newLastIndex];
			this.strings.length = newLastIndex + 1;
			this.strings[newLastIndex] = lastString.substring(0, lastString.length - count);
		}
	}

	toString() {
		return this.strings.join('') + this.currentChunk;
	}

	trimRight() {
		this.currentChunk = trimRight(this.currentChunk);
		if (this.strings.length === 0 || this.currentChunk !== '')
			return;
		let s;
		do {
			s = trimRight(this.strings[this.strings.length - 1]);
			this.strings[this.strings.length - 1] = s;
			if (s === '') {
				this.strings.pop(); // remove the last string.
			}
		} while (s === '' && this.strings.length !== 0);
	}
};