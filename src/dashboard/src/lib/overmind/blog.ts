
import { API_URL } from '../helpers/constants';
import type { IAction } from './store';


export interface LineMetaInto{
	start: number,
	end: number,
	author: string
	comment: string
	upvote: boolean
	downvote: boolean
}

export interface IBlog {
	url: string,
	contentUrl: string,
	content?: string
	title: string
	author: string
	upvotes: number
	downvotes: number
	lineMetaInfo: LineMetaInto[]
}

export interface IBlogActions{
	fetchBlogContent: IAction<{url: string}, Promise<string>>,
	fetchBlogFeed: IAction<{userId: string}, Promise<IBlog[]>>
	fetchBlogFeedWithContent: IAction<{userId: string}, Promise<IBlog[]>>
	getBlog: IAction<{blogId: string}, Promise<IBlog>>
}


export const blogActions: IBlogActions = {
	fetchBlogContent: async ({}, {url}): Promise<string> => {
		try{
			const content:string =  await fetch(url).then(res => res.text());
			return content
		}catch(err:any){
			console.error(err.message);
			throw err
		}
	},

	fetchBlogFeed: async ({}, {userId}): Promise<IBlog[]> => {
		const url = new URL(API_URL);
		url.pathname = "get-blog-feed";
		url.searchParams.append("userId", userId);
		const feed: IBlog[] = await fetch(url.href).then(res => res.json());
		return feed;
	},

	fetchBlogFeedWithContent: async ({actions}, {userId}) => {
		const url = new URL(API_URL);
		url.pathname = "get-blog-feed";
		url.searchParams.append("userId", userId);
		const feed: IBlog[] = await fetch(url.href).then(res => res.json());
		const feedWithContent = await Promise.all(feed.map(async item => {
			try{
				//@ts-ignore
				const content = await actions.blog.fetchBlogContent({userId});
				return content;
			}catch(err){
				return {
					error: err
				};
			}
		}));

		return feedWithContent.filter(item => !item.error);
	},

	getBlog: async ({state}, {blogId}): Promise<IBlog> => {
		const url = new URL(API_URL);
		url.pathname = "/get-blog";
		url.searchParams.append("blogId", blogId);
		const blog:IBlog = await fetch(url.href).then(res => {
			return res.json();
		});

		return blog;
	}
};
