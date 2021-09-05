export function procStartToProcedureName(s) {
	s = s.substring(1).trim();
	const index = s.indexOf(' ');
	if (index !== -1)
		s = s.substring(0, index);
	return s;
};