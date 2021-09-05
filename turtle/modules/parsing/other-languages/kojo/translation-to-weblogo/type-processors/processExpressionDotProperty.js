import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processIdentifier, shouldBeTranslatedToStringLiteral } from
'./processIdentifier.js';
import { processToken } from
'./processToken.js';

export function processExpressionDotProperty(token, result, settings) {
	const propertyNameToken = token.children[2];
	if (shouldBeTranslatedToStringLiteral(propertyNameToken)) {
		processIdentifier(propertyNameToken, result, settings);
		return;
	}
	const propertyInfo = MigrationInfo.getPropertyInfo(token);
	if (propertyInfo !== undefined) {
		if (propertyInfo.to !== undefined) {
			result.append(' ' + propertyInfo.to + ' ');
			return;
		}
		else if (propertyInfo.migrateToCode !== undefined) {
			result.append(' ' + propertyInfo.migrateToCode + ' ');
			return;
		}
	}
	const info = undefined;
	if (info === undefined) {
		if (propertyNameToken !== undefined && propertyNameToken.type === ParseTreeTokenType.IDENTIFIER) {
			if (token.children[0].type === ParseTreeTokenType.IDENTIFIER)
				result.append(`getProperty "${token.children[0].val} "${token.children[2].val}`);
			else {
				result.append(`getProperty2 `);
				processToken(token.children[0], result, settings);
				result.append(` :${token.children[2].val} `);
			}
			return;
		}
		const roughName = getRoughNameFrom(token);
		if (typeof roughName === 'string')
			result.append(roughName);
	}
};