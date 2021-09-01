interface Store extends MapConstructor{
	initialData: Object,
}

class Store extends Map{
	constructor(entries = {}){
		super();
		this.setState(entries);
		this.initialData = entries;
	}

	toObject(){
		let obj:any= {};
		for(let [key, value] of this){
			obj[key] = value;
		}
		return obj;
	}

	setState(state: any){
		for(let key in state){
			this.set(key, state[key]);
		}
	}

	getState(){
		return this.toObject();
	}

	reset(){
		this.setState(this.initialData);
	}

	clear(){
		for(let [key] of this){
			this.delete(key);
		}
	}

	log(){
		for(let [key, value] of this){
			console.log({key, value});
		}
	}
	toArray():any[][]{

		let arr = [];
		for(let [key, value] of this){
			arr.push([key,value]);
		}

		return arr;
	}

	toJSON():String{
		return JSON.stringify(this.toObject());
	}

	toString(): String{
		return this.toJSON();
	}

	update(key:String, callback: Function): Store{
		const value = this.get(key);
		const newValue = callback(value);
		this.set(key, newValue);
		return this;
	}
	updateState(callback: Function): Store{
		const newState = callback(this.getState());
		this.setState(newState);
		return this;
	}
}

export default Store;