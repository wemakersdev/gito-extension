import fetch from 'node-fetch';
import { Author, getAuthorContext } from './context';

const API_URL = `https://upload.notebrowser.com`

export const uploadData = async (key: string, data: any, author: Author = getAuthorContext()) => {
	try{
		const serializedData = JSON.stringify(data);
		const url = `${API_URL}/upload-folder?id=${encodeURI(author.username)}&path=${encodeURI(key)}`;

		const res = await fetch(url, {
			method: "POST",
			body: Buffer.from(serializedData)
		});

		const resBody = await res.json();

		return resBody
	}catch(err){
		console.log(err);
		throw err;
	}
};
