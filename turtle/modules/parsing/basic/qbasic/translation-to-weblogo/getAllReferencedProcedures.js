import { fetchText } from '../../../../fetchText.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../../LogoParser.js';
import { ParseLogger } from '../../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { Procedure } from '../../../Procedure.js';
import { QBasicProcedures } from '../QBasicProcedures.js';
import { SetUtils } from '../../../../SetUtils.js';
import { StringBuffer } from '../../../../StringBuffer.js';

const procsMap = new Map();
const dependenciesMap = new Map();
const toProcPath = 'logo-scripts/qbasic';
function filenameToProcedureName(procFileName) {
	const index = procFileName.lastIndexOf('.');
	return procFileName.substring(0, index);
}

const procNames = QBasicProcedures.map(filenameToProcedureName);
for (const name of QBasicProcedures) {
	const url = toProcPath + `/${name}`;
	const procName = filenameToProcedureName(name);
	procsMap.set(procName.toLowerCase(), await fetchText(url));
}

function getProcNamesUsedIn(code) {
	const parseLogger = new ParseLogger();
	return getProcNamesUsedInTree(LogoParser.getParseTree(code, parseLogger));
}

function getProcNamesUsedInTree(tree) {
	const leafs = getDescendentsOfType(tree, ParseTreeTokenType.LEAF).filter(isOfInterest);
	return new Set(leafs.map(t => t.val.toLowerCase()));
}

function getOrInitializeDependenciesFor(procName) {
	procName = procName.toLowerCase();
	let result;
	if (!dependenciesMap.has(procName)) {
		result = new Set();
		dependenciesMap.set(procName, result);
	}
	else
		result = dependenciesMap.get(procName);
	return result;
}

for (const name of procNames) {
	const procedureCode = procsMap.get(name.toLowerCase());
	let continueLooping;
	const dependencies = getOrInitializeDependenciesFor(name);
	do {
		continueLooping = false;
		for (const name2 of getProcNamesUsedIn(procedureCode)) {
			if (!dependencies.has(name2)) {
				dependencies.add(name2);
				continueLooping = true;
			}
		}
	} while (continueLooping);
}

function isOfInterest(token) {
	if (Procedure.isNameToken(token))
		return false;
	return procsMap.has(token.val.toLowerCase());
}

export function getAllReferencedProcedures(tree) {
	const nameSet = getProcNamesUsedInTree(tree);
	for (const name of Array.from(nameSet)) {
		const dependentNames = dependenciesMap.get(name.toLowerCase());
		if (dependentNames !== undefined) {
			SetUtils.addAll(nameSet, dependentNames);
		}
	}
	const namesArray = Array.from(nameSet);
	const result = new StringBuffer();
	namesArray.sort();
	namesArray.forEach(function(name) {
		result.append(procsMap.get(name) + '\n');
	});
	return result.toString();
};