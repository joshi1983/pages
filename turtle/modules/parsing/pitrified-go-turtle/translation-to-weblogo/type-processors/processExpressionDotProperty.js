import { getRoughNameFrom } from
'./helpers/getRoughNameFrom.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function processExpressionDotProperty(token, result, settings) {
	const info = MigrationInfo.getConstantInfo(token, settings);
	if (info === undefined) {
		const propertyNameToken = token.children[2];
		if (propertyNameToken !== undefined && propertyNameToken.type === ParseTreeTokenType.IDENTIFIER) {
			const propertyInfo = MigrationInfo.getPropertyInfo(propertyNameToken, settings);
			if (propertyInfo !== undefined && propertyInfo.to !== undefined) {
				result.append(` ${propertyInfo.to} `);
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