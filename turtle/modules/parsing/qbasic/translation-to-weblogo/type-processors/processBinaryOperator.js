import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';
import { QBasicOperators } from '../../QBasicOperators.js';

export function processBinaryOperator(token, result) {
	const info = QBasicOperators.getOperatorInfo(token.val);
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (info.to !== undefined) {
		if (children.length === 2)
			processToken(children[0], result);
		result.append(` ${info.to} `);
		processToken(lastChild, result);
	}
	else if (info.toCommand !== undefined) {
		result.append(` ${info.toCommand} `);
		processTokens(children, result);
	}
};