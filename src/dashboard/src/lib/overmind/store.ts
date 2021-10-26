
import { createOvermind } from 'overmind';
import { createMixin } from 'overmind-svelte';
import { appMetaInfo } from './appMetaInfo';
import { navbarState, navbarActions } from './navbar';
import { navigate } from 'svelte-navigator';
import { blogActions } from './blog';

import type {WebviewApi} from "vscode-webview";
import type { Writable } from 'svelte/store';
import type {IContext} from 'overmind';
import type {INavbarActions, INavbarState} from './navbar'
import type {AnyFunction, ParametersExceptFirst} from './common';
import type {IBlogActions} from './blog';
import type { NavigateOptions} from 'svelte-navigator';


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
	navbar: INavbarState
}

export interface IState{
	appMeta: IAppMetaInfo
	vscode: WebviewApi<any>
	feedItems: FeedItem[]
	app: IApp,
}


export interface IOvermind{
	state: IState,
	actions: IActions
}



export type IAction<P, O> = (context: IContext<IOvermind>, payload: P) => O 


export interface IActions {
	fetchFeedItems: IAction<any, any>
	handleSkipInto: IAction<any, any>,
	navbar: INavbarActions,
	blog: IBlogActions,
	skipIntro: IAction<any, any>,
	navigate: IAction<{to: string, navigateOptions?: NavigateOptions}, any>
}




export type exposedAction<T extends AnyFunction> = (...args: ParametersExceptFirst<T>) =>  T

export type IOvermindAction<T> = {
	[K in keyof T]: T[K] extends AnyFunction ? exposedAction<T[K]> : IOvermindAction<T[K]>
};

const overmind: IOvermind = {
  state: {
	appMeta: appMetaInfo,
	vscode: acquireVsCodeApi(),
	feedItems: [],
	app: {
		skipIntro: false,
		navbar: navbarState
	}
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
	},

	navigate: ({state}, {to, navigateOptions}) => {
		window.location.hash = to;
	},

	navbar: navbarActions,
	blog: blogActions
  }
};

const store = createMixin(createOvermind(overmind));
export const state = store.state as Writable<IState>;

export const actions = store.actions as IOvermindAction<IActions>;

