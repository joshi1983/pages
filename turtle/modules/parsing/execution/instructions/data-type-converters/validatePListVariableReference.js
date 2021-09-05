import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validatePListVariableReference(varName, context) {
	const result = context.readVariable(varName);
	if (!(result instanceof Map))
		throw new LogoRuntimeException(`${varName} must be a plist but it is not`);
	return result;
};