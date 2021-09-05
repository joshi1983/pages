import { fetchJson } from '../../../fetchJson.js';
import { fetchText } from '../../../fetchText.js';
import { filterBracketsAndCommas } from './type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { LogoParser } from
'../../LogoParser.js';
import { methodCallTokenToArgTypes } from
'./type-processors/method-calls/methodCallTokenToArgTypes.js';
import { methodCallTokenToClassName } from
'./type-processors/method-calls/methodCallTokenToClassName.js';
import { Operators } from '../Operators.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { ParseTreeTokenType as WebLogoParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Procedure as WebLogoProcedure } from '../../Procedure.js';
import { ProcessingMethod } from '../ProcessingMethod.js';

const methodsData = await fetchJson('json/logo-migrations/processing/methods.json');
const toProcs = methodsData.filter(c => c.toProc !== undefined).map(c => c.toProc);
for (const opInfo of Operators.getAll())
	if (opInfo.toProc !== undefined)
		toProcs.push(opInfo.toProc);

toProcs.push('pHexDigitToBinary', 'pHexDigitToInt', 'pIntToHexDigit');
const dependencyMap = new Map();
const procsMap = new Map();
for (let i = 0; i < toProcs.length; i++) {
	const p = toProcs[i];
	const url = `logo-scripts/processing-content/${p}.lgo`;
	procsMap.set(p, await fetchText(url));
}
// initialize dependencyMap.
for (const [key, content] of procsMap.entries()) {
	const parseLogger = new ParseLogger();
	const proceduresMap = new Map();
	const root = LogoParser.getParseTree(content, parseLogger, proceduresMap);
	const leafs = getDescendentsOfType(root, WebLogoParseTreeTokenType.LEAF).
		filter(leafToken => !WebLogoProcedure.isNameToken(leafToken) && procsMap.has(leafToken.val));
	if (leafs.length !== 0) {
		const leafVals = leafs.map(leaf => leaf.val);
		dependencyMap.set(key, leafVals);
	}
}

// perform transitive closure on dependencyMap.
let isTransitiveClosureComplete = false;
while (!isTransitiveClosureComplete) {
	isTransitiveClosureComplete = true;
	for (const [key, dependencies] of dependencyMap) {
		for (const dependency of dependencies) {
			const transitiveDependencies = dependencyMap.get(dependency);
			if (transitiveDependencies !== undefined) {
				for (const transitiveDependency of transitiveDependencies) {
					if (dependencies.indexOf(transitiveDependency) === -1) {
						isTransitiveClosureComplete = false;
						dependencies.push(transitiveDependency);
					}
				}
			}
		}
	}
}

export { dependencyMap, procsMap };

function getProcNameOfInterest(cachedParseTree, token) {
	if (token.type === ParseTreeTokenType.METHOD_CALL) {
		const args = token.children[1];
		let argCount = 0;
		if (args !== undefined)
			argCount = filterBracketsAndCommas(args.children).length;
		let className = methodCallTokenToClassName(token);
		const methodNameToken = token.children[0];
		const argTypes = methodCallTokenToArgTypes(token, cachedParseTree);
		const info = ProcessingMethod.getMethodInfo(methodNameToken.val, className, argCount, argTypes);
		if (info === undefined)
			return;
		return info.toProc;
	}
	else if (token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.UNARY_OPERATOR) {
		const info = Operators.getOperatorInfo(token.val);
		if (info === undefined)
			return;
		return info.toProc;
	}
}

function isOfInterest(cachedParseTree) {
	return function(token) {
		return getProcNameOfInterest(cachedParseTree, token) !== undefined;
	};
}

export function includeAllReferencedProcedures(cachedParseTree, root, result) {
	const toProcs = getDescendentsOfTypes(root, [
		ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.METHOD_CALL,
		ParseTreeTokenType.UNARY_OPERATOR
	]).filter(isOfInterest(cachedParseTree));
	const added = new Set();
	function addProcedure(name) {
		if (added.has(name))
			return; // already added.
		added.add(name);
		if (dependencyMap.has(name)) {
			for (const dependencyName of dependencyMap.get(name))
				addProcedure(dependencyName);
		}
		result.append(procsMap.get(name));
		result.append('\n\n');
	}
	toProcs.forEach(function(toProcToken) {
		const toProcName = getProcNameOfInterest(cachedParseTree, toProcToken);
		addProcedure(toProcName);
	});
};