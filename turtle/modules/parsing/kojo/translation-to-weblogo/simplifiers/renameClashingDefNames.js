import { Command } from
'../../../Command.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../SetUtils.js';

function defToName(def) {
	const nameToken = defToNameToken(def);
	if (nameToken !== undefined)
		return nameToken.val;
}

function defToNameToken(def) {
	if (def.children.length === 0)
		return;
	let firstChild = def.children[0];
	if (firstChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		firstChild = firstChild.children[0];
		if (firstChild === undefined)
			return;
	}
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild;
}

function isOfInterest(token) {
	const name = defToName(token);
	if (name === undefined)
		return false;
	return Command.getCommandInfo(name) !== undefined;
}

function classToName(classToken) {
	const firstChild = classToken.children[0];
	if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	return firstChild.val;
}

function getVariableNames(root) {
	const varVals = getDescendentsOfTypes(root, [ParseTreeTokenType.VAL, ParseTreeTokenType.VAR]);
	const result = new Set();
	for (const token of varVals) {
		for (const child of token.children) {
			if (child.type === ParseTreeTokenType.IDENTIFIER) {
				result.add(child.val);
			}
			else if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
				const firstChild = child.children[0];
				if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.IDENTIFIER)
					result.add(firstChild.val);
			}
		}
	}
	return result;
}

function getParameterNames(root) {
	const ids = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(id => id.parentNode !== null &&
			id.parentNode.type === ParseTreeTokenType.ARG_LIST &&
			id.children.length !== 0 &&
			id.parentNode.parentNode !== null &&
			id.parentNode.parentNode.type === ParseTreeTokenType.DEF);
	return new Set(ids.map(id => id.val));
}

function getDistinctName(oldName, namesToAvoid) {
	for (let i = 0; true; i++) {
		const newName = oldName + i;
		if (!namesToAvoid.has(newName) &&
		Command.getCommandInfo(newName) === undefined &&
		!MigrationInfo.hasInfoForFunctionName(newName)) {
			return newName;
		}
	}
}

function mightBeFunctionNameReference(identifierToken) {
	const parent = identifierToken.parentNode;
	if (parent.type === ParseTreeTokenType.FUNC_CALL)
		return true;
	return false;
}

function getFunctionCallsAndReferencesFor(identifiers, name) {
	identifiers = identifiers.filter(id => id.val === name);
	return identifiers;
}

export function renameClashingDefNames(root) {
	const allDefs = getDescendentsOfType(root, ParseTreeTokenType.DEF).filter(d => defToName(d) !== undefined);
	const funcRefIdentifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).filter(mightBeFunctionNameReference);
	const defs = allDefs.filter(isOfInterest);
	const classes = getDescendentsOfType(root, ParseTreeTokenType.CLASS).filter(c => classToName(c) !== undefined);

	// avoid renaming to a name that might be confused with a name of a variable, parameter, class...
	const namesToAvoid = new Set(allDefs.map(defToName));
	SetUtils.addAll(namesToAvoid, classes.map(classToName));
	SetUtils.addAll(namesToAvoid, getVariableNames(root));
	SetUtils.addAll(namesToAvoid, getParameterNames(root));
	defs.forEach(function(def) {
		const oldName = defToName(def);
		const newName = getDistinctName(oldName, namesToAvoid);
		const nameToken = defToNameToken(def);
		nameToken.val = newName;
		const referencingIdentifiers = getFunctionCallsAndReferencesFor(funcRefIdentifiers, oldName);
		for (const refIdentifier of referencingIdentifiers) {
			refIdentifier.val = newName;
		}
	});
	return defs.length !== 0;
};