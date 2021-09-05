
// This was copied from
// https://github.com/micro-js/hsv-to-rgb/blob/master/lib/index.js
// with some fixes mentioned at
// https://github.com/micro-js/hsv-to-rgb/issues

export function hsvToRGB(h, s, v) {
	const oldH=h,oldS=s,oldV=v;
	v*=255;
	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = Math.round(v * (1 - s));
	var q = Math.round(v * (1 - f * s));
	var t = Math.round(v * (1 - (1 - f) * s));

	v = Math.round(v);
	switch (i % 6) {
	case 0:
		return [v, t, p];
	case 1:
		return [q, v, p];
	case 2:
		return [p, v, t];
	case 3:
		return [p, q, v];
	case 4:
		return [t, p, v];
	case 5:
		return [v, p, q];
  }
};