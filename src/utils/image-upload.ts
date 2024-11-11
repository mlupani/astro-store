import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET
});


export class ImageUpload {

    static async upload(file: File): Promise<string> {

        try {
            const buffer = await file.arrayBuffer();
            const base64Image = Buffer.from(buffer).toString('base64');
            const imageType = file.type.split('/')[1]; //image/png -> png
            const resp = await cloudinary.uploader.upload(
                `data:image/${imageType};base64,${base64Image}`, {
                    folder: 'astro-store'
                }
            );
            console.log(resp);
            return resp.secure_url;
        } catch (error) {
            console.log(error)
            return error as string;
        }
    }

    static async delete(url: string) {
        try {
            const publicId = url.split('/').pop()?.split('.')[0] ?? '';
            const resp = await cloudinary.uploader.destroy(publicId);
            console.log(resp);
        } catch (error) {
            console.log(error)
        }
    }
}