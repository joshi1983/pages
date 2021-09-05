import { CommandsToJS } from
'../CommandsToJS.js';
import { processSpecialParameterizedGroup } from
'./parameterized-group/processSpecialParameterizedGroup.js';
import { processToken } from
'./processToken.js';

export function processParameterizedGroup(token, result) {
	if (processSpecialParameterizedGroup(token, result))
		return;

	const children = token.children;
	const info = CommandsToJS.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.migrateToCode !== undefined) {
			result.append(info.migrateToCode);
			return;
		}
		if (info.returnTypes === null)
			result.append('\n');
		if (info.to !== undefined)
			result.append(info.to);
		else if (info.toOperator !== undefined) {
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (i !== 0)
					result.append(` ${info.toOperator} `);
				result.append('(');
				processToken(child, result);
				result.append(')');
			}
			return;
		}
		else if (info.toUnaryOperator !== undefined) {
			result.append('(' + info.toUnaryOperator);
			processToken(children[0], result);
			result.append(')');
			return;
		}
		else if (info.after !== undefined) {
			result.append('(');
			processToken(children[0], result);
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
		if (i !== 0) {
			result.append(', ');
		}
		processToken(child, result);
	}
	result.append(')');
	if (info !== undefined && info.returnTypes === null)
		result.append(';\n');
};