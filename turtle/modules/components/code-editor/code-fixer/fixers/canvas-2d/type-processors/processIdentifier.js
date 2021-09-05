import { fetchJson } from '../../../../../../fetchJson.js';
import { getDeepestName } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { processJavaScriptGeneralToken } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processJavaScriptGeneralToken.js';
import { processToken } from './processToken.js';
const migrationData = await fetchJson('json/logo-migrations/HTML5Canvas2D.json');
const propertiesInfoMap = new Map();
migrationData.properties.forEach(function(info) {
	if (info.get === undefined || info.get.toCommand === undefined)
		return;
	if (!propertiesInfoMap.has(info.name))
		propertiesInfoMap.set(info.name, []);
	propertiesInfoMap.get(info.name).push(info);
});
const processConcrete = processJavaScriptGeneralToken(processToken);

function getPropertyInfoFromToken(token) {
	if (token.children.length === 0)
		return;
	const deepestName = getDeepestName(token);
	const propertyInfo = propertiesInfoMap.get(deepestName);
	if (propertyInfo !== undefined) {
		for (const prop of propertyInfo) {
			return prop;
		}
	}
}

export function processIdentifier(token, result, settings) {
	const propertyInfo = getPropertyInfoFromToken(token);
	if (propertyInfo !== undefined) {
		result.append(propertyInfo.get.toCommand);
		return;
	}
	processConcrete(token, result, settings);
};