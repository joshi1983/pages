import { getTokenTypesBasic } from
'../../getTokenTypesBasic.js';

function makeToVariableName(make) {
	const firstChild = make.children[0];
	if (!firstChild.isStringLiteral())
		return;

	const variableName = firstChild.val.toLowerCase();
	return variableName;
}

export function mightBeMutated(types) {
	if (types === undefined)
		return true; // undefined means any type.

	if (types === null)
		return false; // null means empty... no type, no value.
		// It is a weird case but maybe the code was make "x forward 3
		// No value excludes list and plist.

	for (const type of types.types) {
		if (type.name.indexOf('list') !== -1 ||
		type.name === 'color' ||
		type.name === 'alphacolor')
			return true;
	}
	return false;
};

function isDefinitelyLocal(variableName, token, cachedParseTree) {
	const proc = cachedParseTree.getProcedureAtToken(token);
	if (proc === undefined)
		return false;
	if (proc.parameters.indexOf(variableName) !== -1)
		return true;

	return false;
}

function isOfInterest(cachedParseTree) {
	return function(call) {
		if (call.children.length !== 2)
			return false;

		const variableName = makeToVariableName(call);
		
		if (isDefinitelyLocal(variableName, call, cachedParseTree))
			return false;

		return true;
	};
}

export function getUnmutatableGlobalVariables(cachedParseTree) {
	const makeCalls = cachedParseTree.getCommandCallsByName('make').filter(isOfInterest(cachedParseTree));
	const swapCalls = cachedParseTree.getCommandCallsByName('swap').filter(c => c.children.length === 2);
	const nameToIsMutatable = new Map();
	swapCalls.forEach(function(swapCall) {
		for (const child of swapCall.children) {
			if (child.isStringLiteral()) {
				const variableName = child.val.toLowerCase();
				if (!isDefinitelyLocal(variableName, child, cachedParseTree))
					nameToIsMutatable.set(variableName, true);
			}
		}
	});
	makeCalls.forEach(function(makeCall) {
		const variableName = makeToVariableName(makeCall);
		if (nameToIsMutatable.get(variableName) === true)
			return;

		const valueToken = makeCall.children[1];
		const valueTypes = getTokenTypesBasic(valueToken, false);
		nameToIsMutatable.set(variableName, mightBeMutated(valueTypes));
	});
	const result = new Set();
	for (const [key, value] of nameToIsMutatable) {
		if (!value)
			result.add(key);
	}
	return result;
};