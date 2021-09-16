import axios from "axios";
import { GitoRecording, IGitoRecording } from "./recorder";


async function getGito(url:string):Promise<IGitoRecording>{
	try{
		return await axios.get(url).then(res => res.data);
	}catch(err: any){
		throw err;
	}
}


async function playGito(gito:string | GitoRecording){

	let recording: GitoRecording|undefined;

	if(typeof gito === "string"){
		
		const _gito = await getGito(gito);
		// debugger
		recording = new GitoRecording(_gito as IGitoRecording);
	}else if (gito instanceof GitoRecording){
		recording = gito;
	}

	if(recording){
		await recording.play();
	}

}

export {
	playGito
};
