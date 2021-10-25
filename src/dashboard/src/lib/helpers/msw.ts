import { setupWorker, rest } from 'msw';
import type { IBlog } from './../overmind/blog';
import demoData from './demoData.json';
import { API_URL } from './constants';


const worker = setupWorker(
	rest.get<IBlog[]>(`${API_URL}/get-blog-feed`, (req, res, ctx) => {
		return res(
			ctx.json(demoData.blogs)
		);
	}),

	rest.get<IBlog>(`${API_URL}/get-blog`, (req, res, ctx) => {
		const blogId = req.url.searchParams.get("blogId");
		const blog = demoData.blogs.find(item => item.id === blogId);
		// console.log({blogId, blog, req})
		return res(
			ctx.json(blog)
		);
	}),
);
worker.start();