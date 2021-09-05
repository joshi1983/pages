import { StringUtils } from './StringUtils.js';

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
	constructor(maxChunkSize, maintainLineCount) {
		if (maxChunkSize === undefined)
			maxChunkSize = 100;
		else if (!Number.isInteger(maxChunkSize) || maxChunkSize < 1)
			throw new Error('maxChunkSize must either be an integer at least 1 or be left undefined.  Not: ' + maxChunkSize);
		if (maintainLineCount !== undefined && typeof maintainLineCount !== 'boolean')
			throw new Error(`maintainLineCount must be true or false but found ${maintainLineCount}`);
		else if (maintainLineCount !== true)
			maintainLineCount = false;

		this.maxChunkSize = maxChunkSize;
		this.maintainLineCount = maintainLineCount;
		this.clear();
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

		if (this.maintainLineCount)
			this.lineCount += StringUtils.countChar(s, '\n');
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
		if (this.maintainLineCount)
			this.lineCount = 0;
	}

	endsWith(s) {
		if (s === '')
			return true;
		let tail = this.currentChunk;
		for (let i = this.strings.length - 1; i >= 0 && tail.length < s.length; i--)
			tail = this.strings[i] + tail;
		return tail.endsWith(s);
	}

	isEmpty() {
		if (this.currentChunk.length !== 0)
			return false;
		if (this.strings.length !== 0)
			return false;
		return true;
	}

	removeFromTail(count) {
		if (!Number.isInteger(count) || count < 0)
			throw new Error(`count must be a positive integer.  Not: ${count}`);
		if (count === 0)
			return; // nothing to do.
		if (count <= this.currentChunk.length) {
			const newCurrentChunk = this.currentChunk.substring(0, this.currentChunk.length - count);
			if (this.maintainLineCount) {
				this.lineCount -= (StringUtils.countChar(this.currentChunk, '\n') - StringUtils.countChar(newCurrentChunk));
			}
			this.currentChunk = newCurrentChunk;
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
			if (this.maintainLineCount) {
				this.lineCount = 0;
			}
		}
		else {
			const lastString = this.strings[newLastIndex];
			this.strings.length = newLastIndex + 1;
			this.strings[newLastIndex] = lastString.substring(0, lastString.length - count);
			if (this.maintainLineCount) {
				// Adjusting this in the for-loop and the above mutations seemed too bug-prone for
				// the performance gain of avoiding a call to toString().
				// For that reason, we'll just use toString() and recount all \n's.
				this.lineCount = StringUtils.countChar(this.toString(), '\n');
			}
		}
	}

	toString() {
		return this.strings.join('') + this.currentChunk;
	}

	trimRight() {
		const newCurrentChunk = trimRight(this.currentChunk);
		if (this.maintainLineCount && newCurrentChunk.length !== this.currentChunk.length) {
			this.lineCount -= (StringUtils.countChar(this.currentChunk, '\n') -
				StringUtils.countChar(newCurrentChunk, '\n'));
		}
		this.currentChunk = newCurrentChunk;
		if (this.strings.length === 0 || this.currentChunk !== '')
			return;
		let s;
		do {
			const last = this.strings[this.strings.length - 1];
			s = trimRight(last);
			
			if (this.maintainLineCount && s.length !== last.length) {
				this.lineCount -= (StringUtils.countChar(last, '\n') - StringUtils.countChar(s, '\n'));
			}
			this.strings[this.strings.length - 1] = s;
			if (s === '') {
				this.strings.pop(); // remove the last string.
			}
		} while (s === '' && this.strings.length !== 0);
	}
};