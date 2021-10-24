
import { createOvermind } from 'overmind';
import { createMixin } from 'overmind-svelte';
import type {WebviewApi} from "vscode-webview";
import type { Writable } from 'svelte/store';
import type {IContext} from 'overmind'

let acquireVsCodeApi =  (): any=> {}


export interface FeedItem{
	url: string,
	type: "blog" | "gito"
}

export interface ISection{
	name: string,
	label: string,
	tooltip: string,
}


export interface IState{
	vscode: WebviewApi<any>,
	feedItems: FeedItem[]
}

export interface IOvermind{
	state: IState,
	actions: IActions
}

export type IAction<P, O> = (context: IContext<IOvermind>, payload: P) => O;

export interface IActions {
	fetchFeedItems: IAction<any, any>
}

const overmind: {
	state: IState,
	actions: IActions
} = {
  state: {
	vscode: acquireVsCodeApi(),
	feedItems: []
  },
  actions: {
    fetchFeedItems: ({state, actions}) => {
		state.feedItems = [{
			url: "1",
			type: "blog",
		}, {
			url: "2",
			type: "gito",
		}];
	},
  }
};

const store = createMixin(createOvermind(overmind));
export const state = store.state as Writable<IState>;
export const actions = store.actions as IActions;