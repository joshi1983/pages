function convertProcedureToSerializableObject(procedure) {
	const result = {
		'name': procedure.name
	};
	result.instructions = procedure.instruments.map(i => i.toDTO());
	return result;
}

export function convertLogoProgramToSerializableObject(program) {
	const procs = new Map();
	for (const proc of program.procedures.values()) {
		procs.set(proc.name, convertProcedureToSerializableObject(proc));
	}
	const result = {
		'code': program.code,
		'parseTree': program.parseTree,
		'instructions': program.instructions.map(i => i.toDTO()),
		'procedures': procs
	};

	return result;
};