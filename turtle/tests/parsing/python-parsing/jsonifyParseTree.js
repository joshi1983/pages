/*
Useful for troubleshooting failing tests if you run:
console.log(jsonifyParseTree(token, code));
*/
export function jsonifyParseTree(token, code) {
	const result = {
		'val': token.val,
		'originalString': token.originalString,
		'type': ParseTreeTokenType.getNameFor(token.type),
		'children': token.children.map(child => jsonify(child, code))
	};
	return result;
};