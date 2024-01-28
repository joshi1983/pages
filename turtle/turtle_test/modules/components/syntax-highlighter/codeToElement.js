import { codeToHTML } from './codeToHTML.js';

/*
parseTreeToCodeWithComments performs the related task of converting a parse tree into a string.
parseTreeToCodeWithComments is more complex in that the parse tree may be changed to something not in the original string.

We can safely assume that code and tree represent exactly the same code here.  
We still need code to know what whitespace characters are used, content of comments...
*/


export function codeToElement(code, tree, parseMessages, idPrefix, isBlock) {
	if (typeof code !== 'string')
		throw new Error('code must be a string');
	if (parseMessages !== undefined && !(parseMessages instanceof Array))
		throw new Error('parseMessages must be undefined or an Array.  Not: ' + parseMessages);
	if (typeof idPrefix !== 'string')
		throw new Error('idPrefix must be a string.  Not: ' + idPrefix);
	if (isBlock === undefined)
		isBlock = true;
	else if (typeof isBlock !== 'boolean')
		throw new Error('isBlock must be undefined, true, or false.  Not: ' + isBlock);
	const e = document.createElement(isBlock ? 'div' : 'span');
	e.setAttribute('id', idPrefix);
	e.classList.add('syntax-highlighter', 'visualization-container');
	const htmlInfo = codeToHTML(code, tree, parseMessages, idPrefix);
	if (htmlInfo === undefined)
		e.innerText = code;
	else {
		e.innerHTML = htmlInfo.html;
		tree = htmlInfo.tree;
	}
	return {
		'element': e,
		'tree': tree
	};
};