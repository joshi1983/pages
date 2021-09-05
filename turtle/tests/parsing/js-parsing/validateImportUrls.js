import { evaluateStringLiteral } from
'../../../modules/parsing/js-parsing/evaluateStringLiteral.js';
import { getTokensByType } from
'../../../modules/parsing/generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { URLUtils } from
'../../../modules/components/URLUtils.js';

function importToFrom(importNode) {
	const fromResults = importNode.children.filter(child => child.type === ParseTreeTokenType.FROM &&
			child.children.length === 1);
	return fromResults[0];
}

function isOfInterest(cachedParseTree, filenamesSet) {
	return function(node) {
		return importToFrom(node) !== undefined;
	};
}

/*
Validates a few things that are suitable for WebLogo but not 
in general for other JavaScript projects.
*/
export function validateImportUrls(cachedParseTree, logger, filenamesSet, parseTreePath) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	if (!(filenamesSet instanceof Set))
		throw new Error(`filenamesSet must be a Set but found ${filenamesSet}`);
	const imports = getTokensByType(cachedParseTree, ParseTreeTokenType.IMPORT).
	filter(isOfInterest(cachedParseTree, filenamesSet));
	imports.forEach(function(importNode) {
		const fromNode = importToFrom(importNode);
		const urlLiteral = fromNode.children[0];
		let url = evaluateStringLiteral(urlLiteral.val);
		if (!url.endsWith('.js'))
			logger(`Expected the import to be from a .js URL but ${url} does not end with .js.`);
		else if (url[0] !== '.')
			logger(`Expected the import to be from a URL starting with . but ${url} does not start with .`);
		else {
			const computedUrl = URLUtils.computeRelativeURL(parseTreePath, url);
			if (!filenamesSet.has(computedUrl))
				logger(`Unable to match ${computedUrl} with a listed js module path.  An import statement imported from ${url}.`);
		}
	});
};