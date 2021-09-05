import { convertToAlphaColour } from './data-type-converters/convertToAlphaColour.js';
import { convertToAlphaColourOrTransparent } from './data-type-converters/convertToAlphaColourOrTransparent.js';
import { convertToColour } from './data-type-converters/convertToColour.js';
import { convertToColourOrTransparent } from './data-type-converters/convertToColourOrTransparent.js';
import { convertToDataTypes } from './data-type-converters/convertToDataTypes.js';
import { convertToStepPosition } from './data-type-converters/convertToStepPosition.js';
import { easeClasses } from '../../../drawing/vector/easing/easeClasses.js';
import { FontWeight } from '../../../drawing/vector/shapes/style/FontWeight.js';
import { LineCap } from '../../../drawing/vector/shapes/style/LineCap.js';
import { LogoInstruction } from './LogoInstruction.js';
import { StepPosition } from '../../../drawing/vector/easing/StepPosition.js';
import { Transparent } from '../../../Transparent.js';
import { validateBool } from './data-type-converters/validateBool.js';
import { validateFiniteNumber } from './data-type-converters/validateFiniteNumber.js';
import { validateListOrString } from './data-type-converters/validateListOrString.js';
import { validateListVariableReference } from './data-type-converters/validateListVariableReference.js';
import { validateNumber } from './data-type-converters/validateNumber.js';
import { validatePListVariableReference } from './data-type-converters/validatePListVariableReference.js';
import { validateString } from './data-type-converters/validateString.js';

export class JavaScriptInstruction extends LogoInstruction {
	static _name = 'javascript';

	constructor(code, parseToken, namedFunctionsMap) {
		super(false, parseToken);
		try {
			this.setCode(code);
		}
		catch (e) {
			console.error('Problem while making JavaScript function with JavaScript code: ' + code);
			throw e;
		}
		for (let i = 0; i < easeClasses.length; i++) {
			const easeClass = easeClasses[i];
			this[easeClass.name] = easeClass;
		}
		if (namedFunctionsMap !== undefined) {
			for (const [name, func] of namedFunctionsMap) {
				this[name] = func;
			}
			this.extraNamedFunctionsMap = namedFunctionsMap;
		}
		this.StepPosition = StepPosition;
		this.Transparent = Transparent;
		this.dataTypes = convertToDataTypes;
		this.fontWeight = FontWeight.parse;
		this.lineCap = LineCap.parse;
		for (const func of [convertToAlphaColour, convertToAlphaColourOrTransparent, convertToColour, convertToColourOrTransparent,
		convertToStepPosition, validateBool, validateListOrString, validateListVariableReference,
		validateFiniteNumber, validateNumber, validatePListVariableReference, validateString]) {
			this[func.name] = func;
		}
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

	setCode(code) {
		this.code = code;
		try {
			this.execute = new Function('context', code);
		} catch (e) {
			console.log(`code = ${code}`);
			throw e;
		}
	}

	toDTO() {
		return {
			'name': JavaScriptInstruction._name,
			'code': this.code
		};
	}
};