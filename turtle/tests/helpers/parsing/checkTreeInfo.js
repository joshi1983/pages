import { prefixWrapper } from '../prefixWrapper.js';

export function checkTreeInfo(token, treeInfo, logger, ParseTreeTokenType) {
	if (treeInfo.val !== undefined && token.val !== treeInfo.val)
		logger(`Expected val to be ${treeInfo.val} but got ${token.val}`);
	if (treeInfo.children !== undefined) {
		if (treeInfo.children.length !== token.children.length)
			logger(`Expected ${treeInfo.children.length} children but found ${token.children.length}.  The actual children vals are ${token.children.map(t => t.val).join(',')}.  Actual children types are ${token.children.map(t => ParseTreeTokenType.getNameFor(t.type))}  The parent val = ${token.val}, parent type = ${ParseTreeTokenType.getNameFor(token.type)}`);
		else {
			treeInfo.children.forEach(function(child, index) {
				const plogger = prefixWrapper(`child ${index}`, logger);
				checkTreeInfo(token.children[index], child, plogger, ParseTreeTokenType);
				if (child.parentNode === null)
					plogger(`parentNode should not be null for a token with val ${child.val} and type ${ParseTreeTokenType.getNameFor(child.type)}`);
			});
		}
	}
	if (treeInfo.type !== undefined && treeInfo.type !== token.type)
		logger(`Expected type to be ${treeInfo.type} or ${ParseTreeTokenType.getNameFor(treeInfo.type)} but found ${token.type} or ${ParseTreeTokenType.getNameFor(token.type)}`);
};