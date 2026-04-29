import { colord } from 'colord';
// Note: colord cmyk plugin must already be extended (done in convert.js)

export const HUE_GRADIENT =
	'linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';

/**
 * Build the CSS gradient strings for each channel of the given color space.
 * Returns an array matching the channel order defined in colorSpaces.js.
 * @param {string} colorSpace
 * @param {{ hsl: object, rgb: object, cmyk: object, hsv: object }} channels
 * @returns {string[]}
 */
export function getGradients(colorSpace, channels) {
	const { hsl, rgb, cmyk, hsv } = channels;

	switch (colorSpace) {
		case 'hsl':
			return [
				HUE_GRADIENT,
				`linear-gradient(90deg, hsl(${hsl.h} 0% ${hsl.l}%) 0%, hsl(${hsl.h} 100% ${hsl.l}%) 100%)`,
				`linear-gradient(90deg, hsl(${hsl.h} ${hsl.s}% 0%) 0%, hsl(${hsl.h} ${hsl.s}% 50%) 50%, hsl(${hsl.h} ${hsl.s}% 100%) 100%)`
			];

		case 'rgb':
			return [
				`linear-gradient(90deg, rgb(0,${rgb.g},${rgb.b}) 0%, rgb(255,${rgb.g},${rgb.b}) 100%)`,
				`linear-gradient(90deg, rgb(${rgb.r},0,${rgb.b}) 0%, rgb(${rgb.r},255,${rgb.b}) 100%)`,
				`linear-gradient(90deg, rgb(${rgb.r},${rgb.g},0) 0%, rgb(${rgb.r},${rgb.g},255) 100%)`
			];

		case 'cmyk':
			return [
				`linear-gradient(90deg, ${colord({ c: 0, m: cmyk.m, y: cmyk.y, k: cmyk.k }).toHex()} 0%, ${colord({ c: 100, m: cmyk.m, y: cmyk.y, k: cmyk.k }).toHex()} 100%)`,
				`linear-gradient(90deg, ${colord({ c: cmyk.c, m: 0, y: cmyk.y, k: cmyk.k }).toHex()} 0%, ${colord({ c: cmyk.c, m: 100, y: cmyk.y, k: cmyk.k }).toHex()} 100%)`,
				`linear-gradient(90deg, ${colord({ c: cmyk.c, m: cmyk.m, y: 0, k: cmyk.k }).toHex()} 0%, ${colord({ c: cmyk.c, m: cmyk.m, y: 100, k: cmyk.k }).toHex()} 100%)`,
				`linear-gradient(90deg, ${colord({ c: cmyk.c, m: cmyk.m, y: cmyk.y, k: 0 }).toHex()} 0%, ${colord({ c: cmyk.c, m: cmyk.m, y: cmyk.y, k: 100 }).toHex()} 100%)`
			];

		case 'hsv':
			return [
				HUE_GRADIENT,
				`linear-gradient(90deg, ${colord({ h: hsv.h, s: 0, v: hsv.v }).toHex()} 0%, ${colord({ h: hsv.h, s: 100, v: hsv.v }).toHex()} 100%)`,
				`linear-gradient(90deg, ${colord({ h: hsv.h, s: hsv.s, v: 0 }).toHex()} 0%, ${colord({ h: hsv.h, s: hsv.s, v: 100 }).toHex()} 100%)`
			];

		default:
			return [];
	}
}
