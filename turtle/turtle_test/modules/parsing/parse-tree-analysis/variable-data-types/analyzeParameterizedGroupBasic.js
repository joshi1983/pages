import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getTokenTypesBasic } from './getTokenTypesBasic.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processRequiredTypes } from './processRequiredTypes.js';

export function analyzeParameterizedGroupBasic(token, cachedParseTree, variables, containingProc) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined) {
		const proc = cachedParseTree.getProceduresMap().get(token.val.toLowerCase());
		if (proc !== undefined) {
			for (let paramIndex = Math.min(token.children.length, proc.parameters.length) - 1; paramIndex >= 0; paramIndex--) {
				const child = token.children[paramIndex];
				const types = getTokenTypesBasic(child, true, {
					'procedures': cachedParseTree.getProceduresMap()
				});
				if (types !== undefined) {
					const paramVar = variables.getVariableByName(proc.parameters[paramIndex]);
					const paramScope = paramVar.getFirstScopeInProcedure(proc);
					paramScope.assignedTypes.addTypes(types);
				}
			}
		}
	}
	else {
		for (let paramIndex = token.children.length - 1; paramIndex >= 0; paramIndex--) {
			const child = token.children[paramIndex];
			if (child.isStringLiteral() && Command.getParameterRefTypes(info, paramIndex) !== undefined) {
				const requiredTypes = Command.getParameterRefTypes(info, paramIndex);
				processRequiredTypes(child, requiredTypes, variables, containingProc);
			}
			else {
				const requiredTypes = new DataTypes(Command.getParameterTypes(info, paramIndex));
				if (requiredTypes !== undefined && child.type === ParseTreeTokenType.VARIABLE_READ) {
					const variable = variables.getVariableByName(child.val.toLowerCase());
					if (variable !== undefined) {
						const varScopes = variable.getScopesAt(child, containingProc);
						for (let i = 0; i < varScopes.length; i++) {
							const scope = varScopes[i];
							const conditionalRange = scope.getConditionalRangeAt(token);
							if (conditionalRange === undefined)
								scope.requiredTypes.intersectWith(requiredTypes);
							else {
								// FIXME: should we maintain requiredTypes on a conditional range?
							}
						}
					}
				}
			}
		}
	}
};