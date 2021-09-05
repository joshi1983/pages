import { commandsToMap } from '../../../../../../parsing/generic-parsing-utilities/commandsToMap.js';
import { fetchJson } from '../../../../../../fetchJson.js';
import { inlineListForMakeColor, isMakeColorCall } from './helpers/inlineListForMakeColor.js';
import { commandsToInfo as jsCommandsToInfo } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { isSpecialFunction, processSpecialFunction } from './function-calls/processSpecialFunction.js';
import { processCommentsAndGetCommandInfo } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/function-calls/processCommentsAndGetCommandInfo.js';
import { processFunctionCallDefault } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/function-calls/processFunctionCallDefault.js';
import { processToken } from './processToken.js';
import { shouldBeRemoved } from
'../../../../../../parsing/generic-parsing-utilities/shouldBeRemoved.js';
const migrationData = await fetchJson('json/logo-migrations/CodeHeartTurtleScript.json');
const commandsToInfo = commandsToMap(true, Array.from(jsCommandsToInfo.values()), migrationData.commands);

export function processFunctionCall(token, result) {
	const info = processCommentsAndGetCommandInfo(token, result, commandsToInfo);
	if (shouldBeRemoved(info))
		return; // don't translate anything.
	if (isMakeColorCall(token)) {
		inlineListForMakeColor(token, result);
		return;
	}
	if (isSpecialFunction(token)) {
		processSpecialFunction(token, result);
		return;
	}
	processFunctionCallDefault(token, result, info, processToken);
};