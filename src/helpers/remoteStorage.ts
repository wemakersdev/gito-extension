import fetch from 'node-fetch';
import {   getAuthorContext, getGqlClientContext } from './context';
import {Author} from './author';
import { runMutation } from './graphql';
import { addBlog, updateAuthor, updateBlog } from './mutations';
import atob from 'atob';

export const uploadData = async (key: string, data: any,doesExist: boolean, author: Author = getAuthorContext()) => {
	try{

		let k = atob(key);


		const client = getGqlClientContext();

		if(doesExist){
			const res = await runMutation({
				client,
				mutation: updateBlog,
				variables: {
					blogPost: {
						filter: {
							id: data.id,
						},
						set: {
							content: data.content,
						}
					}
				}
			});

			const id = res.data.updateBlogPost.blogPost[0].id;

			return {res, id};

		}else{

			const res = await runMutation({
				client,
				mutation: addBlog,
				variables: {
					blogPost: [{
						title: k,
						content: data.content,
						author: {
							id: data.authorId
						}
					}]
				}
			});
			
			const id = res.data.addBlogPost.blogPost[0].id;

			if(id){
				await runMutation({
					mutation: updateAuthor,
					client,
					variables: {
						author: {
							filter: {
								id: data.authorId,
							},
							set: {
								blogs: {id}
							}
						}
					}
				});
			}

			return {res, id};
		}

		// const url = `${API_URL}/upload-folder?id=${encodeURI(author.id)}&path=${encodeURI(key)}`;

		// const res = await fetch(url, {
		// 	method: "POST",
		// 	body: Buffer.from(serializedData)
		// });

		// const resBody = await res.json();
		// return resBody
	}catch(err){
		console.log(err);
		throw err;
	}
};
