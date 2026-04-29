import { colord, extend, random } from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
extend([cmykPlugin]);

/**
 * Derive all color space channel values from a hex string.
 * @param {string} hex
 * @returns {{ hsl: object, rgb: object, cmyk: object, hsv: object }}
 */
export function hexToChannels(hex) {
	const c = colord(hex);
	return {
		hsl: c.toHsl(),
		rgb: c.toRgb(),
		cmyk: c.toCmyk(),
		hsv: c.toHsv()
	};
}

/**
 * Convert the active color-space channel values back to hex.
 * @param {string} colorSpace
 * @param {{ hsl: object, rgb: object, cmyk: object, hsv: object }} channels
 * @returns {string} hex
 */
export function channelsToHex(colorSpace, channels) {
	switch (colorSpace) {
		case 'hsl':
			return colord(channels.hsl).toHex();
		case 'rgb':
			return colord(channels.rgb).toHex();
		case 'cmyk':
			return colord(channels.cmyk).toHex();
		case 'hsv':
			return colord(channels.hsv).toHex();
		default:
			return '#000000';
	}
}

export function isValidHex(hex) {
	return colord(hex).isValid();
}

export function randomHex() {
	return random().toHex();
}

export function invertHex(hex) {
	return colord(hex).invert().toHex();
}

export function rotateHex(hex, degrees) {
	return colord(hex).rotate(degrees).toHex();
}
