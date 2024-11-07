import { DataTypes } from '../../data-types/DataTypes.js';
import { dataTypesToEnglish } from '../../../help/command-details/dataTypesToEnglish.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { isNumber } from '../../../isNumber.js';
import { isOutputToken } from '../isOutputToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { validateNoParameterMustOutputProcedure } from './helpers/validateNoParameterMustOutputProcedure.js';
await DataTypes.asyncInit();
const plistTypes = new DataTypes('plist');
const numberKeys = ['position.x', 'position.y', 'position.z', 'zoom.scale'];

function validateSnapshotProperties(outputToken, propertiesMap, parseLogger) {
	numberKeys.forEach(function(numberKey) {
		if (propertiesMap.has(numberKey)) {
			const val = propertiesMap.get(numberKey);
			if (!isNumber(val))
				parseLogger.error(`${numberKey} must be a number but you specified ${val}. Click to learn more about <span data-helpid="animation.snapshotstyle">animation.snapshotstyle</span>.`, outputToken, true);
			else if (numberKey === 'zoom.scale' && val <= 0)
				parseLogger.error(`zoom.scale must be greater than 0 but you specified ${val}. Click to learn more about <span data-helpid="animation.snapshotstyle">animation.snapshotstyle</span>.`, outputToken, true);
		}
	});
}

export function validateAnimationSnapshotStyleProcedure(cachedParseTree, parseLogger) {
	const proc = cachedParseTree.getProceduresMap().get('animation.snapshotstyle');
	if (proc !== undefined) {
		validateNoParameterMustOutputProcedure(proc, parseLogger, 'snapshot render settings');
		const procTokens = getDescendentsOfType(proc.getStartToken(), ParseTreeTokenType.PARAMETERIZED_GROUP);
		const tokenValues = cachedParseTree.getTokenValues();
		const outputCalls = procTokens.filter(isOutputToken);
		const tokenTypes = cachedParseTree.getTokensToDataTypes();
		outputCalls.forEach(function(outputCall) {
			const child = outputCall.children[0];
			const childTokenTypes = tokenTypes.get(child);
			const childTokenValue = tokenValues.get(child);
			if (childTokenTypes !== undefined && !childTokenTypes.hasIntersectionWith(plistTypes)) {
				parseLogger.error(`<span data-helpid="animation.snapshotstyle">animation.snapshotstyle</span> must always output a property list but you are outputting ${dataTypesToEnglish(childTokenTypes)}.  Click to learn how to properly define the <span data-helpid="animation.snapshotstyle">animation.snapshotstyle procedure</span>.`, outputCall, true);
			}
			if (childTokenValue instanceof Map) {
				validateSnapshotProperties(outputCall, childTokenValue, parseLogger);
			}
		});
	}
};