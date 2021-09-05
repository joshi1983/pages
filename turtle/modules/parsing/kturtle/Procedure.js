import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';

export class Procedure {
	constructor(name, parameters, nameToken) {
		if (typeof name !== 'string')
			throw new Error('name must be a string');
		if (!(parameters instanceof Array))
			throw new Error('parameters must be an Array');
		if (!(nameToken instanceof ParseTreeToken))
			throw new Error('nameToken should be a ParseTreeToken corresponding with the procedure\'s name');

		this.name = name.toLowerCase();
		this.parameters = parameters.map((p) => p.toLowerCase());
		this.nameToken = nameToken;
	}
};