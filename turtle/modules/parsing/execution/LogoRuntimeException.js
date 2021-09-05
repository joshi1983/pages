export class LogoRuntimeException extends Error {
	constructor(msg, parseTreeToken) {
		super(msg);
		this.parseToken = parseTreeToken;
	}
};