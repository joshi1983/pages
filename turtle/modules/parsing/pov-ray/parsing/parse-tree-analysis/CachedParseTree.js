import { flatten } from '../../../generic-parsing-utilities/flatten.js';

export class CachedParseTree {
	constructor(root) {
		this.root = root;
		this.tokensByType = [];
	}

	getAllTokens() {
		if (this.allTokens === undefined)
			this.allTokens = flatten(this.root);

		return this.allTokens;
	}
};