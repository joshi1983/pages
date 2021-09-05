import { Colour } from '../../../../Colour.js';
import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

await Colour.asyncInit();

function isLikelyColourName(token, propertyNameToken, settings) {
	if (Colour.getColourInfoByName(propertyNameToken.val) === undefined)
		return false;

	let goTurtleImported = settings.imports.has("github.com/Pitrified/go-turtle");
	if (!goTurtleImported) {
		// look for an import containing /go-turtle because that is similar enough.
		// Maybe another github account forked Pitrified's repo.
		for (const url of settings.imports) {
			if (url.indexOf('/go-turtle') !== -1) {
				goTurtleImported = true;
				break;
			}
		}
	}
	return goTurtleImported;
}

export function processExpressionDotProperty(token, result, settings) {
	const propertyNameToken = token.children[2];
	if (isLikelyColourName(token, propertyNameToken, settings)) {
		result.append(` "${propertyNameToken.val} `);
		return;
	}
	const info = MigrationInfo.getConstantInfo(token, settings);
	if (info === undefined) {
		if (propertyNameToken !== undefined && propertyNameToken.type === ParseTreeTokenType.IDENTIFIER) {
			const propertyInfo = MigrationInfo.getPropertyInfo(propertyNameToken, settings);
			if (propertyInfo !== undefined && propertyInfo.to !== undefined) {
				result.append(` ${propertyInfo.to} `);
				return;
			}
			else {
				if (token.children[0].type === ParseTreeTokenType.IDENTIFIER)
					result.append(`getProperty "${token.children[0].val} "${token.children[2].val}`);
				else {
					result.append(`getProperty2 `);
					processToken(token.children[0], result, settings);
					result.append(` :${token.children[2].val} `);
				}
				return;
			}
		}
		const roughName = getRoughNameFrom(token);
		if (typeof roughName === 'string')
			result.append(roughName);
	}
	else {
		if (info.migrateToCode !== undefined)
			result.append(info.migrateToCode);
		else if (info.to !== undefined)
			result.append(info.to);
		else if (info.toProc !== undefined)
			result.append(info.toProc);
	}
};