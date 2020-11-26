import fetch from 'node-fetch';

export function validateTag(tag: string, encode = false): string | false {
	if (!tag) return false;
	const _tag = tag.toUpperCase().replace(/O/g, '0').replace('#', '');
	const tagRegex = /[0289PYLQGRJCUV]{3,9}/g;
	const result = tagRegex.exec(_tag);
	return result ? encode ? encodeURIComponent(`#${result[0]}`) : `#${result[0]}` : false;
}

export async function fetchURL(url: string, token: string, timeout: number) {
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json'
		},
		timeout
	});
	if (res.status !== 200) return { response: { status: res.status, ok: res.status === 200 } };
	const output = await res.json();
	return {
		...output,
		response: {
			status: res.status,
			ok: res.status === 200
		}
	};
}

export function parseSupercellTime(time: string) {
	return new Date(`${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}T${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13)}`).getTime();
}
