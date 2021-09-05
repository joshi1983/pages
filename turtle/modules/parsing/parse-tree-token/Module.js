import { flatten } from '../generic-parsing-utilities/flatten.js';

export class Module {
	constructor(name) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but found ${name}`);

		this.name = name;
	}

	assignToParseTree(root) {
		for (const token of flatten(root)) {
			token.module = this;
		}
	}
};