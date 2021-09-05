import { getDescendentsOfType } from '../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from '../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { getProcedureStartToken } from '../../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { LogoParser } from '../../../../../parsing/LogoParser.js';
import { ParseLogger } from '../../../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../../parsing/Procedure.js';

function compareByFrom(interval1, interval2) {
	return interval1.from - interval2.from;
}

function getLineRange(procedure) {
	const startToken = procedure.getStartToken();
	const endToken = procedure.getEndToken();
	return {
		'from': startToken.lineIndex,
		'to': endToken.lineIndex
	};
}

function startTokenToProcedureName(startToken) {
	if (startToken.children.length < 1 ||
	startToken.children[0].type !== ParseTreeTokenType.LEAF)
		return;
	return startToken.children[0].val.toLowerCase();
}

function getProceduresCalledFromLeafs(tree) {
	return new Set(getDescendentsOfType(tree, ParseTreeTokenType.LEAF).filter(token => !Procedure.isNameToken(token)).
		map(leaf => leaf.val.toLowerCase()));
}

export function getUncalledProceduresFromCode(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return []; // no procedures found because parsing failed.
	else {
		const proceduresMap = getProceduresMap(tree);
		const procNames = new Set(proceduresMap.keys());
		const leafNames = getProceduresCalledFromLeafs(tree);
		const procCallTokens = getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP).
			filter(callToken => procNames.has(callToken.val.toLowerCase()));
		const procedureCalls = new Map();
		const requiredProcedureNames = new Set(leafNames);
		for (let i = 0; i < procCallTokens.length; i++) {
			const token = procCallTokens[i];
			const procStartToken = getProcedureStartToken(token);
			if (procStartToken === undefined)
				requiredProcedureNames.add(token.val.toLowerCase());
				// all procedures called globally are required.
			else  {
				const name = startTokenToProcedureName(procStartToken);
				// if procedure isn't calling itself
				if (typeof name === 'string' && (name !== token.val.toLowerCase())) {
					if (!procedureCalls.has(name))
						procedureCalls.set(name, new Set());
					procedureCalls.get(name).add(token.val.toLowerCase());
				}
			}
		}
		let newlyRequiredProcedureNames = requiredProcedureNames;
		do {
			const newlyRequiredProcedureNames2 = newlyRequiredProcedureNames;
			newlyRequiredProcedureNames = new Set();
			for (let fromProcName of newlyRequiredProcedureNames2) {
				if (procedureCalls.has(fromProcName))
					for (let toProcName of procedureCalls.get(fromProcName)) {
						if (!requiredProcedureNames.has(toProcName)) {
							requiredProcedureNames.add(toProcName);
							newlyRequiredProcedureNames.add(toProcName);
						}
					}
			}
		} while (newlyRequiredProcedureNames.size !== 0);
		const result = Array.from(proceduresMap.keys()).
			filter(name => !requiredProcedureNames.has(name)).
			map(name => getLineRange(proceduresMap.get(name)));
		result.sort(compareByFrom);
		return result;
	}
};