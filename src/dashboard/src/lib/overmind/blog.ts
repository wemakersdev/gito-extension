
import { API_URL } from '../helpers/constants';
import type { IAction } from './store';
import { getGqlClient, runQuery } from './../helpers/gql';
import {getAllBlogPosts, getBlogPost} from './../graphql/queries'


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
	id?:string
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
		const client = getGqlClient();
		const res = await runQuery({
			query: getAllBlogPosts,
			client
		});
		
		const blogs: IBlog[] = res.data.queryBlogPost.map((item:any) => {

			const blog:IBlog = {
				content: item.content,
				title: item.title,
				author: item.author.id,
				upvotes: item.upvotes || 0,
				downvotes: item.downvotes || 0,
				id: item.id,
				url: `/blog/${item.id}`,
				contentUrl: "",
				lineMetaInfo: []
			};
			return blog;
		});

		return blogs.reverse();
	},

	getBlog: async ({state}, {blogId}): Promise<IBlog> => {
		const client = getGqlClient();
		const res = await runQuery({
			query: getBlogPost,
			client,
			variables: {
				blogPostFilter: {
					id: blogId
				}
			}
		});

		const item = res.data.queryBlogPost[0];

		const blog: IBlog = {
			content: item.content,
			title: item.title,
			author: item.author.id,
			upvotes: item.upvotes || 0,
			downvotes: item.downvotes || 0,
			id: item.id,
			url: `/blog/${item.id}`,
			contentUrl: "",
			lineMetaInfo: []
		};

		return blog
	}
};
