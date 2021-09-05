import { isNumberToken, possiblyBitwiseOperators } from
'../../parsing/parse-tree-analysis/variable-data-types/isNumberToken.js';
import { isStringToken } from
'../../parsing/parse-tree-analysis/variable-data-types/isStringToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';
import { QBasicOperators } from '../../QBasicOperators.js';
import { StringUtils } from
'../../../../../../StringUtils.js';

function processPlusOperator(token, result, options) {
	const children = token.children;
	const first = children[0];
	const last = children[1];
	result.append(' ');
	if (isStringToken(first, options) || isStringToken(last, options)) {
		result.append('word ');
		if (!isStringToken(first, options))
			result.append(' str ');
		processToken(first, result, options);
		result.append(' ');
		if (!isStringToken(last, options))
			result.append(' str ');
		processToken(last, result, options);
	}
	else if (last.type === ParseTreeTokenType.NUMBER_LITERAL && last.val[0] === '-') {
		// translate to binary subtract operator so the code is easier to read.
		processToken(first, result, options);
		result.append(' - ');
		result.append(last.val.substring(1));
	}
	else {
		processToken(first, result, options);
		result.append(' + ');
		processToken(last, result, options);
	}
	result.append(' ');
}

const processors = new Map([
	['+', processPlusOperator]
]);

export function processBinaryOperator(token, result, options) {
	const info = QBasicOperators.getOperatorInfo(token.val);
	const children = token.children;
	const lastChild = children[children.length - 1];
	const processor = processors.get(info.symbol);
	if (children.length === 2 && processor !== undefined) {
		processor(token, result, options);
		return;
	}
	let name;
	if (possiblyBitwiseOperators.has(token.val.toLowerCase()) &&
	isNumberToken(token, options)) {
		name = 'bit' + StringUtils.capitalizeFirstLetter(token.val.toLowerCase());
	}
	if (info.to !== undefined) {
		if (children.length === 2)
			processToken(children[0], result, options);
		result.append(` ${info.to} `);
		if (lastChild !== undefined)
			processToken(lastChild, result, options);
	}
	else if (info.toCommand !== undefined ||
	info.convertToProc !== undefined) {
		if (name === undefined)
			name = info.toCommand === undefined ? info.convertToProc : info.toCommand;
		result.append(` ${name} `);
		processTokens(children, result, options);
	}
};