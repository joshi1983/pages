import { CodeheartTurtleScriptColor } from './CodeheartTurtleScriptColor.js';
import { fixCodeheartTurtleScriptColorNameForWebLogoVariable } from './fixCodeheartTurtleScriptColorNameForWebLogoVariable.js';
import { getColourNameReferencesFromParseTree } from './getColourNameReferencesFromParseTree.js';

export function addColourDeclarations(rootToken, result) {
	const colours = getColourNameReferencesFromParseTree(rootToken);
	for (let colourName of colours) {
		const varName = fixCodeheartTurtleScriptColorNameForWebLogoVariable(colourName);
		result.append(`make "${varName} "${CodeheartTurtleScriptColor.nameToHex(colourName)}\n`);
	}
};