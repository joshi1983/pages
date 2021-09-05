import { codeToHTML } from './codeToHTML.js';
import { Highlighter } from './highlighters/Highlighter.js';

/*
parseTreeToCodeWithComments performs the related task of converting a parse tree into a string.
parseTreeToCodeWithComments is more complex in that the parse tree may be changed to something not in the original string.

We can safely assume that code and tree represent exactly the same code here.  
We still need code to know what whitespace characters are used, content of comments...
*/


export function codeToElement(code, tree, parseMessages, idPrefix, isPre) {
	if (typeof code !== 'string')
		throw new Error('code must be a string');
	if (parseMessages !== undefined && !(parseMessages instanceof Array))
		throw new Error('parseMessages must be undefined or an Array.  Not: ' + parseMessages);
	if (typeof idPrefix !== 'string')
		throw new Error('idPrefix must be a string.  Not: ' + idPrefix);
	if (isPre === undefined)
		isPre = true;
	else if (typeof isPre !== 'boolean')
		throw new Error('isPre must be undefined, true, or false.  Not: ' + isPre);
	const e = document.createElement(isPre ? 'pre' : 'span');
	e.setAttribute('id', idPrefix);
	e.classList.add('syntax-highlighter');
	const htmlInfo = codeToHTML(code, tree, parseMessages, idPrefix);
	if (htmlInfo === undefined)
		e.innerText = code;
	else {
		e.innerHTML = htmlInfo.html;
		Highlighter.process(e);
		tree = htmlInfo.tree;
	}
	return {
		'element': e,
		'tree': tree
	};
};