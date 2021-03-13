function getVariableNames(s) {
	var result = new Set();
	for (var i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
			result.add(c);
	}
	result = Array.from(result); // convert Set to Array.
	result.sort(); // sort alphabetically.
	return result;
}

function getIdForVariable(variableName) {
	return 'variable-assignment-' + variableName;
}

function getInputIdForVariable(variableName) {
	return getIdForVariable(variableName) + '-input';
}

document.addEventListener('DOMContentLoaded', function() {
	var formula = document.getElementById('formula');
	var variableAssignments = document.getElementById('variable-assignments');
	var variableAssignmentsNone = document.getElementById('variable-assignments-none');
	var resultElement = document.getElementById('result');
	var errorsElement = document.getElementById('errors');
	var previousVariableNames;

	function getMathJSFormula() {
		var f = formula.value;
		if (typeof f === 'string')
			f = f.trim();
		else
			f = '';
		// any letters that are side by side must be split by '*'.
		for (var i = 0; i < 2; i++) {
			// any letters that are side by side must be split by '*'.
			f = f.replace(/[a-zA-Z]{2}/g, function (match, capture) {
				return match.charAt(0) + '*' + match.charAt(1);
			});
		}
		return f;
	}

	function setErrorMessage(msg) {
		errorsElement.innerText = msg;
	}

	function refreshResult() {
		var f = getMathJSFormula();
		if (f === '') {
			setErrorMessage('Formula required');
			return;
		}
		var s = '';
		previousVariableNames.forEach(function(variableName) {
			var id = getInputIdForVariable(variableName);
			var input = document.getElementById(id);
			s += variableName + ' = ' + input.value + '\n';
		});
		s += f;
		try {
			var result = math.evaluate(s);
			if (result.entries !== undefined) {
				result = result.entries;
				result = result[result.length - 1];
			}
			resultElement.innerText = result;
			setErrorMessage('');
		}
		catch (e) {
			setErrorMessage('' + e);
		}
	}

	function formulaChanged() {
		var f = formula.value;
		var variableNames = getVariableNames(f);
		// add any new elements.
		variableNames.filter(function(variableName) {
			return previousVariableNames === undefined || previousVariableNames.indexOf(variableName) === -1;
		}).forEach(function(variableName) {
			var id = getIdForVariable(variableName);
			var li = document.createElement('li');
			li.setAttribute('id', id);
			var inputId = getInputIdForVariable(variableName);
			var input = document.createElement('input');
			input.setAttribute('type', 'number');
			input.setAttribute('step', '0.001');
			input.setAttribute('id', inputId);
			input.value = 0;
			input.addEventListener('input', refreshResult);
			var label = document.createElement('label');
			label.setAttribute('for', inputId);
			label.innerText = variableName;
			li.appendChild(label);
			li.appendChild(input);
			variableAssignments.append(li);
		});
		
		// remove any elements that need to be removed.
		if (previousVariableNames !== undefined) {
			previousVariableNames.filter(function(variableName) {
				return variableNames.indexOf(variableName) === -1;
			}).forEach(function(variableName) {
				var li = document.getElementById(getIdForVariable(variableName));
				li.remove();
			});
		}
		if (variableNames.length === 0) {
			variableAssignmentsNone.style.display = 'block';
		}
		else {
			variableAssignmentsNone.style.display = 'none';
		}

		previousVariableNames = variableNames;
		setTimeout(refreshResult, 0); // refresh result after DOM updates.
	}

	formulaChanged();
	formula.addEventListener('input', formulaChanged);
});