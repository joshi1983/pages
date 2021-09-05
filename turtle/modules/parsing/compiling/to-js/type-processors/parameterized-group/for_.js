import { filterBrackets } from
'../helpers/filterBrackets.js';
import { getTokenValueBasic } from
'../../../../parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isNumber } from
'../../../../../isNumber.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';

function getForSettingsChildToken(settings, indexToFind) {
	const children = settings.children;
	let index = 0;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (!child.isBracket()) {
			if (index === indexToFind)
				return child;
			index++;
		}
	}
}

function getVariableName(settings) {
	const child = getForSettingsChildToken(settings, 0);
	if (child !== undefined &&
	child.isStringLiteral()) {
		return child.val;
	}
}

function getInitialValue(settings) {
	const initToken = getForSettingsChildToken(settings, 1);
	return getTokenValueBasic(initToken);
}

function getFinalValue(settings) {
	const finalToken = getForSettingsChildToken(settings, 2);
	return getTokenValueBasic(finalToken);
}

function getStepToken(settings) {
	const child = getForSettingsChildToken(settings, 3);
	return child;
}

function getStepValue(settings) {
	const stepToken = getStepToken(settings);
	if (stepToken === undefined) {
		// if final value is less than initial value, return -1.
		const initVal = getInitialValue(settings);
		if (isNumber(initVal)) {
			const finalVal = getFinalValue(settings);
			if (isNumber(finalVal) && finalVal < initVal)
				return -1;
		}
		
		return 1;
	}
	else {
		const val = getTokenValueBasic(stepToken);
		return val;
	}
}

export function for_(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const settingsToken = children[0];
	const variableName = getVariableName(settingsToken);
	if (typeof variableName === 'string') {
		const instructionsToken = children[1];
		const stepToken = getStepToken(settingsToken);
		const stepValue = getStepValue(settingsToken);
		result.append(`\nfor (${variableName} = `);
		const initToken = getForSettingsChildToken(settingsToken, 1);
		processToken(initToken, result);
		result.append(';');
		result.append(`${variableName} `);
		if (stepValue > 0)
			result.append(' <= ');
		else
			result.append(' >= ');

		const finalToken = getForSettingsChildToken(settingsToken, 2);
		processToken(finalToken, result);
		result.append(';');
		result.append(`${variableName}`);
		if (stepValue === 1)
			result.append('++');
		else if (stepValue === -1)
			result.append('--');
		else {
			result.append('+= ');
			processToken(stepToken, result, options);
		}
		result.append(') {\n');
		if (instructionsToken !== undefined) {
			processTokens(filterBrackets(instructionsToken.children), result, options);
		}
		result.append('\n}\n');
	}
};