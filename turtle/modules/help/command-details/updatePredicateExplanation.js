function isPredicateCommand(commandInfo) {
	if (!commandInfo.primaryName.endsWith("p") || commandInfo.returnTypes !== 'bool')
		return false;
	return commandInfo.names.filter(name => name.indexOf('?') !== -1).length !== 0;
}

export function updatePredicateExplanation(commandInfo) {
	const e = document.getElementById('command-details-explain-trailing-p-for-predicates');
	if (isPredicateCommand(commandInfo))
		e.style.display = 'block';
	else
		e.style.removeProperty('display');
};