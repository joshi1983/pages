import { compareParseTokens } from '../../compareParseTokens.js';

export function checkForInvalidFromToTokens(scope) {
	if (scope instanceof Array) // array of scopes
		scope.forEach(checkForInvalidFromToTokens);
	else {
		if (compareParseTokens(scope.fromToken, scope.toToken) > 0) {
			console.log(`fromToken is after toToken.  fromToken = `, scope.fromToken, ', toToken = ', scope.toToken);
		}
	}
};