import { argListToParameterValueTokens } from './argListToParameterValueTokens.js';
import { evaluateLiteralToken } from
'../../../../../../../parsing/js-parsing/evaluators/evaluateLiteralToken.js';
import { processToken } from '../processToken.js';

function shouldUseCircle(paramValueTokens) {
	const firstTok = paramValueTokens[0];
	if (firstTok === undefined)
		return false;
	const val = evaluateLiteralToken(firstTok);
	return val === 360;
}

export function arc(callToken, result) {
	const paramValueTokens = argListToParameterValueTokens(callToken.children[1]);
	if (paramValueTokens.length === 2) {
		if (shouldUseCircle(paramValueTokens)) {
			result.append('circle ');
			processToken(paramValueTokens[1], result);
		}
		else {
			result.append('arc ');
			for (const tok of paramValueTokens) {
				processToken(tok, result);
			}
			result.append('\n');
		}
	}
};