import { fetchJson } from
'../../../modules/fetchJson.js';
import { ParseTreeTokenType } from
'./ParseTreeTokenType.js';

const data = await fetchJson('json/logo-migrations/pitrified-go-turtle/migration.json');
const constants = new Map();
const functions = new Map();
const properties = new Map();
const keys = ['constants', 'functions', 'properties'];

function processPackageAliases() {
	const aliases = new Map();
	for (const alias of data.packageAliases) {
		aliases.set(alias.name, alias.url);
	}
	for (const key of keys) {
		const elements = data[key];
		for (const info of elements) {
			if (info.package !== null &&
			info.package[0] === '@') {
				const alias = info.package.substring(1);
				const to = aliases.get(alias);
				if (to !== undefined)
					info.package = to;
			}
		}
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
	}
}

processPackageAliases();
addInfo(constants, 'constants');
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
	if (token.type === ParseTreeTokenType.DOT_PROPERTY)
		return getNameFromToken(lastChild);
}

function findBestMatchFor(token, map, settings) {
	if (!(map instanceof Map))
		throw new Error(`map must be a Map but found ${map}`);

	let result = [];
	const name = getNameFromToken(token);
	if (name !== undefined) {
		const result1 = map.get(name);
		if (result1 !== undefined) {
			result = result1.filter(function(info) {
				if (info.package === null)
					return true;

				return settings.imports.has(info.package)
			});
		}
	}
	if (result.length === 0) {
		return;
	}
	if (result.length > 1) {
		const nonNullPackageMatches = result.filter(info => info.package !== null);
		if (nonNullPackageMatches.length !== 0)
			result = nonNullPackageMatches;
	}
	return result[0];
}

export function getPackageAliases(aliasesArray) {
	const result = new Map();
	if (aliasesArray !== undefined) {
		for (const info of aliasesArray) {
			result.set(info.name, info.url);
		}
	}
	return result;
}

export class MigrationInfo {
	static getConstantInfo(token, settings) {
		return findBestMatchFor(token, constants, settings);
	}

	static getFunctionInfo(token, settings) {
		return findBestMatchFor(token, functions, settings);
	}
	
	static getPropertyInfo(token, settings) {
		return findBestMatchFor(token, properties, settings);
	}
};