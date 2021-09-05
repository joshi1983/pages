import { Command } from '../../Command.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../LogoParser.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { pathCommandNames } from
'../../parse-tree-analysis/pathCommandNames.js';
import { SetUtils } from
'../../../SetUtils.js';

const interestingNames = new Set(pathCommandNames.map(n => n.toLowerCase()));
SetUtils.addAll(interestingNames, ['closepath', 'polystart', 'polyend']);

function isOfInterest(token) {
	return interestingNames.has(token.val.toLowerCase());
}

export function needsInitialPenColor(webLogoCode) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (tree === undefined)
		return false;
	for (const child of tree.children) {
		if (child.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(child.val);
			if (info === undefined)
				break;
			if (info.primaryName === 'setPenColor')
				return false;
			if (isOfInterest(child))
				return true;
		}
		else
			break;
	}
	return getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP).some(isOfInterest);
};