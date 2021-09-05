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

	isMatchingStrict(example) {
		const outer = this;
		if (example.name.toLowerCase() === this.queryString)
			return true;
		if (example.searchKeywords.some(function(keyword) {
				return keyword.toLowerCase() === outer.queryString;
			}))
			return true;
		if (example.hiddenKeywords !== undefined && example.hiddenKeywords.some(function(keyword) {
				return keyword.toLowerCase() === outer.queryString;
			}))
			return true;
		return false;
	}

	isMatchingMedium(example) {
		if (this.commandConstraints.some(constraint => !constraint.isMatching(example)))
			return false;
		const outer = this;
		if (example.name.toLowerCase().indexOf(this.queryString) === 0)
			return true;
		if (example.searchKeywords.some(function(keyword) {
				return keyword.toLowerCase().indexOf(outer.queryString) === 0;
			}))
			return true;
		if (example.hiddenKeywords !== undefined && example.hiddenKeywords.some(function(keyword) {
				return keyword.toLowerCase().indexOf(outer.queryString) === 0;
			}))
			return true;

		return false;
	}
};