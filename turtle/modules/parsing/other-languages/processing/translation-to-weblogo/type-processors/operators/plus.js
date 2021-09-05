import { processToken } from '../processToken.js';

export function plus(operatorToken, result, settings) {
	// if either operand data type is string,
		// translate to word str op1 str op2 where the str is added only when the operand is not already a string.
	const tokenTypes = settings.cachedParseTree.getTokensToDataTypes();
	const first = operatorToken.children[0];
	const last = operatorToken.children[1];
	const op1Type = tokenTypes.get(first);
	const op2Type = tokenTypes.get(last);
	if (op1Type === 'String' || op2Type === 'String') {
		result.append(' word ');
		if (op1Type !== 'String')
			result.append(' str ');

		processToken(first, result, settings);
		if (op2Type !== 'String')
			result.append(' str ');

		processToken(last, result, settings);
	}
	else {
		result.append(' (');
		processToken(first, result, settings);
		result.append(') + (');
		processToken(last, result, settings);
		result.append(') ');
	}
};