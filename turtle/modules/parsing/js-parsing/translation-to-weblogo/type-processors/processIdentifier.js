import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processInGeneral } from './processInGeneral.js';
import { processUnaryOperator } from './processUnaryOperator.js';

const identifiersToWebLogo = new Map([
	['Math.PI', 'pi'],
]);
// It would be nice to iterate over the Math object to 
Object.getOwnPropertyNames(Math).forEach(function(key) {
	const key2 = 'Math.' + key;
	if (typeof Math[key] === 'number' &&
	!identifiersToWebLogo.has(key2)) {
		identifiersToWebLogo.set(key2, Math[key]);
	}
});

function isVariableRead(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return false;
	return true;
}

export function processIdentifier(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		if (token.children.length !== 0) {
			if (token.children.length === 1) {
				if (token.children[0].type === ParseTreeTokenType.UNARY_OPERATOR) {
					processUnaryOperator(processToken)(token.children[0], result, settings);
				}
				else {
					let fullIdentifierPath = token.val;
					for (let tok = token.children[0]; tok !== undefined; tok = tok.children[0]) {
						fullIdentifierPath += tok.val;
					}
					if (identifiersToWebLogo.has(fullIdentifierPath)) {
						const toValue = identifiersToWebLogo.get(fullIdentifierPath);
						result.append('' + toValue);
						return;
					}
					processInGeneral(processToken)(token, result, settings);
				}
			}
		}
		else {
			if (isVariableRead(token))
				result.append(':');
			result.append(token.val);
		}
	};
};