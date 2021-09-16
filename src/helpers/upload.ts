import { GITO_UPLOAD_URL } from "./constants";
import axios from 'axios'

async function upload(
	data: Blob|Buffer|object,
	{
		folder = '',
		fileName = '',
	} = {}
): Promise<string> {
	try {

		const uploadUrl = `${GITO_UPLOAD_URL}/upload-folder?${new URLSearchParams({
			id: folder,
			path: `${fileName}`,
		})}`;
		const response = await axios.post(uploadUrl, data)
		const downloadURL:string = response.data.downloadURL;
		return downloadURL;
	} catch (err: any) {
		console.error(err.message);
		throw err;
	}
}


export {
	upload
}