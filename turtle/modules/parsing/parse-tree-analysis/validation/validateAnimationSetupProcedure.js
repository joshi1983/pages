import { CommandCalls } from '../CommandCalls.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { dataTypesToEnglish } from
'../../../help/command-details/dataTypesToEnglish.js';
import { getAllDescendentsAsArray } from
'../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isNumber } from '../../../isNumber.js';
import { isOutputToken } from '../isOutputToken.js';
import { keyTypesMap } from
'../../../components/code-editor/quality-report/AnimationSetupTest.js';
import { validateNoParameterMustOutputProcedure } from './helpers/validateNoParameterMustOutputProcedure.js';
await DataTypes.asyncInit();
const plistTypes = new DataTypes('plist');
const restrictedCommandNames = ['animation.clampedTimeRatio',
'animation.time', 'animation.timeRatio', 'animation.duration'];

function errorDurationRequired(token, parseLogger) {
	parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span>'s result must have a duration property but your property list does not`, token, true);
}

export function validateAnimationSetupProcedure(cachedParseTree, parseLogger) {
	const proc = cachedParseTree.getProceduresMap().get('animation.setup');
	if (proc !== undefined) {
		validateNoParameterMustOutputProcedure(proc, parseLogger, 'duration in seconds');
		const tokenValues = cachedParseTree.getTokenValues();
		const startToken = proc.getStartToken();
		const procTokens = getAllDescendentsAsArray(startToken);
		const restrictedCalls = CommandCalls.filterCommandCalls(procTokens, restrictedCommandNames);
		restrictedCalls.forEach(function(token) {
			parseLogger.error(`The <span data-helpid="animation.setup">animation.setup procedure</span> must never call ${token.val} because the animation set up is not something that should depend on time`, token, true);
		});
		const outputCalls = procTokens.filter(isOutputToken);
		const tokenTypes = cachedParseTree.getTokensToDataTypes();
		outputCalls.forEach(function(outputCall) {
			const child = outputCall.children[0];
			const childTokenTypes = tokenTypes.get(child);
			const childTokenValue = tokenValues.get(child);
			if (childTokenTypes !== undefined && !childTokenTypes.hasIntersectionWith(plistTypes)) {
				parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span> must always output a property list but you are outputting ${dataTypesToEnglish(childTokenTypes)}.  Click to learn how to properly define the <span data-helpid="animation.setup">animation.setup procedure</span>.`, outputCall, true);
			}
			if (CommandCalls.tokenMatchesPrimaryName(child, 'createPList'))
				errorDurationRequired(child, parseLogger);
			else if (childTokenValue instanceof Map) {
				const duration = childTokenValue.get('duration');
				if (duration !== undefined) {
					if (!isNumber(duration))
						parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span>'s result must have a numeric duration but you specified ${duration}`, outputCall, true);
					else if (duration <= 0)
						parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span>'s result must have a duration that is strictly greater than 0 but you specified ${duration}`, outputCall, true);
				}
				else
					errorDurationRequired(outputCall, parseLogger);
				const thumbnailTime = childTokenValue.get('thumbnailTime');
				if (thumbnailTime !== undefined) {
					if (!isNumber(thumbnailTime))
						parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span>'s result must have a numeric thumbnailTime but you specified ${thumbnailTime}`, outputCall, true);
					else if (thumbnailTime < 0)
						parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span>'s result must have a thumbnailTime that is at least 0 but you specified ${thumbnailTime}`, outputCall, true);
					else if (isNumber(duration) && thumbnailTime > duration)
						parseLogger.error(`<span data-helpid="animation.setup">animation.setup</span>'s result must have a thumbnailTime that is at most the duration(${duration}) but you specified ${thumbnailTime}`, outputCall, true);
				}
				for (const key of childTokenValue.keys()) {
					if (!keyTypesMap.has(key))
						parseLogger.warn(`The ${key} property is not recognized for return values from <span data-helpid="animation.setup">animation.setup</span>.  The recognized properties are ${Array.from(keyTypesMap.keys()).join(', ')}.`, outputCall, true);
				}
			}
		});
	}
};