import { DataTypes } from '../../data-types/DataTypes.js';
import { validateMustOutputProcedure } from './helpers/validateMustOutputProcedure.js';
await DataTypes.asyncInit();

const outputTypes = new DataTypes('alphacolor|transparent');

function isOfInterest(cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	return function(token) {
		if (token.children.length !== 3)
			return false;
		const procNameToken = token.children[0];
		const procName = tokenValues.get(procNameToken);
		if (typeof procName === 'string') {
			const proc = cachedParseTree.getProcedureByName(procName.toLowerCase());
			if (proc !== undefined && proc.parameters.length === 2) {
				return true;
			}
		}
		return false;
	};
}

function validateOutputTokenChildTypes(outputTokens, cachedParseTree, parseLogger) {
	const tokenTypesMap = cachedParseTree.getTokensToDataTypes();
	const tokenValuesMap = cachedParseTree.getTokenValues();
	outputTokens.forEach(function(outputToken) {
		if (outputToken.children.length !== 1)
			return;
		const child = outputToken.children[0];
		const tokenTypes = tokenTypesMap.get(child);
		if (tokenTypes === undefined)
			return;
		let valueIsValid = true;
		if (tokenValuesMap.has(child)) {
			const val = tokenValuesMap.get(child);
			const requiredTypes = outputTypes.deepClone();
			// clone to prevent mutating outputTypes.
			requiredTypes.intersectWithValueCompatability(val);
			valueIsValid = !requiredTypes.isEmpty();
		}
		if (!outputTypes.hasIntersectionWith(tokenTypes) || !valueIsValid) {
			parseLogger.error('Every output in the procedure must output an alphacolor, color ' +
			'or transparent to work with the <span class="command">proceduralImage command</span>.', outputToken, true);
		}
	});
}

export function validateProceduralImageCalls(cachedParseTree, parseLogger) {
	const tokens = cachedParseTree.getCommandCallsByName('proceduralImage').filter(isOfInterest(cachedParseTree));
	const tokenValues = cachedParseTree.getTokenValues();
	tokens.forEach(function(token) {
		const procNameToken = token.children[0];
		const procName = tokenValues.get(procNameToken);
		if (procName !== undefined) {
			const proc = cachedParseTree.getProcedureByName(procName.toLowerCase());
			if (proc !== undefined && proc.parameters.length === 2) {
				const outputTokens = validateMustOutputProcedure(proc, parseLogger, 'alphacolor, color or transparent');
				validateOutputTokenChildTypes(outputTokens, cachedParseTree, parseLogger);
			}
		}
	});
};