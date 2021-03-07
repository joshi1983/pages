
/*
Copied from: https://codehandbook.org/generate-random-string-characters-in-javascript/
*/
function generate_random_string(string_length){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii);
    }
    return random_string;
}

function getInitialServerURL() {
	var result = window.location.href;
	if (result.endsWith('.html')) {
		var index = result.lastIndexOf('/');
		result = result.substring(0, index + 1);
	}
	result += 'api/';
	return result;
}

function arraysAreDifferent(a1, a2) {
	if (a1.length !== a2.length) {
		console.log('array lengths are different so returning true');
		return true;
	}
	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i])
			return true;
	}
	return false;
}