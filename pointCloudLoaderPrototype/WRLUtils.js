class WRLUtils {
	
};

WRLUtils._attributeValueRegexes = [		// if starts with a real number or integer, return that.
	'[\\-]?\\d+(\.\\d+)?([Ee][+\\-]\\d+)?', // Float
	'[\\-]?\\d+(\.\\d+)?([Ee][+\\-]\\d+)?((,|,?\\s+|\\s+,|\\s+,\\s+)[\\-]?\\d+(\.\\d+)?([Ee][+\\-]\\d+)?)+', // Float array
	'\\"[^"]\\"', // mfString
	'[A-Z]+[_A-Z]*' // sfEnum
];

WRLUtils._removeComments = function(content) {
	var lines = content.trim().split('\n').map(function(line) {
		line = line.trim();
		var index = line.indexOf('#');
		if (index !== -1)
			return line.substring(0, index).trim();
		else
			return line;
	});
	return lines.join('\n').trim();
};

WRLUtils._getTagNameFor = function(s) {
	var parts = s.split(/\s+/);
	if (parts.length === 1)
		return parts[0];
	else if (parts.length === 0)
		throw new Error('Unable to get tag name from empty string');
	var partsStartingWithCapital = parts.filter(function(partName) {
		var c = partName.charAt(0);
		return c.toUpperCase() === c;
	});
	if (partsStartingWithCapital.length === 1)
		return partsStartingWithCapital[0];
	return parts[parts.length - 1];
};

WRLUtils._getScanTokensFromVRML = function(content) {
	var token = '';
	var attributeValueMatches = WRLUtils._getAttributeValueTokens(content);
	var result = [];
	for (var i = 0; i < content.length; i++) {
		var c = content.charAt(i);
		if ('[]{}'.indexOf(c) !== -1) {
			token = token.trim();
			if (token.length !== 0) {
				result.push(token);
				token = '';
			}
			result.push(c);
		}
		else if (attributeValueMatches['' + i] !== undefined) {
			token = token.trim();
			if (token.length !== 0) {
				result.push(token);
				token = '';
			}
			token = attributeValueMatches['' + i];
			result.push(token);
			i += token.length - 1;
			token = '';
		}
		else {
			token += c;
		}
	}
	token = token.trim();
	if (token !== '')
		result.push(token);
	return result;
};

WRLUtils._vrmlToX3DAttribute = function(tokens, startIndex) {
	if (!WRLUtils._isAttributeToken(tokens[startIndex + 1]))
		throw new Error('_vrmlToX3DAttribute expects ' + tokens[startIndex + 1] + ' to be an attribute value token');
	var name = tokens[startIndex];
	var value;
	var newStartIndex;
	if (tokens[startIndex + 1] === '[') {
		if (tokens[startIndex + 2] === ']') {
			value = '';
			newStartIndex = startIndex + 3;
		}
		else {
			value = tokens[startIndex + 2].replace(/,/g, ' ');
			newStartIndex = startIndex + 4;
		}
	}
	else {
		value = tokens[startIndex + 1];
		newStartIndex = startIndex + 2;
	}
	if (/\s/.test(name)) {
		console.error('Parse error.  Invalid attribute name(' + tokens[startIndex] 
		+ ') found near tokens: ', tokens.slice(Math.max(0, startIndex - 2), startIndex + 10));
	}
	return {
		'name': tokens[startIndex],
		'value': value,
		'newStartIndex': newStartIndex
	};
};

WRLUtils._getAttributeValueTokens = function(s) {
	var whitespace = /\s/;
	var after = /[\s\}]/;
	var result = {}; // structured as (start index) => (string match).
	WRLUtils._attributeValueRegexes.forEach(function(re) {
		var matches = s.matchAll(new RegExp(re, 'g'));
		for (const match of matches) {
			if (match.index === 0)
				continue;
			// there must be a white-space immediately before the match.
			if (!whitespace.test(s.charAt(match.index - 1))) {
				continue;
			}
			// there must be a white-space or ] immediately after the match.
			if (!after.test(s.charAt(match.index + match[0].length))) {
				continue;
			}
			var key = '' + match.index;
			if (result[key] === undefined || match[0].length > result[key].length)
				result[key] = match[0];
		}
	});

	return result;
};

WRLUtils._isAttributeToken = function(token) {
	if (token === '[')
		return true;
	else if ('{}]'.indexOf(token) !== -1)
		return false;

	var matches = WRLUtils._attributeValueRegexes.filter(function(re) {
		return !!token.match(new RegExp('^' + re + '$', 'g'));
	});
	return matches.length !== 0;
};

WRLUtils._loadChildrenFromTokens = function(doc, parentElement, closingBracket, tokens, startIndex) {
	for (;startIndex < tokens.length && tokens[startIndex] !== closingBracket;) {
		if ('{}[]'.indexOf(tokens[startIndex]) !== -1) {
			var msg = 'Expected to close children section with ' + closingBracket + ' but found ' + tokens[startIndex] + ' at token index ' + startIndex;
			console.error(msg);
			throw new Error(msg);
		}
		else if (WRLUtils._isAttributeToken(tokens[startIndex + 1])) {
			var attrInfo = WRLUtils._vrmlToX3DAttribute(tokens, startIndex);
			if (attrInfo.name === 'children' && tokens[startIndex + 1] === '[') {
				startIndex = WRLUtils._loadChildrenFromTokens(doc, parentElement, ']', tokens, startIndex + 2);
				startIndex ++;
			}
			else {
				parentElement.setAttribute(attrInfo.name, attrInfo.value);
				startIndex = attrInfo.newStartIndex;
			}
		}
		else {
			var childElementInfo = WRLUtils._vrmlToX3DElement(doc, tokens, startIndex);
			parentElement.appendChild(childElementInfo.element);
			startIndex = childElementInfo.newStartIndex;
		}
	}
	return startIndex;
}

WRLUtils._vrmlToX3DElement = function(doc, tokens, startIndex) {
	var tagName = WRLUtils._getTagNameFor(tokens[startIndex]);
	if (tokens[startIndex + 1] !== '{')
		throw new Error('Expected { but ' + tokens[startIndex + 1] + ' found at token ' + (startIndex + 1) + '.  Trying to create element with tag name ' + tagName);
	var resultElement = doc.createElement(tagName);
	startIndex += 2;
	startIndex = WRLUtils._loadChildrenFromTokens(doc, resultElement, '}', tokens, startIndex);
	return {
		'element': resultElement,
		'newStartIndex': startIndex + 1
	};
};

WRLUtils.vrmlToX3DDocument = function(content) {
	content = 'Scene { ' + WRLUtils._removeComments(content) + ' }';
	var tokens = WRLUtils._getScanTokensFromVRML(content);
	var doc =  document.implementation.createDocument(null, "X3D");
	var sceneInfo = WRLUtils._vrmlToX3DElement(doc, tokens, 0);
	return sceneInfo.element;
};