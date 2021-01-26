function fail(msg) {
	console.error(msg);
}

function arrayEquals(a1, a2) {
	return JSON.stringify(a1) === JSON.stringify(a2);
}

function testIsAttributeToken() {
	var attrTokens = ['[', '0', '-1', '-1.123', '"0"',
	'-1.123E+08', '-1.123E-08', '-1.123e+08', '0 0', '0,0', '0,0,0'];
	var notAttrTokens = ['', ']', 'a', 'Shape', '{', '}'];
	attrTokens.forEach((tok) => {
		if (!WRLUtils._isAttributeToken(tok)) {
			fail('Expected true for ' + tok);
		}
	});
	notAttrTokens.forEach((tok) => {
		if (WRLUtils._isAttributeToken(tok)) {
			fail('Expected false for ' + tok);
		}
	});
}

function testRemoveComments() {
	var code = `#VRML V2.0 utf8
# Created By VRML happiness ;-)
# La La La yea happy!!  (_)(VrMl)(')
`;
	var result = WRLUtils._removeComments(code);
	if (result !== '')
		fail('Expected empty string but got: ' + result);
	code = 'Shape {} # Some comment';
	var result = WRLUtils._removeComments(code);
	var expected = 'Shape {}';
	if (result !== expected)
		fail('Expected ' + expected + ' but got: ' + result);
}

function testGetTagNameFor() {
	var cases = [
		{'in': 'Appearance', 'out': 'Appearance'},
		{'in': 'appearance Appearance', 'out': 'Appearance'},
		{'in': 'geometry Box', 'out': 'Box'},
	];
	cases.forEach((testCase) => {
		var result = WRLUtils._getTagNameFor(testCase.in);
		if (result !== testCase.out)
			fail('Expected ' + testCase.out + ' but got ' + result);
	});
}

function testGetScanTokensFromVRML() {
	var cases = [
		{'in': '', 'out': []},
		{'in': 'Scene {}', 'out': ['Scene', '{', '}']},
		{'in': 'Scene { }', 'out': ['Scene', '{', '}']},
		{'in': 'material Material { diffuseColor 0 1 0 }', 'out': ['material Material', '{', 'diffuseColor', '0 1 0', '}']},
		{'in': 'material Material { diffuseColor 0 1 0}', 'out': ['material Material', '{', 'diffuseColor', '0 1 0', '}']},
		{'in': 'material Material{diffuseColor 0 1 0}', 'out': ['material Material', '{', 'diffuseColor', '0 1 0', '}']}
	];
	cases.forEach(function(testCase) {
		var result = WRLUtils._getScanTokensFromVRML(testCase.in);
		if (!arrayEquals(testCase.out, result))
			fail('Expected ' + JSON.stringify(testCase.out) + ' but got ' + JSON.stringify(result));
	});
}

function testVrmlToX3DAttribute() {
	var cases = [
		{'in': [['diffuseColor', '0 0 0'], 0], 'out': ['diffuseColor', '0 0 0', 2]},
		{'in': [['diffuseColor', '[', '0,0,0', ']'], 0], 'out': ['diffuseColor', '0 0 0', 4]},
		{'in': [['diffuseColor', '[', '0 0 0', ']'], 0], 'out': ['diffuseColor', '0 0 0', 4]},
	];
	cases.forEach((testCase) => {
		var result = WRLUtils._vrmlToX3DAttribute(testCase.in[0], testCase.in[1]);
		if (result.name !== testCase.out[0])
			fail('name expected to be ' + testCase.out[0] + ' but found to be ' + result.name);
		if (result.value !== testCase.out[1])
			fail('value expected to be ' + testCase.out[1] + ' but found to be ' + result.value);
		if (result.newStartIndex !== testCase.out[2])
			fail('newStartIndex expected to be ' + testCase.out[2] + ' but found to be ' + result.newStartIndex);
	});
}

function testLoadChildrenFromTokens() {
	var doc = document.implementation.createDocument(null, "X3D");
	var parentElement = doc.createElement('Scene');
	var tokens = ['}'];
	var result = WRLUtils._loadChildrenFromTokens(
		doc, parentElement, '}', tokens, 0);
	if (result !== 0)
		fail('newStartIndex should be 0 but returned ' + result);
	if (parentElement.childElementCount !== 0)
		fail('no children expected but returned ' + parentElement.childElementCount);

	parentElement = doc.createElement('Scene');
	tokens = ['Shape', '{', '}', '}'];
	result = WRLUtils._loadChildrenFromTokens(
		doc, parentElement, '}', tokens, 0);
	if (result !== 3)
		fail('newStartIndex should be 3 but returned ' + result);
	if (parentElement.childElementCount !== 1)
		fail('1 Shape child expected but returned ' + parentElement.childElementCount);
}

function testVrmlToX3DElement() {
	var doc = document.implementation.createDocument(null, "X3D");
	var parentElement = doc.createElement('Scene');
	var tokens = ['Shape', '{', 'appearance Appearance', '{', 
		'material Material', '{', 'diffuseColor', '0 1 0', '}',
		'}', 'geometry Box', '{', 'size', '2.2 0.2 0.2', '}',
		'}', '}'];
	var result = WRLUtils._vrmlToX3DElement(doc, tokens, 0);
	if (result.newStartIndex !== tokens.length - 1)
		fail('Expected newStartIndex of ' + (tokens.length - 1) + ' but got ' + result.newStartIndex);
	if (typeof result.element !== 'object')
		fail('element expected');
	else {
		var shapeResult = result.element;
		if (shapeResult.tagName !== 'Shape')
			fail('Expected Shape child but found ' + shapeResult.tagName);
		else if (shapeResult.childElementCount !== 2)
			fail('Expected 2 children of Shape but found ' + shapeResult.childElementCount);
		else {
			var appearance = shapeResult.firstChild;
			var box = shapeResult.lastChild;
			if (appearance.tagName !== 'Appearance')
				fail('Expected Appearance child but found ' + appearance.tagName);
			else {
				var material = appearance.firstChild;
				if (material.tagName !== 'Material')
					fail('Expected Material child but found ' + material.tagName);
				if (!material.hasAttribute('diffuseColor'))
					fail('Expected diffuseColor attribute on Material but not set.');
				else if (material.getAttribute('diffuseColor') !== '0 1 0')
					fail('Expected diffuseColor attribute to be 0 1 0 on Material but found: ' + material.getAttribute('diffuseColor'));
			}
			if (box.tagName !== 'Box')
				fail('Expected Box child but found ' + box.tagName);
			else {
				if (box.getAttribute('size') !== '2.2 0.2 0.2')
					fail('Expected Box size to be 2.2 0.2 0.2 but found ' + box.getAttribute('size'));
			}
		}
	}
	
	tokens = ["Scene", "{", "Transform", "{", 
		"translation", "0 0 8.58993e+08", "children"
		,"[","Shape","{","appearance Appearance","{","material Material"
		,"{","diffuseColor","0 1 0","}","}","geometry Box"
		,"{","size","0.8 0.8 1.71798e+09","}","}","]","}","Transform"
		,"{","translation","1 0 8.58993e+08","children","[","Shape"
		,"{","appearance Appearance","{","material Material","{","diffuseColor"
		,"0 1 0","}","}","geometry Box","{","size","0.8 0.8 1.71799e+09"
	,"}","}","]","}", "}"];
	result = WRLUtils._vrmlToX3DElement(doc, tokens, 8);
	if (result.newStartIndex !== 24)
		fail('Expected 24 but got ' + result.newStartIndex);
	if (result.element.tagName !== 'Shape')
		fail('Expected Shape element but got ' + result.element.tagName);
	else if (result.element.childElementCount !== 2)
		fail('Expected Shape to have 2 children but got ' + result.element.childElementCount);

	result = WRLUtils._vrmlToX3DElement(doc, tokens, 2);
	if (result.element.tagName !== 'Transform')
		fail('Expected element Transform but got ' + result.element.tagName);
	else if (result.element.getAttribute('translation') !== '0 0 8.58993e+08')
		fail('Expected Transform to have translation attribute value of 0 0 8.58993e+08 but got ' + result.element.getAttribute('translation'));

	result = WRLUtils._vrmlToX3DElement(doc, tokens, 32);
	if (result.element.tagName !== 'Shape')
		fail('Expected element Shape but got ' + result.element.tagName);

	result = WRLUtils._vrmlToX3DElement(doc, tokens, 0);
	if (result.element.tagName !== 'Scene')
		fail('Expected element Scene but got ' + result.element.tagName);
}

testIsAttributeToken();
testRemoveComments();
testGetTagNameFor();
testGetScanTokensFromVRML();
testVrmlToX3DAttribute();
testLoadChildrenFromTokens();
testVrmlToX3DElement();