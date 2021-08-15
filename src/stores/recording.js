
import Store from './../classes/Store';

class Recording extends Store{
	constructor(){
		const initialState = {
			isRecording: false,
			recordingData: [],
			audioData: [],
		};

		super(initialState);
	}
}

const recording = new Recording();

export default recording;
export {
	Recording
};