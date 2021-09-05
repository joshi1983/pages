import { PovRayOperators } from '../../PovRayOperators.js';
import { processToken } from './processToken.js';

export function processBinaryOperator(token, result) {
	if (token.children.length !== 0) {
		processToken(token.children[0], result);
		let toSymbol = token.val;
		const info = PovRayOperators.getOperatorInfo(token.val);
		if (info !== undefined && info.to !== undefined)
			toSymbol = info.to;
		result.append(` ${toSymbol} `);
		if (token.children.length > 1)
			processToken(token.children[1], result);
	}
};