import { fetchText } from '../../../fetchText.js';

export class LogoDataInputStream {
	constructor(url) {
		this.url = url;
		this.index = 0;
	}

	bufferAll() {
		if (this.bufferAllPromise === undefined) {
			this.bufferAllPromise = fetchText(this.url);
			const outer = this;
			this.bufferAllPromise.then(function(text) {
				outer.textBuffer = text;
			});
		}
		return this.bufferAllPromise;
	}

	/*
	Call dispose() when you finished using an instance of LogoDataInputStream.
	This will make the instance completely useless with the benefit of also
	helping the JavaScript execution engine free memory associated with it.
	*/
	dispose() {
		this.url = undefined;
		this.bufferAllPromise = undefined;
		this.textBuffer = undefined;
	}

	readLine() {
		if (this.textBuffer === undefined)
			throw new Error('textBuffer is undefined.  Was bufferAll() called and awaited prior to readLine()?');
		let i = this.textBuffer.indexOf('\n', this.index);
		if (i === -1) {
			const result = this.textBuffer.substring(this.index);
			this.index = this.textBuffer.length;
			return result;
		}
		else {
			const result = this.textBuffer.substring(this.index, i - 1);
			this.index = i + 1;
			return result;
		}
	}
};