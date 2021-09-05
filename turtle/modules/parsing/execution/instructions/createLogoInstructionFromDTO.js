import { AsyncCallCommandInstruction } from './AsyncCallCommandInstruction.js';
import { BinaryOperatorInstruction } from './BinaryOperatorInstruction.js';
import { CallCommandInstruction } from './CallCommandInstruction.js';
import { CallHighOrderInstruction } from './CallHighOrderInstruction.js';
import { CallProcedureInstruction } from './CallProcedureInstruction.js';
import { IncrementForCounterInstruction } from './IncrementForCounterInstruction.js';
import { IncrementRepcountInstruction } from './IncrementRepcountInstruction.js';
import { JavaScriptInstruction } from './JavaScriptInstruction.js';
import { JumpIfTrueInstruction } from './JumpIfTrueInstruction.js';
import { JumpInstruction } from './JumpInstruction.js';
import { OutputInstruction } from './OutputInstruction.js';
import { OutputNullInstruction } from './OutputNullInstruction.js';
import { PopForcountInstruction } from './PopForcountInstruction.js';
import { PopInstruction } from './PopInstruction.js';
import { PopRepcountInstruction } from './PopRepcountInstruction.js';
import { PushForCountInstruction } from './PushForCountInstruction.js';
import { PushFromStackInstruction } from './PushFromStackInstruction.js';
import { PushInstruction } from './PushInstruction.js';
import { PushMaxRepcountInstruction } from './PushMaxRepcountInstruction.js';
import { UnaryOperatorInstruction } from './UnaryOperatorInstruction.js';
import { VariableReadInstruction } from './VariableReadInstruction.js';

// Every LogoInstruction subclass should be listed below.
const instructionClasses = [
	AsyncCallCommandInstruction,
	BinaryOperatorInstruction,
	CallCommandInstruction,
	CallHighOrderInstruction,
	CallProcedureInstruction,
	IncrementForCounterInstruction,
	IncrementRepcountInstruction,
	JavaScriptInstruction,
	JumpIfTrueInstruction,
	JumpInstruction,
	OutputInstruction,
	OutputNullInstruction,
	PopForcountInstruction,
	PopInstruction,
	PopRepcountInstruction,
	PushForCountInstruction,
	PushFromStackInstruction,
	PushInstruction,
	PushMaxRepcountInstruction,
	UnaryOperatorInstruction,
	VariableReadInstruction
];

const classMap = new Map();
instructionClasses.forEach(function(ic, index) {
	if (typeof ic._name !== 'string')
		throw new Error('No class name for LogoInstruction subclass at index ' + index);

	classMap.set(ic._name, ic);
});

export function createLogoInstructionFromDTO(dto, token, proceduresMap) {
	if (typeof dto !== 'object')
		throw new Error('dto must be an object');
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	const instructionClass = classMap.get(dto.name);
	if (instructionClass === undefined)
		throw new Error('Unable to get instruction class from name: ' + dto.name);
	if (typeof instructionClass.createFromDTO !== 'function')
		throw new Error('createFromDTO is not a function for instruction class with name: ' + dto.name);

	return instructionClass.createFromDTO(dto, token, proceduresMap);
};