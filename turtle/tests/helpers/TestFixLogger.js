import { FixLogger } from '../../modules/components/code-editor/code-fixer/FixLogger.js';

export class TestFixLogger extends FixLogger {
	constructor(parseLogger) {
		super(parseLogger);
		this.hasLogged = false;
	}

	log(msg, token) {
		super.log(msg, token);
		this.hasLogged = true;
	}
};