import type {WebviewApi} from 'vscode-webview';
import type { IOvermind } from '../overmind/store';

let state:any = {}

export const acquireVsCodeApiMock = ():WebviewApi<IOvermind> => {	
	
	const api: WebviewApi<IOvermind> = {
		postMessage: (message) => {},
		setState: (newState): any=> {
			state = newState;
			return state
		},
		getState: (): any => state
	};

	return api
}