
function toTwoDigits(v) {
    v = Math.round(v);
    v = Math.min(255, Math.max(0, v));
    var twoDigits = "" + v.toString(16);
    while (twoDigits.length < 2) {
        twoDigits = '0' + twoDigits;
    }
    return twoDigits;
}

function valueToGray(value) {
    var twoDigits = toTwoDigits(value);
    return '#' + twoDigits + twoDigits + twoDigits;
}

valueToGray.title = 'Gray';

function valueToLightGray(value) {
    return valueToGray(255 * Math.sqrt(value / 255));
}

valueToLightGray.title = 'Light Gray';

function valueToColourful(value) {
    var b = value * 1;
    var g = value * 5;
    var r = value * 20;
    return '#' + toTwoDigits(r) + toTwoDigits(g) + toTwoDigits(b);    
}

valueToColourful.title = 'Colourful';


// Except for the black and white, all other colours are from the coloured Sololearn logo.
var sololearnColours = {
    "0": "#000000",
    "32": '#6cb94f',
    "64": '#ef7542',
    "96": '#ea5460',
    "128": '#eb589f',
    "180": '#2fb7e9',
    "213": '#148d9e',
    "255": '#ffffff'
};

// Convert the colours to an Array of 3 integers(0-255) so this string manipulation doesn't 
// need to be done in valueToSololearnColours function which is called much more often.
function convertSololearnColoursToArrays() {
    for (var key in sololearnColours) {
        if (!isNaN(key)) {
            var hexDigits = sololearnColours[key].substring(1); 
            var vals = [];
            for (var i = 0; i < 3; i++) {
                vals.push(parseInt(hexDigits.substring(i * 2, i * 2 + 2), 16));
            }
            sololearnColours[key] = {
                'hex': sololearnColours[key],
                'array': vals
            };
        }
    }
}

convertSololearnColoursToArrays();

function valueToSololearnColours(value) {
    var min, max;
    
    // Try to find the upper and lower boundary colour for the specified value.
    for (var key in sololearnColours) {
        if (!isNaN(key)) {
            key = parseInt(key);
            if (key < value && (key > min || min === undefined)) {
                min = key;
            }
            if (key > value && (key < max || max === undefined)) {
                max = key;
            }
        }
    }
    if (max === undefined) {
        return sololearnColours['255'].hex;
    }
    if (min === undefined) {
        return sololearnColours['0'].hex;
    }
    
    // Now that we have both upper and lower boundaries, average the 2 colours.
    // The closer value is to min, the more the resulting colour should match 
    // the min colour and vice versa.
    var ratio = (value - min) / (max - min);
    var ratio2 = 1 - ratio;
    max = sololearnColours['' + max];
    min = sololearnColours['' + min];
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var val = ratio * max.array[i] + ratio2 * min.array[i];
        val = Math.floor(val); // eliminate any decimals or fractional parts.
        val = val.toString(16); // convert to hex.
        while (val.length < 2) { // Make sure there are exactly 2 hex digits.
            val = '0' + val;
        }
        colour += val; // Concatenate the 2 hex digits to the resulting string.
    }
    return colour;
}

valueToSololearnColours.title = 'Sololearn Colours';