export class DataTypeParseToken {
	constructor(val, type) {
		if (!Number.isInteger(type))
			throw new Error(`type must be an integer but got ${type}`);
		if (val !== null && typeof val !== 'string')
			throw new Error(`val expected to either be null or a string but got ${val}`);
		this.val = val;
		this.type = type;
		this.children = [];
	}

	appendChild(newChild) {
		if (this === newChild)
			throw new Error('newChild must not be this.');
		if (this.parentNode === newChild)
			throw new Error('newChild must not be this.parentNode.');
		if (!(newChild instanceof DataTypeParseToken))
			throw new Error(`newChild must be a DataTypeParseToken.  Not: ${newChild}`);
		this.children.push(newChild);
		newChild.parentNode = this;
	}
};