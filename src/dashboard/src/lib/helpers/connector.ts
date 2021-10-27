
import { acquireVsCodeApiMock } from '../mocks/acquireVsCodeApiMock'
import type { AnyFunction } from '../overmind/common';
import {TinyEmitter} from 'tiny-emitter';
import { uid } from 'uid';

(globalThis as any).acquireVsCodeApi = globalThis.acquireVsCodeApi || acquireVsCodeApiMock


export interface IMessage<T>{
	type: string
	data: T
	id: string
	isReply?: boolean
}

export class Message<T> implements IMessage<T>{
	public type = "data";
	public id = uid();
	public data = {} as T;
	public isReply = false;
	
	constructor(options: Partial<IMessage<T>> = {}){
		Object.assign(this, options);
	}
}

export type PostMessage = <T>(message: IMessage<T>) => any;
export type AddEventListener = (eventType: string, callback: (event: MessageEvent) => any) => any 


export interface IConnectorOptions{
	postMessage: PostMessage
	addEventListener: AddEventListener
}


export interface EventProps extends MessageEvent{
	reply?: (reply: any) => any
}


export class Connector extends TinyEmitter{
	public messagesQueue: IMessage<any>[] = [];
	public postMessage: PostMessage
	public addEventListener: AddEventListener
	
	constructor(options: IConnectorOptions){
		super();
		this.addEventListener =options.addEventListener
		this.postMessage = options.postMessage;

		this.addEventListener("message", this.onMessage.bind(this));
	}
	
	onMessage(event: EventProps){
		event.reply = (data) => {
			const msg = new Message({
				id: event.data.id,
				type: event.data.type,
				isReply: true,
				data
			});
			debugger
			this.postMessage(msg);
		};

		if(event.data && !event.data.isReply){
			this.emit("message", event);
		}
	}
	
	addMessageListener<T>(callback: (message: IMessage<T>) => any): AnyFunction {

		const _callback = (event: MessageEvent) => {
			callback(event.data);
			// this.onMessage(event.data);
		};

		this.addEventListener("message", _callback);

		return () => window.removeEventListener("message", _callback);
	}


	sendMessage<T>(message: IMessage<T>){
		return new Promise((res, rej) => {
			const dispose = this.addMessageListener<T>((reply) => {
				if(reply.id === message.id){
					dispose();
					res(reply);
				}
			});
			this.postMessage(message);
		});
	}
}