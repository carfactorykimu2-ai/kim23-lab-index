/** Turns a free-text magazine name into a filesystem/URL-safe slug, keeping non-Latin scripts readable. */
export function slugifyMagazine(name: string): string {
	return name
		.trim()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');
}
