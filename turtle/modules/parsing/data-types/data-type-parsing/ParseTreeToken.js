export class ParseTreeToken {
	constructor(val, type) {
		if (!Number.isInteger(type))
			throw new Error(`type must be an integer but got ${type}`);
		if (val !== null && typeof val !== 'string')
			throw new Error(`val expected to either be null or a string but got ${val}`);
		this.val = val;
		this.type = type;
		this.children = [];
		this.parentNode = null;
	}

	appendChild(newChild) {
		if (this === newChild)
			throw new Error('newChild must not be this.');
		if (this.parentNode === newChild)
			throw new Error('newChild must not be this.parentNode.');
		if (!(newChild instanceof ParseTreeToken))
			throw new Error(`newChild must be a ParseTreeToken.  Not: ${newChild}`);
		this.children.push(newChild);
		newChild.parentNode = this;
	}

	remove() {
		const parent = this.parentNode;
		const index = parent.children.indexOf(this);
		this.parentNode = null;
		if (index !== -1) {
			parent.children.splice(index, 1);
		}
	}
};