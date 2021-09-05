import { ArrayUtils } from
'../../ArrayUtils.js';
import { Command } from
'../Command.js';
import { fetchJson } from
'../../fetchJson.js';
import { filterBracketsAndCommas } from
'./translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'./ParseTreeTokenType.js';
import { webLogoTypesToKojo } from
'./parsing/webLogoTypesToKojo.js';

await Command.asyncInit();
const data = await fetchJson('json/logo-migrations/kojo/migration.json');
const functions = new Map();
const properties = new Map();
const aliases = new Map();

for (const aliasInfo of data.aliases) {
	const aliasSet = new Set([aliasInfo.name]);
	aliases.set(aliasInfo.name, aliasSet);
	for (const name of aliasInfo.aliases) {
		aliasSet.add(name);
		aliases.set(name, aliasSet);
	}
}

function addInfo(map, key) {
	for (const info of data[key]) {
		let nameMatches = map.get(info.name);
		if (nameMatches === undefined) {
			nameMatches = [];
			map.set(info.name, nameMatches);
		}
		nameMatches.push(info);
		if (info.to !== undefined && info.returnTypes === undefined) {
			const commandInfo = Command.getCommandInfo(info.to);
			if (commandInfo !== undefined) {
				info.returnTypes = webLogoTypesToKojo(commandInfo.returnTypes);
			}
		}
	}
}

addInfo(functions, 'functions');
addInfo(properties, 'properties');

function getNameFromToken(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;

	const children = token.children;
	if (token.type === ParseTreeTokenType.FUNC_CALL)
		return getNameFromToken(children[0]);
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
	lastChild.type !== ParseTreeTokenType.DOT)
		return getNameFromToken(lastChild);
}

function countActualArguments(funcCallToken) {
	const argList = funcCallToken.children[1];
	if (argList !== undefined && argList.type === ParseTreeTokenType.ARG_LIST) {
		return filterBracketsAndCommas(argList.children).length;
	}
	return 0;
}

function satisfiedByNumArgs(info, numArgs) {
	const argCount = info.argCount;
	if (argCount !== undefined) {
		if (argCount.min !== undefined && argCount.min > numArgs) {
			return false;
		}
		if (argCount.max !== undefined && argCount.max < numArgs) {
			return false;
		}
	}
	else {
		if (info.args !== undefined) {
			if (info.args.length < numArgs)
				return false;

			const firstNonDefaultedArgIndex = ArrayUtils.indexOfMatch(info.args, function(argInfo) {
				return argInfo.defaultValue !== undefined;
			});
			if (firstNonDefaultedArgIndex > numArgs)
				return false;
		}
	}
	return true;
}

function getContextToken(token) {
	if (token.type === ParseTreeTokenType.FUNC_CALL)
		token = token.children[0];
	if (token.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		return token.children[0];
	}
}

function findBestMatchFor(token, map) {
	const name = getNameFromToken(token);
	const contextToken = getContextToken(token);
	if (name !== undefined) {
		let result = [];
		const result1 = map.get(name);
		if (result1 !== undefined) {
			const numArgs = countActualArguments(token);
			result = result1.filter(function(info) {
				if (info.contextRequired) {
					if (contextToken === undefined)
						return false;
					if (contextToken.type === ParseTreeTokenType.IDENTIFIER &&
					aliases.has(contextToken.val))
						return false; // matching an alias name means context is likely a class name.
							// An alias isn't an instance of a class.
				}
				if (info.class !== undefined) {
					const tokenParent = token.parentNode;
					if (tokenParent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
					tokenParent.children.indexOf(token) === 2) {
						const firstChild = tokenParent.children[0];
						if (firstChild.type === ParseTreeTokenType.IDENTIFIER &&
						firstChild.val !== info.class)
							return false;
					}
				}
				if (!satisfiedByNumArgs(info, numArgs))
					return false;

				return true;
			});
		}
		if (result.length === 0) {
			return;
		}
		if (result.length > 1) {
			const nonNullPackageMatches = result.filter(info => info.package !== null);
			if (nonNullPackageMatches.length !== 0)
				result = nonNullPackageMatches;

			if (result.length > 1 &&
			contextToken === undefined) {
				const classlessMatches = result.filter(info => info.class === undefined);
				if (classlessMatches.length !== 0)
					result = classlessMatches;
			}
		}
		return result[0];
	}
}

export class MigrationInfo {
	static hasAliasRelationship(name1, name2) {
		if (name1 === name2)
			return true;

		const matchedAliases = aliases.get(name1);
		if (matchedAliases === undefined)
			return false;
		return matchedAliases.has(name2);
	}

	static hasInfoForFunctionName(name) {
		return functions.has(name);
	}

	static getFunctionInfo(token) {
		return findBestMatchFor(token, functions);
	}

	static getPropertyInfo(token) {
		return findBestMatchFor(token, properties);
	}
};