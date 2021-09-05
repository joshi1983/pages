import { MessageTypes } from '../../components/MessageTypes.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
const typeToMethodName = [];
typeToMethodName[MessageTypes.TypeError] = 'error';
typeToMethodName[MessageTypes.TypeTip] = 'tip';
typeToMethodName[MessageTypes.TypeWarning] = 'warn';

export class ParseMessage {
	constructor(type, msg, parseToken, isHTML) {
		if (typeof type !== 'number')
			throw new Error('type must be a number');
		if (typeof msg !== 'string')
			throw new Error('msg must be a string');
		if (!(parseToken instanceof ParseTreeToken))
			throw new Error('parseToken must be a ParseTreeToken');
		if (typeof isHTML !== 'boolean')
			throw new Error('isHTML must be a boolean');

		this.type = type;
		this.msg = msg;
		this.token = parseToken;
		this.isHTML = isHTML;
	}

	getZeroBaseLineIndex() {
		// if ParseTreeToken lineIndex ever starts at 1, 1 will need to be subtracted from it.
		return this.token.lineIndex;
	}

	sendTo(parseLogger) {
		parseLogger[typeToMethodName[this.type]](this.msg, this.token, this.isHTML);
	}
};