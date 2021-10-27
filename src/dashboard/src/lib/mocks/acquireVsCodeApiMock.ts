import type {WebviewApi} from 'vscode-webview';
import type { IOvermind } from '../overmind/store';

let state:any = {}

export const acquireVsCodeApiMock = ():WebviewApi<IOvermind> => {	
	
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
		setState: (newState): any=> {
			state = newState;
			return state
		},
		getState: (): any => state
	};

	return api
}