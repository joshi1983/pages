import { Colour } from '../../../../../Colour.js';
await Colour.asyncInit();

export function fixCodeheartTurtleScriptColorNameForWebLogoVariable(varName) {
	if (Colour.getColourInfoByName(varName) !== undefined) {
		return varName + 'COLOR';
	}
	else
		return varName;
}