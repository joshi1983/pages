import { Colour } from '../../../Colour.js';
import { LogoInstruction } from './LogoInstruction.js';
import { LogoRuntimeException } from '../LogoRuntimeException.js';
import { Transparent } from '../../../Transparent.js';

export class JavaScriptInstruction extends LogoInstruction {
	static _name = 'javascript';

	constructor(code, parseToken) {
		super(false, parseToken);
		this.code = code;
		try {
			this.execute = new Function('context', code);
		}
		catch (e) {
			console.error('Problem while making JavaScript function with JavaScript code: ' + code);
			throw e;
		}
		this.Transparent = Transparent;
	}

	convertBool(val) {
		if (typeof val !== 'boolean')
			throw new LogoRuntimeException('true or false required.  Value given is ' + val);
		return val;
	}

	convertColour(val) {
		if (val instanceof Colour)
			return val;
		return new Colour(val);
	}

	convertColourOrTransparent(val) {
		if (val === Transparent || val instanceof Colour)
			return val;
		if (typeof val === 'string' && val.toLowerCase() === 'transparent')
			return Transparent;
		return new Colour(val);
	}

	static createFromDTO(dto, token) {
		return new JavaScriptInstruction(dto.code, token);
	}

	static convertListToString(val) {
		if (val instanceof Array) {
			val = val.join(' ').trim();
		}
		return val;
	}

	listToString(val) {
		if (val instanceof Array) {
			val = val.join(' ').trim();
		}
		return val;
	}

	toDTO() {
		return {
			'name': JavaScriptInstruction._name,
			'code': this.code
		};
	}

	validateListVariableReference(varName, context) {
		const result = context.readVariable(varName);
		if (!(result instanceof Array))
			throw new LogoRuntimeException(`${varName} must be a list but it is not`);
		return result;
	}

	validateNumber(val) {
		if (typeof val !== 'number' || isNaN(val))
			throw new LogoRuntimeException('Number required.  Value given is ' + val);
		return val;
	}

	validatePListVariableReference(varName, context) {
		const result = context.readVariable(varName);
		if (!(result instanceof Map))
			throw new LogoRuntimeException(`${varName} must be a plist but it is not`);
		return result;
	}

	validateString(val) {
		if (typeof val !== 'string')
			throw new LogoRuntimeException('String required.  Value given is ' + val);
		return val;
	}
};