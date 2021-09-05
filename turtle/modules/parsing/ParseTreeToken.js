import { getLastDescendentTokenOf } from './parse-tree-token/getLastDescendentTokenOf.js';
import { getRootForParseTreeToken } from './parse-tree-token/getRootForParseTreeToken.js';
import { Operators } from './Operators.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { Token } from './Token.js';

export class ParseTreeToken {
	static asyncInit() {
		return Operators.asyncInit();
	}

	constructor(val, parentNode, lineIndex, colIndex, type, originalString) {
		if (typeof val !== 'boolean' && typeof val !== 'string' && typeof val !== 'number' && val !== null) {
			throw new Error('val must be a string, number, or null.');
		}
		if (parentNode !== null) {
			if (!(parentNode instanceof ParseTreeToken))
				throw new Error('parentNode must be a ParseTreeToken or null.');
			if (type === ParseTreeTokenType.TREE_ROOT)
				throw new Error('A TREE_ROOT must have no parentNode');
		}
		if (!Number.isInteger(lineIndex))
			throw new Error(`lineIndex must be an integer.  not: ${lineIndex}`);
		if (!Number.isInteger(colIndex))
			throw new Error(`colIndex must be an integer.  not: ${colIndex}`);
		if (!Number.isInteger(type))
			throw new Error('type must be an integer. type specified as ' + type + ' when val specified as ' + val);
		if (originalString !== undefined && typeof originalString !== 'string')
			throw new Error('originalString must be either undefined or a string.  Not: ' + originalString);

		this.val = val;
		this.parentNode = parentNode;
		this.children = [];
		this.lineIndex = lineIndex;
		this.colIndex = colIndex;
		this.nextSibling = null; // no next sibling.
		this.previousSibling = null; // no previous sibling
		this.type = type;
		this.originalString = originalString;
	}

	_refreshChildrenCache() {
		if (this.children.length > 0) {
			var c = this.children[0];
			if (c === this)
				throw new Error('cycle detected.  A child is its own parent.');
			const newChildren = [c];
			for (c = c.nextSibling; c !== null; c = c.nextSibling) {
				newChildren.push(c);
			}
			this.children = newChildren;
		}
		else
			this.children.length = 0;
	}

	appendChild(nextChild) {
		if (!(nextChild instanceof ParseTreeToken))
			throw new Error(`nextChild must be a ParseTreeToken.  Found ${nextChild}`);
		if (nextChild === this)
			throw new Error('nextChild must not be this to avoid adding a cycle in the parse tree');
		if (nextChild === this.parentNode)
			throw new Error('nextChild must not be the parent to avoid adding a cycle in the parse tree. parentNode.val = ' + this.parentNode.val);
		if (nextChild.type === ParseTreeTokenType.TREE_ROOT)
			throw new Error('nextChild must not be a TREE_ROOT');

		nextChild.nextSibling = null; // no next sibling.
		if (this.children.length > 0) {
			nextChild.previousSibling = this.children[this.children.length - 1];
			this.children[this.children.length - 1].appendSibling(nextChild);
		}
		else {
			nextChild.previousSibling = null;
			nextChild.parentNode = this;
			this.children.push(nextChild);
		}
	}

	appendPreviousSibling(previousToken) {
		if (!(previousToken instanceof ParseTreeToken))
			throw new Error('previousToken must be a ParseTreeToken');
		if (previousToken === this.parentNode || previousToken === this)
			throw new Error('previousToken must not be the parent or this to avoid adding a cycle in the parse tree');
		if (previousToken.type === ParseTreeTokenType.TREE_ROOT)
			throw new Error('previousToken must not be a TREE_ROOT.  A TREE_ROOT should have no siblings.');

		previousToken.parentNode = this.parentNode;
		previousToken.previousSibling = this.previousSibling;
		previousToken.nextSibling = this;
		if (this.previousSibling !== null) {
			this.previousSibling.nextSibling = previousToken;
		}
		this.previousSibling = previousToken;
		if (this.parentNode !== null) {
			if (this.parentNode.children[0] === this) {
				// _refreshChilddrenCache will correct everything else if the first element is correct.
				this.parentNode.children = [this.previousSibling];
			}
			this.parentNode._refreshChildrenCache();
		}
	}

	appendSibling(nextToken) {
		if (!(nextToken instanceof ParseTreeToken))
			throw new Error('nextToken must be a ParseTreeToken');
		if (nextToken === this.parentNode || nextToken === this)
			throw new Error('nextToken must not be the parent or this to avoid adding a cycle in the parse tree');
		if (nextToken.type === ParseTreeTokenType.TREE_ROOT)
			throw new Error('nextToken must not be a TREE_ROOT.  A TREE_ROOT should have no siblings.');

		nextToken.parentNode = this.parentNode;
		nextToken.nextSibling = this.nextSibling; // important if this is not the last sibling.
		if (this.nextSibling !== null) {
			this.nextSibling.previousSibling = nextToken;
		}
		nextToken.previousSibling = this;
		this.nextSibling = nextToken;
		if (this.parentNode !== null) {
			this.parentNode._refreshChildrenCache();
		}
	}

	static arrayToString(parseTreeTokens) {
		if (parseTreeTokens instanceof ParseTreeToken)
			parseTreeTokens = [parseTreeTokens];

		var result = parseTreeTokens.map(function(c) {
			return c.toString();
		});
		return result.join(" ");
	}

	countNodes() {
		var result = 1;
		this.children.forEach(function(n) {
			result += n.countNodes();
		});
		return result;
	}

	static countTokens(parseTreeTokens) {
		if (parseTreeTokens instanceof ParseTreeToken)
			return parseTreeTokens.countNodes();

		if (!(parseTreeTokens instanceof Array))
			throw new Error('parseTreeTokens must be an Array');
		var result = 0;
		parseTreeTokens.forEach(function(token) {
			result += token.countNodes();
		});
		return result;
	}

	static createFromScannedToken(token, impossibleTypes) {
		if (!(token instanceof Token))
			throw new Error('token must be a Token');
		if (!(impossibleTypes instanceof Set))
			throw new Error('impossibleTypes must be a Set');
		var type = ParseTreeTokenType.LEAF;
		var val = token.s;
		if (typeof val === 'string') {
			if (val !== '') {
				if (val.charAt(0) === ':') {
					type = ParseTreeTokenType.VARIABLE_READ;
					val = val.substring(1);
				}
				else if (val.charAt(0) === '"') {
					type = ParseTreeTokenType.STRING_LITERAL;
					val = val.substring(1);
				}
				else if (val.charAt(0) === '\'') {
					type = ParseTreeTokenType.LONG_STRING_LITERAL;
					if (token.isComplete())
						val = val.substring(1, val.length - 1);
					else
						val = val.substring(1);
				}
				else if (val === '\n')
					type = ParseTreeTokenType.NEW_LINE;
				else if (Operators.getOperatorInfo(val))
					type = ParseTreeTokenType.BINARY_OPERATOR;
				else if (val.toLowerCase() === "to")
					type = ParseTreeTokenType.PROCEDURE_START_KEYWORD;
				else if (val.toLowerCase() === "end")
					type = ParseTreeTokenType.PROCEDURE_END_KEYWORD;
				else if (["true", "false"].indexOf(val.toLowerCase()) !== -1) {
					type = ParseTreeTokenType.BOOLEAN_LITERAL;
					val = val.toLowerCase() === "true";
				}
				else if (token.isComment())
					type = ParseTreeTokenType.COMMENT;
			}
		}
		if (impossibleTypes.has(type))
			type = ParseTreeTokenType.LEAF;
		if (type === ParseTreeTokenType.LEAF && !isNaN(val)) {
			type = ParseTreeTokenType.NUMBER_LITERAL;
			val = parseFloat(val);
		}
		let originalString = token.s;
		if (ParseTreeTokenType.NUMBER_LITERAL !== type && ParseTreeTokenType.BOOLEAN_LITERAL !== type)
			originalString = undefined;
		const result = new ParseTreeToken(val, null, token.lineIndex, token.colIndex, type, originalString);
		if (type === ParseTreeTokenType.LONG_STRING_LITERAL)
			result.isComplete = token.isComplete();
		return result;
	}

	static createFromType(type, token) {
		if (typeof type !== 'number')
			throw new Error('type must be a number.');

		return new ParseTreeToken(null, null, token.lineIndex, token.colIndex, type);
	}

	static createRootToken() {
		return new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	}

	static createRootTokenFor(parseTreeTokens) {
		if (!(parseTreeTokens instanceof Array))
			throw new Error('createRootTokenFor requires an Array. Got ' + parseTreeTokens);
		if (parseTreeTokens.length === 1 && parseTreeTokens[0].type === ParseTreeTokenType.TREE_ROOT)
			return parseTreeTokens[0];

		if (parseTreeTokens.length > 0) {
			const result = ParseTreeToken.createFromType(ParseTreeTokenType.TREE_ROOT, parseTreeTokens[0]);
			parseTreeTokens.forEach(function(token) {
				result.appendChild(token);
			});
			return result;
		}
		else
			return new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	}

	// copies from this node down in the tree.
	deepClone() {
		const result = this.shallowClone();
		this.children.forEach(function(c) {
			result.appendChild(c.deepClone());
		});
		return result;
	}

	doesAnyAncestorHaveType(type) {
		var n = this;
		while (n.parentNode !== null) {
			n = n.parentNode;
			if (n.type === type)
				return true;
		}
		return false;
	}

	static flatten(parseTreeTokens) {
		if (parseTreeTokens instanceof ParseTreeToken)
			parseTreeTokens = [parseTreeTokens];
		if (!(parseTreeTokens instanceof Array))
			throw new Error('parseTreeTokens must be an Array or a ParseTreeToken but got ' + parseTreeTokens);

		const result = new Set(parseTreeTokens);
		const queue = parseTreeTokens.slice();
		while (queue.length > 0) {
			const e = queue.shift();
			if (e.parentNode !== null && !result.has(e.parentNode)) {
				result.add(e.parentNode);
				queue.push(e.parentNode);
			}
			e.children.forEach(function(ec) {
				if (!result.has(ec)) {
					result.add(ec);
					queue.push(ec);
				}
			});
		}
		return Array.from(result);
	}

	getChildCount() {
		return this.children.length;
	}

	getDepth() {
		let n = this;
		let result = 0;
		while (n.parentNode !== null) {
			n = n.parentNode;
			result++;
		}
		return result;
	}

	getHeight() {
		if (this.children.length === 0)
			return 1;
		else 
			return 1 + ParseTreeToken.getMaxHeight(this.children);
	}

	getLastToken() {
		return getLastDescendentTokenOf(getRootForParseTreeToken(this));
	}

	static getMaxHeight(tokens) {
		if (tokens instanceof ParseTreeToken)
			return tokens.getHeight();

		var maxHeight = 0;
		tokens.forEach(function(c) {
			maxHeight = Math.max(maxHeight, c.getHeight());
		});
		return maxHeight;
	}

	getNextSibling() {
		return this.nextSibling;
	}

	// implemented for compatibility with functions designed for 
	// generic-parsing-utilities/ParseTreeToken.js.
	getPreviousSibling() {
		return this.previousSibling;
	}

	isBracket() {
		return this.type === ParseTreeTokenType.LEAF &&
			typeof this.val === 'string' && this.val.length === 1 &&
			"[]()".indexOf(this.val) !== -1;
	}

	isBracketOrBinaryOperator() {
		return this.type === ParseTreeTokenType.BINARY_OPERATOR ||
			this.isBracket();
	}

	isStringLiteral() {
		return this.type === ParseTreeTokenType.STRING_LITERAL ||
			this.type === ParseTreeTokenType.LONG_STRING_LITERAL;
	}

	prependChild(child) {
		const firstChild = this.children[0];
		if (firstChild === undefined)
			this.appendChild(child);
		else
			firstChild.appendPreviousSibling(child);
	}

	remove() {
		if (this.parentNode === null)
			throw new Error('Not able to remove because the ParseTreeToken has no parentNode');
		this.parentNode.removeChild(this);
	}

	removeChild(child) {
		if (!(child instanceof ParseTreeToken))
			throw new Error('child must be a ParseTreeToken');

		if (child === this.children[0]) {
			if (this.children.length === 1)
				this.children = []; // has no children anymore.
			else {
				this.children[1].previousSibling = null;
				this.children = [this.children[1]];
				this._refreshChildrenCache();
			}
		}
		else {
			if (child.nextSibling !== null && child.nextSibling.previousSibling === child) {
				child.nextSibling.previousSibling = child.previousSibling;
			}
			if (child.previousSibling !== null && child.previousSibling.nextSibling === child) {
				child.previousSibling.nextSibling = child.nextSibling;
			}
			this._refreshChildrenCache();
		}
		child.nextSibling = null;
		child.previousSibling = null;
		child.parentNode = null;
	}

	replaceChild(oldChild, newChild) {
		if (!(newChild instanceof ParseTreeToken))
			throw new Error('newChild must be a ParseTreeToken');
		if (oldChild === newChild)
			throw new Error('Can not replace a node with itself');
		if (!(oldChild instanceof ParseTreeToken))
			throw new Error('oldChild must be a ParseTreeToken');
		if (newChild === this.parentNode || newChild === this)
			throw new Error('newChild must not be the parent or this to avoid adding a cycle in the parse tree');
		if (oldChild.parentNode !== this)
			throw new Error('oldChild must be an existing child of this');
		if (newChild.type === ParseTreeTokenType.TREE_ROOT)
			throw new Error('newChild must not be a TREE_ROOT');
		if (newChild === oldChild.nextSibling || newChild === oldChild.previousSibling) {
			// weird case but it seems clear the caller just wants to remove oldChild.
			this.removeChild(oldChild); 
			return;
		}

		if (oldChild.previousSibling !== null)
			oldChild.previousSibling.nextSibling = newChild;
		if (oldChild.nextSibling !== null)
			oldChild.nextSibling.previousSibling = newChild;
		newChild.previousSibling = oldChild.previousSibling;
		newChild.nextSibling = oldChild.nextSibling;
		newChild.parentNode = this;
		if (this.children[0] === oldChild)
			this.children[0] = newChild;

		this._refreshChildrenCache();
	}

	// clones this node's properties without linking to any parent or child.
	shallowClone() {
		return new ParseTreeToken(this.val, null, this.lineIndex, this.colIndex, this.type);
	}

	toString() {
		if (this.type === ParseTreeTokenType.VARIABLE_READ)
			return ':' + this.val;
		else if (this.type === ParseTreeTokenType.STRING_LITERAL)
			return '"' + this.val;
		else if (this.type === ParseTreeTokenType.LONG_STRING_LITERAL) {
			if (this.isComplete === false)
				return '\'' + this.val;
			else
				return '\'' + this.val + '\'';
		}
		else if (this.type === ParseTreeTokenType.NUMBER_LITERAL || this.type === ParseTreeTokenType.BOOLEAN_LITERAL) {
			if (this.originalString !== undefined) {
				if (this.type === ParseTreeTokenType.BOOLEAN_LITERAL || 
				(this.type === ParseTreeTokenType.NUMBER_LITERAL && parseFloat(this.originalString) === this.val))
					return this.originalString;
			}
			return "" + this.val;
		}
		else if (this.children.length === 0)
			return this.val;
		else if (this.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD ||
		this.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
			return this.val + ' ' + ParseTreeToken.arrayToString(this.children);
		else if (this.children.length === 2 && this.type === ParseTreeTokenType.BINARY_OPERATOR)
			return this.children[0].toString() + ' ' + this.val + ' ' + this.children[1].toString();
		else if (this.children.length === 1 && this.type === ParseTreeTokenType.UNARY_OPERATOR)
			return `- ${this.children[0].toString()}`;
		else
			return ParseTreeToken.arrayToString(this.children);
	}
};