import type {WebviewApi} from 'vscode-webview';
import type { IOvermind } from '../overmind/store';


export const acquireVsCodeApiMock = ():WebviewApi<IOvermind> => {
	const STORAGE_KEY = "WEBVIEW_STATE_STORE";	

	const api: WebviewApi<IOvermind> = {
		postMessage: (message: any) => {

			const dispatch = (data: any) => {

				message.data = data
				window.dispatchEvent(new MessageEvent("message", {
					data: message
				}));
			}

			switch(message.type){
				case "request-author-data": {
					dispatch({
						authorId: "some-author-id",
						authorName: "some-author-name"
					});
					break;
				}
			}
			
		},
		setState: (newState: any = {}): any=> {
			// debugger
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
			return newState;
		},
		getState: (): any => {
			const str = window.localStorage.getItem(STORAGE_KEY);

			if(str){
				const state = JSON.parse(str);
				// debugger
				return state;
			}

			return null;
		}
	};

	return api
}