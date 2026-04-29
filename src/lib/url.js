const VALID_SPACES = ['hsl', 'hsv', 'rgb', 'cmyk'];

/**
 * @param {{ colorSpace: string, hexColors: string[], compareSizes: number[] }} state
 * @returns {string} e.g. "/hsl/63474d-aa767c-d6a184?s=40-17.5"
 */
export function encodeState({ colorSpace, hexColors, compareSizes }) {
	const colors = hexColors.map((h) => h.replace(/^#/, '')).join('-');
	let url = `/${colorSpace}/${colors}`;
	if (hexColors.length >= 2) {
		const sizes = compareSizes.slice(0, hexColors.length - 1).join('-');
		url += `?s=${sizes}`;
	}
	return url;
}

/**
 * @param {string} pathname - e.g. "/hsl/63474d-aa767c"
 * @param {URLSearchParams} searchParams
 * @returns {{ colorSpace: string, hexColors: string[], compareSizes: number[] } | null}
 */
export function decodeState(pathname, searchParams) {
	try {
		const [colorSpace, colorsStr] = pathname.replace(/^\//, '').split('/');
		if (!colorSpace || !colorsStr) return null;
		if (!VALID_SPACES.includes(colorSpace)) return null;
		const hexColors = colorsStr.split('-').map((h) => '#' + h);
		if (hexColors.length < 1 || hexColors.length > 3) return null;
		if (!hexColors.every((h) => /^#[0-9a-fA-F]{6}$/.test(h))) return null;

		const DEFAULT_SIZE = 32.5;
		let compareSizes = [DEFAULT_SIZE, DEFAULT_SIZE];
		const s = searchParams?.get('s');
		if (s) {
			const parts = s.split('-').map(Number);
			if (parts.length >= 1 && isFinite(parts[0])) compareSizes[0] = parts[0];
			if (parts.length >= 2 && isFinite(parts[1])) compareSizes[1] = parts[1];
		}

		return { colorSpace, hexColors, compareSizes };
	} catch {
		return null;
	}
}
