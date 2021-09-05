import { CommandsToJS } from
'../CommandsToJS.js';
import { processSpecialParameterizedGroup } from
'./parameterized-group/processSpecialParameterizedGroup.js';
import { processToken } from
'./processToken.js';

export function processParameterizedGroup(token, result, options) {
	if (processSpecialParameterizedGroup(token, result, options))
		return;

	const children = token.children;
	const info = CommandsToJS.getCommandInfo(token.val);
	const needsExtraBrackets = info !== undefined && info.after !== undefined;
	if (info !== undefined) {
		if (info.migrateToCode !== undefined) {
			result.append(info.migrateToCode);
			return;
		}
		if (info.returnTypes === null)
			result.append('\n');
		if (info.to !== undefined) {
			if (needsExtraBrackets)
				result.append('(');

			result.append(info.to);
		}
		else if (info.toOperator !== undefined) {
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (i !== 0)
					result.append(` ${info.toOperator} `);
				result.append('(');
				processToken(child, result, options);
				result.append(')');
			}
			return;
		}
		else if (info.toUnaryOperator !== undefined) {
			result.append('(' + info.toUnaryOperator);
			processToken(children[0], result, options);
			result.append(')');
			return;
		}
		else if (info.after !== undefined) {
			result.append('((');
			processToken(children[0], result, options);
			result.append(')');
			result.append(info.after);
			result.append(')');
			return;
		}
		else
			result.append(token.val);
	}
	else
		result.append(token.val);

	result.append('(');
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		let needArgBrackets = false;
		if (info !== undefined &&
		info.args !== undefined) {
			const argInfo = info.args[i];
			if (argInfo.prefix !== undefined) {
				result.append(argInfo.prefix);
				needArgBrackets = true;
			}
		}
		if (i !== 0) {
			result.append(', ');
		}
		if (needArgBrackets)
			result.append('(');

		processToken(child, result, options);

		if (needArgBrackets)
			result.append(')');
	}

	result.append(')');

	if (info !== undefined &&
	info.after !== undefined)
		result.append(info.after);

	if (needsExtraBrackets)
		result.append(')');

	if (info !== undefined && info.returnTypes === null)
		result.append(';\n');
};