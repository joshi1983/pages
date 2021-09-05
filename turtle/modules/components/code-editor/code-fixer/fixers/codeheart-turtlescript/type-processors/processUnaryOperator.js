import { isAssigningToLocalVariable } from './helpers/isAssigningToLocalVariable.js';
import { processInGeneral } from './processInGeneral.js';
import { processToken } from './processToken.js';

export function processUnaryOperator(token, result) {
	if (token.val === '++' || token.val === '--') {
		const varNameToken = token.children.length === 0 ? token.parentNode : token.children[0];
		const varName = typeof varNameToken.val === 'string' ? varNameToken.val : 'x';
		if (isAssigningToLocalVariable(varNameToken))
			result.append('local');
		result.append(`make "${varName} :${varName} ${token.val[0]} 1`);
	}
	else if (token.val === '-' || token.val === '!') {
		const toSymbol = token.val === '-' ? '-' : 'not ';
		result.append(toSymbol);
		if (token.children.length !== 0)
			processToken(token.children[0], result);
	}
	else {
		processInGeneral(token, result);
	}
};