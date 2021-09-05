import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

function getLabelNameToInfoMap(scanTokens) {
	const result = new Map();

	function getOrInitializeForName(name) {
		name = name.toLowerCase();
		let info = result.get(name);
		if (info === undefined) {
			info = {
				'name': name,
				'gotoIndexes': []
			};
			result.set(name, info);
		}
		return info;
	}

	for (let i = scanTokens.length - 2; i >= 0; i--) {
		const token = scanTokens[i];
		const next = scanTokens[i + 1];
		const lowerName = token.s.toLowerCase();
		
		// if declaring a label
		if (lowerName === 'label' && isIdentifier(next.s)) {
			const info = getOrInitializeForName(next.s);
			info.labelIndex = i;
		}
		else if ((lowerName === 'goto' || lowerName === 'gosub') && isIdentifier(next.s)) {
			// if refering to a label
			const info = getOrInitializeForName(next.s);
			info.gotoIndexes.push(i);
		}
	}
	return result;
}

// If no goto statement refers to a label, 
// the code can be simplified by removing the label statement.
function removeUnreferencedLabels(scanTokens, labelsMap) {
	// Deleting a pair of tokens from scanTokens affects the indexes after that pair.
	// tokenPairRemoved mutates labelsMap to the same state it would have if
	// labelsMap = getLabelNameToInfoMap(scanTokens) was run again.
	function tokenPairRemoved(minIndex) {
		scanTokens.splice(minIndex, 2);
		for (const labelInfo of labelsMap.values()) {
			if (labelInfo.labelIndex !== undefined && labelInfo.labelIndex > minIndex) {
				labelInfo.labelIndex -= 2;
			}
			for (let i = 0; i < labelInfo.gotoIndexes.length; i++) {
				if (labelInfo.gotoIndexes[i] > minIndex)
					labelInfo.gotoIndexes[i] -= 2;
			}
		}
	}

	for (const labelInfo of labelsMap.values()) {
		if (labelInfo.gotoIndexes.length === 0) {
			// remove a declared label that has no corresponding goto statements.
			tokenPairRemoved(labelInfo.labelIndex);
			labelsMap.delete(labelInfo.name);
		}
		if (labelInfo.labelIndex === undefined) {
			// if there are goto statements to a label that does not exist, 
			// remove the corresponding goto statements.
			// this is sort of an automatic fix.
			const gotoIndexes = labelInfo.gotoIndexes;
			for (let i = 0; i < gotoIndexes.length; i++) {
				tokenPairRemoved(gotoIndexes[i]);
			}
			labelsMap.delete(labelInfo.name);
		}
	}
}

// QBASIC code often uses labels that are 10 * the line index.
// We check if no other label is on the same line to follow that convention as much as possible.
// The only hard rule is that each label is distinct.
// Basing the new name off line index of the code will contradict that hard rule,
// if more than one label is declared on the same line.
function shouldDeriveFromLineIndex(scanTokens, labelInfo, labelsMap) {
	const index = labelInfo.labelIndex;
	for (let i = index - 1; i >= 0; i--) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'label') {
			return false;
		}
	}
	for (let i = index + 1; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'label') {
			return false;
		}
	}
	const key = '' + lineIndexToQBasicConventionalLabelIndex(index);
	if (labelsMap.has(key))
		return false;
	return true;
}

function lineIndexToQBasicConventionalLabelIndex(lineIndex) {
	return (1 + lineIndex) * 10;
}

function getQBasicName(scanTokens, labelInfo, labelsMap) {
	const token = scanTokens[labelInfo.labelIndex];
	if (shouldDeriveFromLineIndex(scanTokens, labelInfo, labelsMap)) {
		return '' + lineIndexToQBasicConventionalLabelIndex(token.lineIndex);
	}
	else {
		for (let seedIndex = lineIndexToQBasicConventionalLabelIndex(token.lineIndex);
		true; seedIndex++) {
			const key = '' + seedIndex;
			if (!labelsMap.has(key)) {
				return key;
			}
		}
	}
}

export function microALabelToQBasicLabel(scanTokens) {
	const labelsMap = getLabelNameToInfoMap(scanTokens);
	removeUnreferencedLabels(scanTokens, labelsMap);
	const values = Array.from(labelsMap.values());
	for (const labelInfo of values) {
		const labelToken = scanTokens[labelInfo.labelIndex];
		const nameToken = scanTokens[labelInfo.labelIndex + 1];
		const qbasicName = getQBasicName(scanTokens, labelInfo, labelsMap);
		labelToken.s = qbasicName;
		nameToken.s = ':';
		labelInfo.name = qbasicName;
		const gotoIndexes = labelInfo.gotoIndexes;
		for (const index of labelInfo.gotoIndexes) {
			const gotoLabelToken = scanTokens[index + 1];
			gotoLabelToken.s = qbasicName;
		}
		// update the map to reflect the new translated name.
		labelsMap.delete(labelInfo.name);
		labelInfo.name = qbasicName;
		labelsMap.set(qbasicName, labelInfo);
	}
};