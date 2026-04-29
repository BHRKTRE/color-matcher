import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(302, '/hsl/0f2852');
}
