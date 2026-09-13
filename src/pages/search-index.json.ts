import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const articles = await getCollection('articles');

	const index = articles.map((article) => ({
		id: article.id,
		title: article.data.title,
		summary: article.data.summary ?? '',
		date: article.data.date ? article.data.date.toISOString().slice(0, 10) : '',
		magazine: article.data.magazine,
		tags: article.data.tags,
		category: article.data.category ?? '',
		car_model: article.data.car_model ?? '',
		ecu: article.data.ecu,
		device: article.data.device ?? '',
		can_id: article.data.can_id ?? '',
	}));

	return new Response(JSON.stringify(index), {
		headers: { 'Content-Type': 'application/json' },
	});
};
