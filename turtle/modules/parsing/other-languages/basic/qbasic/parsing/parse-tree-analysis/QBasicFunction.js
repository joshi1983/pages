export class QBasicFunction {
	constructor(name, args) {
		if (typeof name !== 'string')
			throw new Error(`The function name must be a string but found ${name}`);
		if (!(args instanceof Array))
			throw new Error(`args must be Array but given ${args}`);
		this.name = name;
		this.args = args;
	}
};