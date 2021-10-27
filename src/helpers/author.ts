import { uid } from 'uid';
import { GlobalStore } from './globalStore';
import { getGqlClientContext, setAuthorContext } from './context';
import * as vscode from 'vscode'
import { runQuery, runMutation } from './graphql';
import { createAuthor } from './mutations';
import { inform } from './notifications';


const randomWords = require("random-words");

const AUTHOR_STORAGE_KEY_NAME = "author";

export interface Author {
	id?: string
	name?: string,
}

export const generateAuthor = (): Author => {
	return {
		name: randomWords(3, { exactly: 3 }).join("-"),
	};
};

export const saveAuthor = async (author: Author, context: vscode.ExtensionContext) => {
	try{

		const store = new GlobalStore(context);
		const client = getGqlClientContext();
		const res = await runMutation({client, mutation: createAuthor, variables: {
			author: [{
				name: author.name,
			}]
		}});

		const id = res.data.addAuthor.author[0].id;
		author.id = id;
	  await store.setData(AUTHOR_STORAGE_KEY_NAME, author);
	}catch(err){
		inform(`Unable to create user: ${err.message}`);
	}
};



export const getAuthor = async (context: vscode.ExtensionContext): Promise<Author> => {
	const store = new GlobalStore(context);
	const data = <Author>await store.getData(AUTHOR_STORAGE_KEY_NAME);
	// debugger

	if (data) {
		throw new Error(`Unable to find author`);
	}
	return data;
};


export const handleAuthor = async (context) => {
	let author: Author;
	try {
		author = await getAuthor(context);
		if (!author) {
			throw new Error(`Author not found`)
		}
	} catch (err) {
		console.error(err);
		author = generateAuthor();
		await saveAuthor(author, context);
	}
	setAuthorContext(author);
};