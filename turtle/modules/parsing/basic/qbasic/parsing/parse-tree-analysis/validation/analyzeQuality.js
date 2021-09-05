import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { functionDefinitionToName } from '../functionDefinitionToName.js';
import { functionDefinitionTypes } from '../../functionDefinitionTypes.js';
import { getAnalyzedVariables } from
'../variable-data-types/variables/getAnalyzedVariables.js';
import { QBasicFunction } from '../QBasicFunction.js';
import { validateIndividualTokens } from '../../../../../generic-parsing-utilities/validateIndividualTokens.js';
import { validateToken } from './type-validators/validateToken.js';

const validators = [
validateIndividualTokens(validateToken)
];

function getFunctionsMapFromParseTokens(parseTokens) {
	const tokens = parseTokens.filter(t => functionDefinitionTypes.has(t.type));
	const result = new Map();
	for (const token of tokens) {
		const name = functionDefinitionToName(token);
		if (typeof name === 'string') {
			const parameters = [];
			result.set(name, new QBasicFunction(name, parameters));
		}
	}
	return result;
}

export function analyzeQuality(token, parseLogger) {
	const allTokens = flatten(token);
	const options = {
		'functionsMap': getFunctionsMapFromParseTokens(allTokens),
		'variables': getAnalyzedVariables(token)
	};
	validators.forEach(v => v(allTokens, parseLogger, options));
};