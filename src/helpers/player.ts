import axios from "axios";
import { inform } from "./notifications";
import { GitoRecording, IGitoRecording } from "./recorder";
import { setGitoContext } from './context';


async function getGito(url:string):Promise<IGitoRecording>{
	try{
		return await axios.get(url).then(res => res.data);
	}catch(err: any){
		throw err;
	}
}


async function playGito(gito:string | GitoRecording){

	let recording: GitoRecording|undefined;
	inform(`Starting playing gito`);
	if(typeof gito === "string"){
		inform(`Downloading gito`);
		const _gito = await getGito(gito)
		inform(`Download complete`);
		recording = new GitoRecording(_gito as IGitoRecording);
	}else if (gito instanceof GitoRecording){
		recording = gito;
	}
	if(recording){
		setGitoContext(recording);
		await recording.play();
	}
}

export {
	playGito
};
