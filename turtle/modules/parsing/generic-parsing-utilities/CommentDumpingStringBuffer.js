import { isAfterOrSame } from './isAfterOrSame.js';
import { StringBuffer } from '../../StringBuffer.js';

/*
Similar to a StringBuffer but also provides a way to process comments at times
that fit the flow of generated WebLogo code.
*/
export class CommentDumpingStringBuffer {
	constructor(comments, processSingleLineCommentToken) {
		if (!(comments instanceof Array))
			throw new Error(`comments must be an Array. Not: ${comments}`);
		this.processSingleLineCommentToken = processSingleLineCommentToken;
		this.comments = comments;
		this.stringBuffer = new StringBuffer();
		this.isLastAComment = false;
	}

	append(s) {
		this.stringBuffer.append(s);
		if (s !== '')
			this.isLastAComment = false;
	}

	endsWithAndNotAcomment(s) {
		if (this.isLastAComment)
			return false;
		/* if the last thing appended was a comment,
		return false so the caller doesn't try manipulating the tail.
		*/
		return this.stringBuffer.endsWith(s);
	}

	processAllRemainingComments() {
		let isLastAComment = false;
		if (this.comments.length !== 0)
			isLastAComment = true;
		for (let i = 0; i < this.comments.length; i++) {
			this.processSingleLineCommentToken(this.comments[i], this);
		}
		this.comments.length = 0;
		this.isLastAComment = isLastAComment;
	}

/*
processCommentsUpToToken is to be called frequently while translating to WebLogo.
append will be called more frequently, though, because each call to append could be for adding
tiny parts of generated code.
*/
	processCommentsUpToToken(token) {
		let i;
		for (i = 0; i < this.comments.length && isAfterOrSame(token, this.comments[i]); i++) {
			this.processSingleLineCommentToken(this.comments[i], this);
		}
		// remove the processed comments.
		this.comments.splice(0, i);
	}

	removeFromTail(count) {
		this.stringBuffer.removeFromTail(count);
	}

	toString() {
		return this.stringBuffer.toString();
	}

	trimRight() {
		this.stringBuffer.trimRight();
	}
};