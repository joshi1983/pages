import { getParseTokensSorted } from '../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { tokenToProcedure } from '../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';

const badIdentifierCharacters = new Set(' \t\r\n$-=()[]`!@#%^&*'.split(''));

function isInstructionListChild(token) {
	const parent = token.parentNode;
	if (parent === null)
		return false;
	if (parent.type === ParseTreeTokenType.TREE_ROOT)
		return true;
	if (isInstructionList(parent))
		return true;
	return false;
}

/*
The renameParameterizedGroupToken module is not being used because
it is for tokens of the PARAMETERIZED_GROUP type tokens.
*/
function isOfInterest(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return false;
	if (parent.children.indexOf(token) !== 0)
		return false;
	if (token.type === ParseTreeTokenType.LEAF) {
		return validateIdentifier(token.val) !== undefined;
	}
	return true;
}

function getProcNames(cachedParseTree) {
	const procStarts = cachedParseTree.getTokensByType(ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	const result = new Set();
	for (let i = 0; i < procStarts.length; i++) {
		const nameToken = procStarts[i].children[0];
		if (nameToken !== undefined && nameToken.type === ParseTreeTokenType.LEAF)
			result.add(nameToken.val.toLowerCase());
	}
	return result;
}

function removeInvalidIdentifierCharacters(s) {
	let result = '';
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (!badIdentifierCharacters.has(ch))
			result += ch;
	}
	return result;
}

function getNamePrefix(initialVal) {
	initialVal = '' + initialVal; // make sure it is a string.
	initialVal = removeInvalidIdentifierCharacters(initialVal);
	if (initialVal === '')
		initialVal = 'p';
	const ch = initialVal[0];
	if (ch >= '0' && ch <= '9')
		initialVal = 'p' + initialVal;
	
	return initialVal;
}

function getFixedName(initialVal, takenNames) {
	let newName = getNamePrefix(initialVal);
	if (!takenNames.has(newName.toLowerCase()))
		return newName;
	for (let i = 1; true; i++) {
		const name = newName + i;
		if (!takenNames.has(name.toLowerCase()))
			return name;
	}
}

function fixProcedureCallsFor(oldType, oldValue, fixedName, cachedParseTree) {
	let typeMatchedTokens;
	if (oldType === ParseTreeTokenType.NUMBER_LITERAL)
		typeMatchedTokens = cachedParseTree.getTokensByType(oldType);
	else
		typeMatchedTokens = cachedParseTree.getTokensByTypes([oldType, ParseTreeTokenType.PARAMETERIZED_GROUP]);
	const calls = typeMatchedTokens.
		filter(t => t.val === oldValue && isInstructionListChild(t));
	const proc = cachedParseTree.getProceduresMap().get(fixedName.toLowerCase());
	getParseTokensSorted(calls);
	calls.reverse();
	calls.forEach(function(callToken) {
		const previousCallType = callToken.type;
		callToken.val = fixedName;
		callToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		callToken.originalString = undefined;
		if (previousCallType !== callToken.type)
			cachedParseTree.tokenTypeChanged(callToken, previousCallType);
		cachedParseTree.tokenValueChanged(callToken, oldValue);
		// Try adding enough children for the procedure call.
		for (let i = 0; i < proc.parameters.length; i++) {
			const child = callToken.nextSibling;
			if (child === null)
				break;
			child.remove();
			callToken.appendChild(child);
		}
	});
}

export function procedureNameTypeFixer(cachedParseTree, fixLogger) {
	const procNameTokens = cachedParseTree.getTokensByTypes(
	[ParseTreeTokenType.LEAF,ParseTreeTokenType.NUMBER_LITERAL]).filter(isOfInterest);
	if (procNameTokens.length === 0)
		return;
	const existingProcNames = getProcNames(cachedParseTree);
	const procMap = cachedParseTree.getProceduresMap();
	procNameTokens.forEach(function(procNameToken) {
		const fixedName = getFixedName(procNameToken.val, existingProcNames);
		const oldType = procNameToken.type;
		const oldValue = procNameToken.val;
		procNameToken.originalString = undefined;
		existingProcNames.add(fixedName.toLowerCase());
		procNameToken.type = ParseTreeTokenType.LEAF;
		procNameToken.val = fixedName;
		let proc = procMap.get(('' + oldValue).toLowerCase());
		if (proc === undefined) {
			proc = tokenToProcedure(procNameToken.parentNode);
		}
		else {
			procMap.delete(('' + oldValue).toLowerCase());
			proc.name = fixedName;
		}
		cachedParseTree.procedureAdded(proc);
		fixProcedureCallsFor(oldType, oldValue, fixedName, cachedParseTree);
		if (oldType !== procNameToken.type)
			cachedParseTree.tokenTypeChanged(procNameToken, oldType);
		cachedParseTree.tokenValueChanged(procNameToken, oldValue);
		fixLogger.log(`Renamed ${oldValue} to ${fixedName} because WebLogo's procedure names must start with a letter or underscore`, procNameToken);
	});
};