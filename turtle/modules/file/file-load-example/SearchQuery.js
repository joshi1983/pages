import { CommandConstraint } from './CommandConstraint.js';

export class SearchQuery {
	constructor(queryString) {
		if (typeof queryString !== 'string')
			throw new Error(`queryString must be a string.  Not: ${queryString}`);
		const parts = queryString.split(' ');
		const commandParts = parts.filter(part => CommandConstraint.isCommand(part));
		this.commandConstraints = commandParts.map(part => new CommandConstraint(part));
		this.queryString = parts.filter(part => commandParts.indexOf(part) === -1).join(' ');
	}

	isMatching(example) {
		if (this.commandConstraints.some(constraint => !constraint.isMatching(example)))
			return false;
		const outer = this;
		if (example.name.toLowerCase().indexOf(this.queryString) === 0)
			return true;
		if (example.searchKeywords.filter(function(keyword) {
				return keyword.toLowerCase().indexOf(outer.queryString) === 0;
			}).length !== 0)
			return true;

		return false;
	}
};