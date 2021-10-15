import { ExtensionContext } from "vscode";


class GlobalStore{
	constructor(private context: ExtensionContext){}

	async setData(key:string, value: any): Promise<GlobalStore>{
		await this.context.globalState.update(key, value);
		return this;
	}

	getData(key: string): unknown{
		return this.context.globalState.get(key);
	}

	async updateData(key: string, callback: (value: any) => any){
		const val = this.getData(key);
		const newVal = callback(val);
		return await this.setData(key, newVal);
	}

	async removeAll(){
		for(let key in this.keys){
			await this.setData(key, null);
		}
	}

	async remove(key: string){
		await this.setData(key, null);
	}


	get keys(): readonly string[]{
		return this.context.globalState.keys();
	}

	get values(): Map<string, unknown>{
		let map = new Map<string, unknown>();

		for(let key of this.keys){
			map.set(key, this.getData(key));
		}

		return map;
	}


}


export {
	GlobalStore
}