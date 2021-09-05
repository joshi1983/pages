import { DataTypes } from '../../data-types/DataTypes.js';
import { dataTypesToEnglish } from '../../../help/command-details/dataTypesToEnglish.js';
await DataTypes.asyncInit();
const specialLengths = new Set([3, 4]);
const listTypes = new DataTypes('list').types;
const alphacolorTypes = new DataTypes('alphacolor').types;
const alphaColorOrTransparentTypes = new DataTypes('alphacolor|transparent').types;

function isDefinitelyList(types) {
	if (types === undefined)
		return false;
	return DataTypes.contains(listTypes, types.types);
}

function isAlphaColor(types) {
	if (types === undefined)
		return false;
	return DataTypes.contains(alphacolorTypes, types.types);
}

function isAlphaColorOrTransparent(types) {
	if (types === undefined)
		return false;
	return DataTypes.contains(alphaColorOrTransparentTypes, types.types);
}

export function validateMixCalls(cachedParseTree, logger) {
	const mixCalls = cachedParseTree.getCommandCallsByName('mix');
	if (mixCalls.length === 0)
		return;
	const dataTypes = cachedParseTree.getTokensToDataTypes();
	mixCalls.forEach(function(mixCall) {
		const children = mixCall.children;
		if (children.length >= 2) {
			const types1 = dataTypes.get(children[0]);
			const types2 = dataTypes.get(children[1]);
			if (isDefinitelyList(types1) && isDefinitelyList(types2)) {
				const length1 = cachedParseTree.getLengthFromToken(children[0]);
				const length2 = cachedParseTree.getLengthFromToken(children[1]);
				if (length1 !== undefined && length2 !== undefined) {
					if ((!specialLengths.has(length1) || !specialLengths.has(length2)) && length1 !== length2) {
						logger.error(`Invalid inputs for the mix command.  If either length is not 3 or 4, they must be of equal length.  ${length1} &lt;&gt; ${length2}.  See <span class="command">mix command</span> for more explanation and examples.`, mixCall, true);
					}
				}
			}
			else if (isDefinitelyList(types1)) {
				if (isAlphaColorOrTransparent(types2)) {
					const length1 = cachedParseTree.getLengthFromToken(children[0]);
					if (Number.isInteger(length1) && !specialLengths.has(length1)) {
						logger.error(`Invalid inputs to mix command.  A ${dataTypesToEnglish(types2)} is being mixed with a list of unacceptable length.  An acceptable length is 3 or 4 but found length ${length1}.  Click <span class="command">mix command</span> to learn more about it.`, children[1], true);
					}
				}
			}
			else if (isDefinitelyList(types2)) {
				if (isAlphaColor(types1)) {
					const length2 = cachedParseTree.getLengthFromToken(children[1]);
					if (Number.isInteger(length2) && !specialLengths.has(length2)) {
						logger.error(`Invalid inputs to mix command.  A ${dataTypesToEnglish(types1)} is being mixed with a list of unacceptable length.  An acceptable length is 3 or 4 but found length ${length2}.  Click <span class="command">mix command</span> to learn more about it.`, children[1], true);
					}
				}
			}
		}
	});
};