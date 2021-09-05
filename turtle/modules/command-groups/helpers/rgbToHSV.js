/*
Converted from the rgb_to_hsv function defined at:
https://github.com/python/cpython/blob/3.12/Lib/colorsys.py
*/
export function rgbToHSV(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
    const maxc = Math.max(r, g, b);
    const minc = Math.min(r, g, b);
    const rangec = (maxc-minc);
    const v = maxc;
    if (minc === maxc)
        return [0.0, 0.0, v];
    const s = rangec / maxc;
    const rc = (maxc - r) / rangec;
    const gc = (maxc - g) / rangec;
    const bc = (maxc - b) / rangec;
	let h;
    if (r === maxc)
        h = bc - gc;
    else if (g === maxc)
        h = 2.0 + rc - bc;
    else
        h = 4.0 + gc - rc;
    h = (h / 6.0) % 1.0;
    return [h, s, v];
};