import { Operators } from '../../Operators.js';
import { processToken } from './processToken.js';

export function processBinaryOperator(token, result, settings) {
	const children = token.children;
	if (children.length !== 0) {
		const info = Operators.getOperatorInfo(token.val);
		let toSymbol = token.val;
		result.append(' ( ');
		if (info.toCommand !== undefined) {
			result.append(info.toCommand + ' ');
			toSymbol = undefined;
		}
		else if (info.toSymbol !== undefined) {
			toSymbol = info.toSymbol;
		}
		else if (info.toProc !== undefined) {
			result.append(info.toProc + ' ');
			toSymbol = undefined;
		}
		processToken(children[0], result, settings);
		if (toSymbol !== undefined)
			result.append(` ${toSymbol}`);
		result.append(' ');
		if (children.length > 1 )
			processToken(children[1], result, settings);
		result.append(' ) ');
	}
};