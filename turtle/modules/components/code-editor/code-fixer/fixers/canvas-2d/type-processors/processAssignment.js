import { fetchJson } from '../../../../../../fetchJson.js';
import { getDeepestName } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { isSpecialProperty, processSpecialProperty } from './assignments/properties/processSpecialProperty.js';
import { processJavaScriptGeneralToken } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processJavaScriptGeneralToken.js';
import { processToken } from './processToken.js';
import { shouldAssignmentBeRemoved } from './assignments/shouldAssignmentBeRemoved.js';

const processConcrete = processJavaScriptGeneralToken(processToken);
const migrationData = await fetchJson('json/logo-migrations/HTML5Canvas2D.json');
const propertiesInfoMap = new Map();
migrationData.properties.forEach(function(info) {
	if (info.set === undefined || (info.set.toCommand === undefined &&
	info.set.removeInMigration !== true)) {
		if (!isSpecialProperty(info))
			return;
	}
	if (!propertiesInfoMap.has(info.name))
		propertiesInfoMap.set(info.name, []);
	propertiesInfoMap.get(info.name).push(info);
});

function getPropertyInfoFromToken(token) {
	if (token.children.length === 0)
		return;
	const deepestName = getDeepestName(token);
	const properties = propertiesInfoMap.get(deepestName);
	if (properties !== undefined) {
		return properties[0];
	}
}

export function processAssignment(token, result, settings) {
	if (shouldAssignmentBeRemoved(token))
		return;
	if (token.children.length === 2) {
		const propertyInfo = getPropertyInfoFromToken(token.children[0]);
		if (propertyInfo !== undefined) {
			if (isSpecialProperty(propertyInfo)) {
				processSpecialProperty(propertyInfo, token, result, settings);
				return;
			}
			if (propertyInfo.set.removeInMigration)
				return;
			result.append(propertyInfo.set.toCommand + ' ');
			processToken(token.children[1], result, settings);
			return;
		}
	}
	processConcrete(token, result, settings);
};