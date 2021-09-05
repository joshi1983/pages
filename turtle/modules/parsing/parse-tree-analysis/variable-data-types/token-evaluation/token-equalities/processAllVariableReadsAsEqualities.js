import { addTokenEquality } from
'./addTokenEquality.js';
import { Command } from
'../../../../Command.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getTokenValueBasic } from
'../../getTokenValueBasic.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function first(variableReadToken, variableValueToken) {
	if (variableValueToken.type === ParseTreeTokenType.LIST) {
		for (const child of variableValueToken.children) {
			if (!child.isBracket())
				return child;
		}
	}
}

function item(variableReadToken, variableValueToken) {
	if (variableValueToken.type === ParseTreeTokenType.LIST) {
		const itemCall = variableReadToken.parentNode;
		const indexToken = itemCall.children[0];
		if (indexToken === variableReadToken)
			return;
			// for example, item :index :someList where variableReadToken corresponds with :index.
			// we're interested only if variableReadToken is the list parameter.
		
		const indexVal = getTokenValueBasic(indexToken);
		const children = variableValueToken.children;
		if (!Number.isInteger(indexVal) || children.length - 1 < indexVal)
			return; // for example, item random 3 :someList
			// or item 5 :x but :x is weirdly/invalidly a list literal of only 2 elements.
			// item 5 :x where :x has count 2 should cause some validation error message but
			// we can't do anything more with that here.
			// See parse-tree-analysis/validation for things like validateDataTypes.js and validateMinLen.js.

		let indexNumber = 0;
		for (const child of children) {
			if (!child.isBracket()) {
				indexNumber++;
				if (indexVal === indexNumber)
					return child;
			}
		}
	}
}

function last(variableReadToken, variableValueToken) {
	if (variableValueToken.type === ParseTreeTokenType.LIST) {
		const children = variableValueToken.children;
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (!child.isBracket())
				return child;
		}
	}
}

const parentGetters = new Map([
	['first', first],
	['item', item],
	['last', last]
]);

function processParent(variableRead, fromToken, result) {
	const parent = variableRead.parentNode;
	if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parent.val);
		if (info !== undefined) {
			const getter = parentGetters.get(info.primaryName);
			if (getter !== undefined) {
				const parentFromToken = getter(variableRead, fromToken);
				if (parentFromToken !== undefined) {
					addTokenEquality(parentFromToken, parent, result);
				}
			}
		}
	}
}

export function processAllVariableReadsAsEqualities(token, result, executionState) {
	if (!(result instanceof Map))
		throw new Error(`result must be a Map but found ${result}`);

	const variableReads = getDescendentsOfType(token, ParseTreeTokenType.VARIABLE_READ);
	for (const variableRead of variableReads) {
		const name = variableRead.val.toLowerCase();
		const fromToken = executionState.equateVariableToToken(name, variableRead, result);
		if (fromToken !== undefined) {
			processParent(variableRead, fromToken, result);
		}
	}
};