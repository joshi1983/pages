
/*
Don't confuse this ParseTreeToken with the ParseTreeToken above a directory.
They're intended to be very similar but one is for parsing Python and the other is for WebLogo.
*/
export class ParseTreeToken {
	constructor(val, lineIndex, colIndex, type, originalString) {
		if (Number.isInteger(lineIndex) === false)
			throw new Error(`lineIndex must be an integer but got ${lineIndex}`);
		if (Number.isInteger(colIndex) === false)
			throw new Error(`colIndex must be an integer but got ${colIndex}`);
		if (Number.isInteger(type) === false)
			throw new Error(`type must be an integer but got ${type}`);

		this.val = val;
		this.lineIndex = lineIndex;
		this.colIndex = colIndex;
		this.type = type;
		this.children = [];
		this.originalString = originalString;
		this.parentNode = null;
	}

	appendChild(newChild) {
		if (!(newChild instanceof ParseTreeToken))
			throw new Error(`newChild must be a ParseTreeToken but got ${newChild}`);
		if (newChild === this)
			throw new Error(`newChild can not be added as a child of itself.  That would introduce a cycle.`);
		if (newChild === this.parentNode)
			throw new Error(`newChild must not be this.parentNode.  That would introduce a cycle.`);
		if (newChild.parentNode !== null)
			newChild.parentNode.removeChild(newChild);

		newChild.parentNode = this;
		this.children.push(newChild);
	}

	insertChildBefore(index, newChild) {
		if (!Number.isInteger(index) || index < 0)
			throw new Error(`index must be a positive integer but got ${index}`);
		if (newChild === this)
			throw new Error(`newChild can not be added as a child of itself.  That would introduce a cycle.`);
		if (!(newChild instanceof ParseTreeToken))
			throw new Error(`newChild must be a ParseTreeToken but got ${newChild}`);
		if (newChild === this.parentNode)
			throw new Error(`newChild must not be this.parentNode.  That would introduce a cycle.`);
		if (newChild.parentNode !== null)
			newChild.parentNode.removeChild(newChild);
		newChild.parentNode = this;
		this.children.splice(index, 0, newChild);
	}

	removeChild(childToRemove) {
		const index = this.children.indexOf(childToRemove);
		if (index === -1)
			throw new Error(`Unable to removeChild because the childToRemove is not currently a child of this.`);

		childToRemove.parentNode = null;
		this.children.splice(index, 1);
	}

	replaceChild(oldChild, newChild) {
		if (newChild === this)
			throw new Error(`newChild can not be added as a child of itself.  That would introduce a cycle.`);
		if (oldChild === newChild)
			return; // nothing to do.
		if (newChild === undefined) {
			this.removeChild(oldChild);
			return;
		}
		if (newChild.parentNode === this)
			throw new Error(`Unable to replaceChild because the newChild is already a child of this.`);
		const index = this.children.indexOf(oldChild);
		if (index === -1)
			throw new Error(`Unable to replaceChild because the oldChild is not currently a child of this.`);
		if (newChild.parentNode !== null)
			newChild.parentNode.removeChild(newChild);
		newChild.parentNode = this;
		oldChild.parentNode = null;
		this.children[index] = newChild;
	}
};