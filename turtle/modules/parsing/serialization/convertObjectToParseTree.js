import { ParseTreeToken } from '../ParseTreeToken.js';
await ParseTreeToken.asyncInit();

/*
convertObjectToParseTree can be used on plain objects.

It can also be used to deep-clone a ParseTreeToken with all descendent tokens.

This is used with web worker code in AsyncParseTask.
We need to convert the returned object into instances of ParseTreeToken so the rest of our code 
can easily verify that it is of the required data types.
*/
export function convertObjectToParseTree(o) {
	const result = new ParseTreeToken(o.val, null, o.lineIndex, o.colIndex, o.type, o.originalString);
	for (let i = 0; i < o.children.length; i++) {
		result.appendChild(convertObjectToParseTree(o.children[i]));
	}
	return result;
};