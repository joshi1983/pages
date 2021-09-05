import { Operators } from '../../Operators.js';
import { processDivision } from './binary-operators/processDivision.js';
import { processToken } from './processToken.js';

const processors = new Map([
	['/', processDivision]
]);

export function processBinaryOperator(token, result, settings) {
	const children = token.children;
	if (children.length !== 0) {
		if (children.length === 2) {
			const processor = processors.get(token.val);
			if (processor !== undefined) {
				processor(token, result, settings);
				return;
			}
		}
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