import { ParseTreeToken } from '../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { indexOfWhitespace, lastIndexOfWhitespace } from './whitespaceUtils.js';

export class LoggedSection {
	constructor(s, token, isSpacePrefixed) {
		if (typeof s !== 'string')
			throw new Error('s must be a string');
		if (!(token instanceof ParseTreeToken))
			throw new Error('token must be a ParseTreeToken');
		if (typeof isSpacePrefixed !== 'boolean')
			throw new Error('isSpacePrefixed must be a boolean.  Not: ' + isSpacePrefixed);

		this.s = s;
		this.token = token;
		this.isSpacePrefixed = isSpacePrefixed;
	}

	breakAt(index) {
		if (this.token.type !== ParseTreeTokenType.COMMENT)
			throw new Error('breakAt should not be called unless this LoggedSection is a comment.  '+
				'Other token types should be exploded and then an ideal breaking point within that exploded array should be selected.');

		let newIndex = index;

		// find the last whitespace before the specified index.
		if (index < this.s.length) {
			newIndex = lastIndexOfWhitespace(this.s, index);
			if (newIndex <= 1)
				newIndex = indexOfWhitespace(this.s, index);
		}
		let lines;
		if (newIndex > 1 && newIndex < this.s.length) {
			lines = [this.s.substring(0, newIndex)];
			lines.push(';' + this.s.substring(newIndex));
		}
		else {
			lines = [this.s];
		}
		return lines.map(s => new LoggedSection(s, this.token, false));
	}

	isExplodable() {
		if ([ParseTreeTokenType.PROCEDURE_START_KEYWORD,
		ParseTreeTokenType.LEAF,
		ParseTreeTokenType.VARIABLE_READ,
		ParseTreeTokenType.COMMENT].indexOf(this.token.type) !== -1)
			return false;
		return this.s.indexOf(' ') !== -1;
	}

	explode() {
		if (this.isExplodable()) {
			return this.s.split(' ').map((s, index) => new LoggedSection(s, this.token, index === 0 && this.isSpacePrefixed));
		}
		else
			return [this];
	}

	static getStringFromSections(sections) {
		if (!(sections instanceof Array))
			throw new Error('sections must be an Array');
		let s = '';
		sections.forEach(function(section) {
			if (s === '' || !section.isSpacePrefixed)
				s += section.s;
			else
				s += ' ' + section.s;
		});
		return s.trim();
	}

	static createByJoining(sections) {
		if (!(sections instanceof Array))
			throw new Error('sections must be an Array');
		if (sections.length === 0)
			throw new Error('sections must contain at least 1 element');

		const s = LoggedSection.getStringFromSections(sections);
		const isSpacePrefixed = sections[0].isSpacePrefixed;
		const token = sections[0].token;
		return new LoggedSection(s, token, isSpacePrefixed);
	}
};