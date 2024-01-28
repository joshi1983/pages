import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateVariableReference(refTypes) {
	if (refTypes === 'plist') {
		return function(varName, context) {
			const result = context.readVariable(varName);
			if (!(result instanceof Map))
				throw new LogoRuntimeException(`${varName} must be a plist but it is not`);
			return result;
		};
	}
	else if (refTypes === 'list') {
		return function(varName, context) {
			const result = context.readVariable(varName);
			if (!(result instanceof Array))
				throw new LogoRuntimeException(`${varName} must be a list but it is not`);
			return result;
		};
	}
};