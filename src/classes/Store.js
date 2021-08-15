class Store extends Map{
	constructor(entries = {}){
		super();
		this.setState(entries);
		this.__initialData__ = entries;
	}

	toObject(){
		let obj = {};
		for(let [key, value] of this){
			obj[key] = value;
		}
		return obj;
	}

	setState(state){
		for(let key in state){
			this.set(key, state[key]);
		}
	}

	getState(){
		return this.toObject();
	}

	reset(){
		this.setState(this.__initialData__);
	}

	clear(){
		for(let [key] of this){
			this.delete(key);
		}
	}

	log(){
		for(let [key, value] of this){
			console.log({key, value})
		}
	}
	toArray(){

		let arr = [];
		for(let [key, value] of this){
			arr.push([key, value]);
		}

		return arr;
	}

	toJSON(){
		return JSON.stringify(this.toObject());
	}

	toString(){
		return this.toJSON();
	}

	update(key, callback){
		const value = this.get(key);
		const newValue = callback(value);
		this.set(key, newValue);
		return this;
	}
	updateState(callback){
		const newState = callback(this.getState());
		this.setState(newState);
		return this;
	}
}

export default Store;