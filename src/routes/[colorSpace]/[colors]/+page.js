import { decodeState } from '$lib/url.js';
import { error } from '@sveltejs/kit';

export function load({ params, url }) {
	const state = decodeState(`/${params.colorSpace}/${params.colors}`, url.searchParams);
	if (!state) throw error(404, 'Invalid color URL');
	return state;
}
