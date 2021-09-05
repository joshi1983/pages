import { getBezierPointsValidationMessage } from '../../execution/instructions/data-type-converters/validateBezierPoints.js';

export function validateBezierCalls(cachedParseTree, parseLogger) {
	const tokenValues = cachedParseTree.getTokenValues();
	const bezierCalls = cachedParseTree.getCommandCallsByName('bezier').
		filter(call => call.children.length === 2 && tokenValues.get(call.children[0]) instanceof Array);
	for (let i = 0; i < bezierCalls.length; i++) {
		const call = bezierCalls[i];
		const listToken = call.children[0];
		const listVal = tokenValues.get(listToken);
		const msg = getBezierPointsValidationMessage(listVal);
		if (msg !== undefined)
			parseLogger.error(msg, listToken, false);
	}
};