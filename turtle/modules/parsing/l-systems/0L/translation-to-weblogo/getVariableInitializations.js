import { Command } from
'../../../Command.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../../../LogoParser.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { Procedure } from
'../../../Procedure.js';
import { SetUtils } from
'../../../../SetUtils.js';
import { StringBuffer } from
'../../../../StringBuffer.js';
import { valueToLiteralCode } from
'../../../../valueToLiteralCode.js';
import { ZeroLProperties } from
'../ZeroLProperties.js';

const propertiesData = ZeroLProperties.getAllData().slice();
// We're not putting this in properties.json because we don't want
// any 0L code to override 'states'.  
// 'states' is used by pushState and popState procedures.
propertiesData.push({
	'primaryName': 'states',
	'to': 'states',
	'defaultValue': []
});

function isVariableReference(token) {
	if (!token.isStringLiteral() || token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const parentInfo = Command.getCommandInfo(token.parentNode.val);
	if (parentInfo === undefined ||
	parentInfo.primaryName === 'make' ||
	parentInfo.primaryName === 'localmake')
		return false;
	const argIndex = token.parentNode.children.indexOf(token);
	if (parentInfo.args.length <= argIndex)
		return false;
	return parentInfo.args[argIndex].refTypes !== undefined;
}

export function getReferencedVariables(root) {
	const variableReads = getDescendentsOfType(root, ParseTreeTokenType.VARIABLE_READ).
		filter(t => !Procedure.isParameterToken(t));
	const refs = getDescendentsOfType(root, ParseTreeTokenType.STRING_LITERAL).
		filter(isVariableReference);
	const result = new Set(variableReads.map(varRead => varRead.val.toLowerCase()));
	SetUtils.addAll(result, refs.map(ref => ref.val.toLowerCase()));
	return result;
};

export function getVariableInitializations(webLogoCode, propertyOverridesMap) {
	const parseLogger = new ParseLogger();
	const root = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (root === undefined)
		throw new Error(`Failed to parse code: ${webLogoCode}`);
	const referencedVariables = getReferencedVariables(root);
	const result = new StringBuffer();
	// loop through properties.
	for (const propertyInfo of propertiesData) {
		const variableName = propertyInfo.to;
		if (variableName !== undefined && referencedVariables.has(variableName.toLowerCase())) {
			// append a make statement to initialize it.
			let value = propertyInfo.defaultValue;
			if (propertyOverridesMap.has(variableName))
				value = propertyOverridesMap.get(variableName);
			result.append(`make "${variableName} ${valueToLiteralCode(value)}\n`);
		}
	}
	return result.toString();
};