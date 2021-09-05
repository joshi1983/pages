import { ParseLogger } from
'../../../parsing/loggers/ParseLogger.js';

function wrapMessage(msgString, token, isHTML) {
	return {
		'msg': msgString,
		'token': token,
		'isHTML': isHTML
	};
}

export class QualityReportParseLogger extends ParseLogger {
	constructor(addMessageFunc) {
		if (typeof addMessageFunc !== 'function')
			throw new Error(`addMessageFunc must be a function but found ${addMessageFunc}`);
		super();
		this.addMessageFunc = addMessageFunc;
	}

	error(msg, token, isHTML) {
		super.error(msg, token, isHTML);
		this.addMessageFunc(wrapMessage(msg, token, isHTML));
	}

	tip(msg, token, isHTML) {
		super.tip(msg, token, isHTML);
		this.addMessageFunc(wrapMessage(msg, token, isHTML));
	}

	warn(msg, token, isHTML) {
		if (isHTML === undefined)
			isHTML = false;
		super.warn(msg, token, isHTML);
		this.addMessageFunc(wrapMessage(msg, token, isHTML));
	}
};