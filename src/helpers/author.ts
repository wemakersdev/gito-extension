import { uid } from 'uid';
import { GlobalStore } from './globalStore';
import { setAuthorContext } from './context';
import * as vscode from 'vscode'


const randomWords = require("random-words");

const AUTHOR_STORAGE_KEY_NAME = "author";

export interface Author {
	id: string
	username?: string,
	email?: string
	subscriptions?: any[]
}

export const generateAuthor = (): Author => {
	return {
		id: uid(),
		username: randomWords(3, { exactly: 3 }).join("-"),
		email: "",
		subscriptions: [],
	};
};

export const saveAuthor = async (author: Author, context: vscode.ExtensionContext) => {
	const store = new GlobalStore(context);
	await store.setData(AUTHOR_STORAGE_KEY_NAME, author);
};



export const getAuthor = async (context: vscode.ExtensionContext): Promise<Author> => {
	const store = new GlobalStore(context);
	const data = <Author>await store.getData(AUTHOR_STORAGE_KEY_NAME);

	if (data) {
		throw new Error(`Unable to find author`);
	}
	return data;
};


export const handleAuthor = async (context) => {
	let author: Author;
	try {
		author = await getAuthor(context);;
		if (!author) {
			throw new Error(`Author not found`)
		}
	} catch (err) {
		console.error(err);
		author = generateAuthor();
		await saveAuthor(author, context);
	}
	// debugger
	setAuthorContext(author);
};