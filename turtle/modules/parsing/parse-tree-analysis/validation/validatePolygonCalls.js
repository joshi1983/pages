import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function validatePoint(point, i, token, parseLogger) {
	if (point.length < 2) {
		parseLogger.error(`Every point in the list passed to polygon must have ` +
		`a length of at least 2 but found a length of ${point.length} in item ${i + 1}`, token);
		return;
	}
	if (point.length > 3) {
		parseLogger.error(`Every point in the list passed to polygon must have ` +
		`a length of at most 3 but found a length of ${point.length} in item ${i + 1}`, token);
		return;
	}
	// The data types validator would have checked that every element was a number
	// so we don't need to implement that check here.
}

export function validatePolygonCalls(cachedParseTree, parseLogger) {
	const polygonCalls = cachedParseTree.getCommandCallsByName('polygon');
	if (polygonCalls.length === 0)
		return;
	const tokenValues = cachedParseTree.getTokenValues();
	polygonCalls.forEach(function(call) {
		const child = call.children[0];
		const val = tokenValues.get(child);
		if (val instanceof Array) {
			if (val.length >= 3) {
				for (let i = 0; i < val.length; i++) {
					const point = val[i];
					validatePoint(point, i, call, parseLogger);
				}
			}
		}
		else if (child.type === ParseTreeTokenType.LIST) {
			const children = child.children;
			for (let i = 0; i < children.length; i++) {
				const childToken = children[i];
				const pointVal = tokenValues.get(childToken);
				if (pointVal instanceof Array)
					validatePoint(pointVal, i, childToken, parseLogger);
			}
		}
	});
};