import { fetchJson } from '../../../fetchJson.js';
import { fetchText } from '../../../fetchText.js';
import { filterBracketsAndCommas } from './type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfTypes } from
'../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { methodCallTokenToClassName } from
'./type-processors/method-calls/methodCallTokenToClassName.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { ProcessingMethod } from '../ProcessingMethod.js';

const methodsData = await fetchJson('json/logo-migrations/processing/methods.json');
const toProcs = methodsData.filter(c => c.toProc !== undefined).map(c => c.toProc);
for (const opInfo of Operators.getAll())
	if (opInfo.toProc !== undefined)
		toProcs.push(opInfo.toProc);
const procsMap = new Map();
for (let i = 0; i < toProcs.length; i++) {
	const p = toProcs[i];
	const url = `logo-scripts/processing-content/${p}.lgo`;
	procsMap.set(p, await fetchText(url));
}

function getProcNameOfInterest(token) {
	if (token.type === ParseTreeTokenType.METHOD_CALL) {
		const args = token.children[1];
		let argCount = 0;
		if (args !== undefined)
			argCount = filterBracketsAndCommas(args.children).length;
		let className = methodCallTokenToClassName(token);
		const info = ProcessingMethod.getMethodInfo(token.val, className, argCount);
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

function isOfInterest(token) {
	return getProcNameOfInterest(token) !== undefined;
}

export function includeAllReferencedProcedures(root, result) {
	const toProcs = getDescendentsOfTypes(root, [
		ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.METHOD_CALL,
		ParseTreeTokenType.UNARY_OPERATOR
	]).filter(isOfInterest);
	toProcs.forEach(function(toProcToken) {
		const toProcName = getProcNameOfInterest(toProcToken);
		result.append(procsMap.get(toProcName));
		result.append('\n\n');
	});
};