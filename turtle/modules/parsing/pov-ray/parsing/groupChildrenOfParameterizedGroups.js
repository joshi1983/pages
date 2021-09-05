import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PovRayCommand } from '../PovRayCommand.js';

function isOfInterest(token) {
	const commandInfo = PovRayCommand.getCommandInfo(token.val);
	if (commandInfo !== undefined) {
		if (commandInfo.args !== undefined && commandInfo.args.length !== 0)
			return true;
	}
	return false;
}

/*
This is similar to modules/parsing/createParameterizedGroups.js but for POV-ray parsing.
*/
export function groupChildrenOfParameterizedGroups(root) {
	const groups = getDescendentsOfType(root, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	getParseTokensSorted(groups);
	for (let i = groups.length - 1; i >= 0; i--) {
		const group = groups[i];
		const info = PovRayCommand.getCommandInfo(group.val);
		const numArgs = info.args.length;
		while (group.children.length < numArgs) {
			let tok = group.getNextSibling();
			if (tok === null)
				break;
			group.appendChild(tok);
		}
	}
};