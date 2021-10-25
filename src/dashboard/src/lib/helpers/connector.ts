
import { acquireVsCodeApiMock } from '../mocks/acquireVsCodeApiMock'
import type { AnyFunction } from '../overmind/common';
import {TinyEmitter} from 'tiny-emitter';

(globalThis as any).acquireVsCodeApi = globalThis.acquireVsCodeApi || acquireVsCodeApiMock

export interface IMessage<T>{
	type: string
	data: T
	id: string
}

export type PostMessage = <T>(message: IMessage<T>) => any;
export type AddEventListener = (eventType: string, callback: (event: MessageEvent) => any) => any 


export interface IConnectorOptions{
	postMessage: PostMessage
	addEventListener: AddEventListener
}


export interface EventProps extends MessageEvent{
	reply?: (message: IMessage<any>) => any
}


export class Connector extends TinyEmitter{
	public messagesQueue: IMessage<any>[] = [];
	public postMessage: PostMessage
	public addEventListener: AddEventListener
	
	constructor(options: IConnectorOptions){
		super();
		this.addEventListener =options.addEventListener
		this.postMessage = options.postMessage

		this.addEventListener("message", this.onMessage.bind(this));
	}
	
	onMessage(event: EventProps){
		event.reply = (message) => {
			message.id = event.data.id;
			this.sendMessage(message);
		};
		this.emit("message", event);
	}
	
	addMessageListener<T>(callback: (message: IMessage<T>) => any): AnyFunction {

		const _callback = (event: MessageEvent) => {
			callback(event.data);
			this.onMessage(event.data);
		};

		this.addEventListener("message", _callback);

		return () => window.removeEventListener("message", _callback);
	}


	sendMessage<T>(message: IMessage<T>){
		return new Promise((res, rej) => {
			this.postMessage(message);
			const dispose = this.addMessageListener<T>((reply) => {
				if(reply.id === message.id){
					dispose();
					res(reply);
				}
			});
		});
	}
}