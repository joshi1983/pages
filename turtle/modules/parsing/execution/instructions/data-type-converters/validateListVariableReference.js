import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateListVariableReference(varName, context) {
	const result = context.readVariable(varName);
	if (!(result instanceof Array))
		throw new LogoRuntimeException(`${varName} must be a list but it is not`);
	return result;
};
