/**
 * @file extension context
 * @author netcon
 */

import * as vscode from 'vscode';
import { GITHUB_OAUTH_TOKEN } from './constants';
import { GitoRecording } from './recorder';

let extensionContext: vscode.ExtensionContext | null = null;
let gitoContext: GitoRecording | null = null

export const setExtensionContext = (
	_extensionContext: vscode.ExtensionContext
) => {
	extensionContext = _extensionContext;
};

export const getExtensionContext = (): vscode.ExtensionContext => {
	if (!extensionContext) {
		throw new Error('extension context initialize failed!');
	}

	return extensionContext;
};


export const setGitoContext = (
	_gitoContext: GitoRecording
) => {
	gitoContext = _gitoContext;
};

export const getGitoContext = (): GitoRecording => {
	if (!gitoContext) {
		throw new Error('gito context initialize failed!');
	}

	return gitoContext;
};

export const getOAuthToken = () => {
	const context = getExtensionContext();
	return (context.globalState.get(GITHUB_OAUTH_TOKEN) as string) || '';
};



export const hasValidToken = () => getOAuthToken() !== '';

