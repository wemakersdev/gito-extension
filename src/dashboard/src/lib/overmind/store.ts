
import { createOvermind } from 'overmind';
import { createMixin } from 'overmind-svelte';
import { appMetaInfo } from './appMetaInfo';
import { navbarState, navbarActions } from './navbar';
import { navigate } from 'svelte-navigator';
import { blogActions } from './blog';
import { Connector,Message } from '../helpers/connector';
import isPrimitive from 'is-primitive';
//@ts-ignore
import get from 'lodash.get'
//@ts-ignore
import set from 'lodash.set'

import type {WebviewApi} from "vscode-webview";
import type { Writable } from 'svelte/store';
import type {IContext} from 'overmind';
import type {INavbarActions, INavbarState} from './navbar'
import type {AnyFunction, ParametersExceptFirst} from './common';
import type {IBlogActions} from './blog';
import type { NavigateOptions} from 'svelte-navigator';
import type {EventProps} from '../helpers/connector'
import type {NavigatorLocation} from 'svelte-navigator'

export interface FeedItem{
	url: string,
	type: "blog" | "gito"
}

export interface ISection{
	name: string,
	label: string,
	tooltip: string,
}

export interface IAppMetaInfo{
	name: string
	description: string
	org: string
	homepage: string
	support: string
}


export interface IApp{
	skipIntro: boolean,
	navbar: INavbarState,
	location?: string
}

export interface IState{
	appMeta: IAppMetaInfo
	vscode: WebviewApi<any>
	feedItems: FeedItem[]
	app: IApp,
	connector: Connector,
	author?: {
		id: string
		name: string
	},
	persistentKeys: string[]
}


export interface IOvermind{
	state: IState,
	actions: IActions
	
}



export type IAction<P, O> = (context: IContext<IOvermind>, payload: P) => O 


export interface IActions {
	fetchFeedItems: IAction<any, any>
	handleSkipInto: IAction<any, any>,
	loadAuthorInfo: IAction<any, any>,
	navbar: INavbarActions,
	blog: IBlogActions,
	skipIntro: IAction<any, any>,
	navigate: IAction<{to: string, navigateOptions?: NavigateOptions}, any>
	save: IAction<any, any>
	load: IAction<any, any>
	handleLocationChange: IAction<NavigatorLocation, any>
}

export type StoredStateItem = [string, any];
export type StoredState = StoredStateItem[]




export type exposedAction<T extends AnyFunction> = (...args: ParametersExceptFirst<T>) =>  T

export type IOvermindAction<T> = {
	[K in keyof T]: T[K] extends AnyFunction ? exposedAction<T[K]> : IOvermindAction<T[K]>
};

const vscodeApi = acquireVsCodeApi()
const overmind: IOvermind = {
  state: {
	
	appMeta: appMetaInfo,
	vscode: vscodeApi,
	feedItems: [],
	app: {
		skipIntro: false,
		navbar: navbarState
	},
	connector: new Connector({
		addEventListener: window.addEventListener.bind(window),
		postMessage: vscodeApi.postMessage
	}),
	persistentKeys: ["app.skipIntro", "app.location"], 
  },	
  actions: {
    fetchFeedItems: ({state}) => {
		
	},

	handleSkipInto: ({state}) => {
		state.app.skipIntro = true
	},

	skipIntro: ({state, actions}) => {
		actions.handleSkipInto();
		actions.navigate({to: "feed"});
		actions.save();
	},

	navigate: ({state, actions}, {to, navigateOptions}) => {
		window.location.hash = to;

		state.app.location = to;
		actions.save();
	},

	loadAuthorInfo: async({state, actions}) =>{
		const msg = new Message<any>({
			type: "request-author-data",
			data: {}
		});

		const res:any = await state.connector.sendMessage(msg);
		state.author = {
			id: res.authorId,
			name: res.authorName
		};
	},

	load: ({state, actions}) => {
		const _state: any = state.vscode.getState();
		if(_state && _state.length){
			_state.forEach(([key, value]: StoredStateItem) => {
				set(state, key, value);
			});
		}
		return false;
	},

	save: ({state, actions}) => {
		const _state = state.persistentKeys.map((key) => {
			return [key, get(state, key)];
		});
		state.vscode.setState(_state);
		return true;
	},

	handleLocationChange: ({state, actions}, loc) => {
		// state.app.location = loc;
		// actions.save();
	},

	navbar: navbarActions,
	blog: blogActions
  }
};

const store = createMixin(createOvermind(overmind));
export const state = store.state as Writable<IState>;

export const actions = store.actions as IOvermindAction<IActions>;

