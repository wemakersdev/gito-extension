import type { IAction, IOvermind } from "./store";

export interface NavbarTab{
	name: string
	tooltip: string
	label: string
}

export interface INavbarState{
	visible: boolean
	tabs: NavbarTab[]
	active: string
}


export const navbarState: INavbarState = {
	visible: true,
	active: "feed",
	tabs: [
		{
			name: "feed",
			label: "Feed",
			tooltip: "Explore your Feed"
		},

		{
			name: "gitos",
			label: "Gitos",
			tooltip: "Explore your Gitos"
		},

		{
			name: "blogs",
			label: "Blogs",
			tooltip: "Explore your Blogs"
		},
	]
}


export interface INavbarActions {
	setActive: IAction<{name: string}, any>,
	hide: IAction<any, any>
	show: IAction<any, any>
	toggle: IAction<any, any>
}


export const navbarActions: INavbarActions = {
	setActive: ({state}, {name}) => {
		state.app.navbar.active = name;
	},
	hide: ({state}) => state.app.navbar.visible = false,
	show: ({state}) => state.app.navbar.visible = true,
	toggle: ({state}) => state.app.navbar.visible  = !state.app.navbar.visible
}
