import { StringBuffer } from './StringBuffer.js';

export class StringUtils {
	static capitalizeFirstLetter(s) {
		if (s.length === 0)
			return s;
		else
			return s.charAt(0).toUpperCase() + s.substring(1);
	}

	static clearEnglishListPhrase(container) {
		if (!(container instanceof Array))
			container = Array.from(container);
		if (container.length === 1)
			return container[0];
		container.sort();
		const result = new StringBuffer();
		for (let i = 0; i < container.length; i++) {
			if (i !== 0) {
				if (container.length - 1 > i)
					result.append(', ');
				else
					result.append(' and ');
			}
			result.append(container[i]);
		}
		return result.toString();
	}

	static containsAny(s, substrings) {
		for (let i = 0; i < substrings.length; i++) {
			if (s.indexOf(substrings[i]) !== -1)
				return true;
		}
		return false;
	}

	static countChar(s, ch, fromIndex, toIndex) {
		if (fromIndex === undefined)
			fromIndex = 0;
		if (toIndex === undefined)
			toIndex = s.length;
		let result = 0;
		for (let i = fromIndex; i < toIndex; i++) {
			if (s[i] === ch)
				result++;
		}
		return result;
	}

	static escapeXMLAttribute(s) {
		return s.replace(/"/g, '\\"').
			replace(/'/g, '\\\'');
	}

	static escapeHTML(s) {
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(s));
		return p.innerHTML;
	}

	static firstCharLower(s) {
		return s.charAt(0).toLowerCase() + s.substring(1);
	}

	static forceFileExtension(filename, newExtension) {
		if (typeof newExtension !== 'string')
			throw new Error(`newExtension must be a string.  Not: ${newExtension}`);
		if (newExtension.startsWith('.'))
			newExtension = newExtension.substring(1);
		if (newExtension.indexOf('.') !== -1)
			throw new Error(`. should not be in newExtension but got ${newExtension}`);

		const index = filename.lastIndexOf('.');
		if (index === -1)
			return `${filename}.${newExtension}`;
		else
			return filename.substring(0, index) + '.' + newExtension;
	}

	static getLengthOfEqualEnding(s1, s2, minIndex1) {
		if (minIndex1 === undefined)
			minIndex1 = 0;
		const len = Math.min(s1.length, s2.length, s1.length - minIndex1);
		for (let i = 1; i <= len; i++) {
			if (s1[s1.length - i] !== s2[s2.length - i])
				return i - 1;
		}
		return len;
	}

	static indexOfNthOccurrance(hey, fromIndex, needle, n) {
		for (fromIndex = hey.indexOf(needle, fromIndex);
		fromIndex !== -1;) {
			if (n === 0)
				return fromIndex;
			n--;
			fromIndex = hey.indexOf(needle, fromIndex + 1);
		}
		return -1;
	}

	static isWhitespace(s) {
		if (s === '')
			return false;
		return s.trim() === '';
	}

	static removeFileExtension(name) {
		const dotIndex = name.lastIndexOf('.');
		if (dotIndex !== -1) {
			return name.substring(0, dotIndex);
		}
		return name; // no file extension found.
	}

	/*
	s is the string to search and replace with.
	pairs should be an Array of Array of strings.
	Each pair is [0] for from.  [1] is the new value.

	The new string value is returned.
	*/
	static replacePairs(s, pairs) {
		let result = new StringBuffer();
		for (let i = 0; i < s.length; i++) {
			let found = false;
			for (let pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
				const pair = pairs[pairIndex];
				if (s.startsWith(pair[0], i)) {
					result.append(pair[1]);
					i += pair[0].length - 1;
					found = true;
					break;
				}
			}
			if (!found)
				result.append(s[i]);
		}
		return result.toString();
	}
};