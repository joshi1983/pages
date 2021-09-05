import { isValidIdentifier } from
'../../js-parsing/scanning/isValidIdentifier.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { predefined } from
'../../js-parsing/parsing/parse-tree-analysis/validation/validating-modules/undefined-identifiers/predefined.js';
import { ReservedWord } from
'../../js-parsing/ReservedWord.js';
import { specialValues } from
'../../js-parsing/scanTokenToParseTreeToken.js';
import { webLogoIdentifierToJavaScriptIdentifier } from
'../../js-parsing/translation-to-weblogo/type-processors/helpers/webLogoIdentifierToJavaScriptIdentifier.js';

const reservedWordSet = new Set(ReservedWord.getAllReservedWords());

function isMakeAssignment(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.val !== 'make' &&
	token.val !== 'localmake')
		return false;

	return true;
}

function getVariableReferences(cachedParseTree) {
	const stringLiterals = cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.STRING_LITERAL
	]).filter(t => t.parentNode.children.indexOf(t) === 0 && isMakeAssignment(t.parentNode));
	return stringLiterals;
}

function isUnsafeForTranslation(name) {
	if (!isValidIdentifier(name))
		return false;
	if (predefined.has(name) ||
	reservedWordSet.has(name) ||
	specialValues.has(name))
		return true;

	return false;
}

function getNamesToChange(cachedParseTree) {
	const unsafeNames = new Set();
	const allNames = new Set();
	const procsMap = cachedParseTree.getProceduresMap();
	for (const name of procsMap.keys()) {
		if (isUnsafeForTranslation(name))
			unsafeNames.add(name);
		allNames.add(name);
	}
	for (const variableRead of cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ)) {
		const name = variableRead.val;
		if (isUnsafeForTranslation(name))
			unsafeNames.add(name);
		allNames.add(name);
	}
	const variableReferences = getVariableReferences(cachedParseTree);
	for (const variableRef of variableReferences) {
		const name = variableRef.val;
		if (isUnsafeForTranslation(name))
			unsafeNames.add(name);
		allNames.add(name);
	}
	return [unsafeNames, allNames];
}

function unsafeToSafeName(unsafe, restrictedNames) {
	// remove invalid characters.
	unsafe = webLogoIdentifierToJavaScriptIdentifier(unsafe);
	for (let i = 1; true; i++) {
		const name = unsafe + i;
		if (!isUnsafeForTranslation(name) &&
		!restrictedNames.has(name))
			return name;
	}
}

function rename(cachedParseTree, from, toName) {
	const procsMap = cachedParseTree.getProceduresMap();
	const proc = procsMap.get(from);
	if (proc !== undefined) {
		proc.name = toName;
		const nameToken = proc.getNameToken();
		nameToken.val = toName;
		const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
			filter(t => t.val === toName);
		for (const call of calls) {
			call.val = toName;
		}
	}
	const varReads = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
		filter(t => t.val === from);
	for (const varRead of varReads) {
		varRead.val = toName;
	}
	const variableReferences = getVariableReferences(cachedParseTree);
	for (const varRef of variableReferences) {
		varRef.val = toName;
	}
}

export function renameToAvoidTranslationNameClashes(cachedParseTree, fixLogger) {
	const [unsafeNames, allNames] = getNamesToChange(cachedParseTree);
	const restricted = new Set(Array.from(allNames));
	for (const unsafe of unsafeNames) {
		const newName = unsafeToSafeName(cachedParseTree, restricted);
		rename(cachedParseTree, unsafe, newName);
		restricted.add(newName);
	}
};