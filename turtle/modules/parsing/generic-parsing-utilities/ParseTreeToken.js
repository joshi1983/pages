
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

	appendSibling(nextToken) {
		if (!(nextToken instanceof ParseTreeToken))
			throw new Error('nextToken must be a ParseTreeToken');
		if (nextToken === this.parentNode || nextToken === this)
			throw new Error('nextToken must not be the parent or this to avoid adding a cycle in the parse tree');
		if (this.parentNode === null)
			throw new Error(`Can not appendSibling when this.parentNode is null.  this.type=${this.type}, this.val=${this.val}`);
		nextToken.parentNode = this.parentNode;
		const index = this.parentNode.children.indexOf(this);
		this.parentNode.children.splice(index + 1, 0, nextToken);
	}

	cloneWithDescendents() {
		const result = new ParseTreeToken(this.val, this.lineIndex, this.colIndex, this.type, this.originalString);
		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];
			const newChild = child.cloneWithDescendents();
			result.appendChild(newChild);
		}
		return result;
	}

	getNextSibling() {
		if (this.parentNode === null)
			return null;
		const index = this.parentNode.children.indexOf(this);
		if (index === this.parentNode.children.length - 1)
			return null;
		return this.parentNode.children[index + 1];
	}

	getPreviousSibling() {
		if (this.parentNode === null)
			return null;
		const index = this.parentNode.children.indexOf(this);
		if (index <= 0)
			return null;
		return this.parentNode.children[index - 1];
	}

	insertAsFirstChild(newChild) {
		if (this.children.length === 0)
			this.appendChild(newChild);
		else
			this.insertChildBefore(0, newChild);
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

	// removes from parentNode
	remove() {
		if (this.parentNode !== null)
			this.parentNode.removeChild(this);
	}

	removeAllChildren() {
		for (let child of this.children) {
			child.parentNode = null;
			// removeChild method does this so removeAllChildren should also.
		}
		this.children.length = 0; 
		// I'm avoiding this.children = [] so the same instance of Array is still used.
	}

	removeChild(childToRemove) {
		const index = this.children.indexOf(childToRemove);
		if (index === -1)
			throw new Error(`Unable to removeChild because the childToRemove is not currently a child of this. childToRemove=${childToRemove}, type name=${childToRemove.constructor.name}`);

		childToRemove.parentNode = null;
		this.children.splice(index, 1);
	}

	replaceChild(oldChild, newChild, dontRemoveNewChildFromItsParent) {
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
		if (newChild.parentNode !== null && dontRemoveNewChildFromItsParent !== true)
			newChild.parentNode.removeChild(newChild);
		newChild.parentNode = this;
		oldChild.parentNode = null;
		this.children[index] = newChild;
	}
};