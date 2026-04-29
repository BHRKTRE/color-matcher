import { colord } from 'colord';

export const WAVELENGTH_MIN = 380;
export const WAVELENGTH_MAX = 780;

export const WAVELENGTH_GRADIENT =
	'linear-gradient(90deg, #610061 0%, #8100cc 10%, #2e00ff 20%, #007bff 30%, #00efff 40%, #0fff00 50%, #7eff00 60%, #d2ff00 70%, #ffd900 80%, #ff7e00 90%, #ff0000 100%)';

/**
 * Convert a wavelength in nanometres (380–780 nm) to a hex colour.
 * Uses piecewise linear RGB approximation with gamma 0.8.
 * @param {number} nm
 * @returns {string} hex
 */
export function wavelengthToHex(nm) {
	const w = parseFloat(nm);
	let r, g, b, factor;

	if (w >= 380 && w < 440) {
		r = -(w - 440) / (440 - 380);
		g = 0.0;
		b = 1.0;
	} else if (w >= 440 && w < 490) {
		r = 0.0;
		g = (w - 440) / (490 - 440);
		b = 1.0;
	} else if (w >= 490 && w < 510) {
		r = 0.0;
		g = 1.0;
		b = -(w - 510) / (510 - 490);
	} else if (w >= 510 && w < 580) {
		r = (w - 510) / (580 - 510);
		g = 1.0;
		b = 0.0;
	} else if (w >= 580 && w < 645) {
		r = 1.0;
		g = -(w - 645) / (645 - 580);
		b = 0.0;
	} else if (w >= 645 && w <= 780) {
		r = 1.0;
		g = 0.0;
		b = 0.0;
	} else {
		r = 0.0;
		g = 0.0;
		b = 0.0;
	}

	if (w >= 380 && w < 420) factor = 0.3 + (0.7 * (w - 380)) / (420 - 380);
	else if (w >= 420 && w < 701) factor = 1.0;
	else if (w >= 701 && w <= 780) factor = 0.3 + (0.7 * (780 - w)) / (780 - 700);
	else factor = 0.0;

	const gamma = 0.8;
	const R = Math.round(r > 0 ? 255 * Math.pow(r * factor, gamma) : 0);
	const G = Math.round(g > 0 ? 255 * Math.pow(g * factor, gamma) : 0);
	const B = Math.round(b > 0 ? 255 * Math.pow(b * factor, gamma) : 0);

	return colord(`rgb(${R},${G},${B})`).toHex();
}
