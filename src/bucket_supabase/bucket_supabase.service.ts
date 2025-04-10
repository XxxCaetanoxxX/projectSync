import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class BucketSupabaseService {
  private supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  async uploadUserImage(file: Express.Multer.File, user: any): Promise<string> {

    //remove a imagem antiga do storage
    if (user.image?.path) {
      const urlParts = user.image.path.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await this.deleteUserImage(fileName);
    }


    const fileExtension = file.originalname.split('.').pop();
    const timestamp = Date.now(); //preciso devido ao cache do supabase
    const fileName = `${user.name.toLowerCase().replace(/\s/g, '')}_profile_photo_${timestamp}.${fileExtension}`;


    const { data, error } = await this.supabase.storage
      .from('user-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    const publicUrl = this.supabase
      .storage
      .from('user-images')
      .getPublicUrl(fileName)
      .data.publicUrl;

    return publicUrl;
  }

  async uploadEventImages(files: Array<Express.Multer.File>) {
    const urls = await Promise.all(files.map(async file => {
      const fileExtension = file.originalname.toLowerCase().substring(1);
      const fileName = `${randomUUID()}.${fileExtension}`;

      const { data, error } = await this.supabase
        .storage
        .from('event-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        })

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      const publicUrl = this.supabase
        .storage
        .from('event-images')
        .getPublicUrl(fileName)
        .data.publicUrl;

      return publicUrl
    }))

    return urls
  }

  async deleteUserImage(fileName: string) {
    await this.supabase
      .storage
      .from('user-images')
      .remove([fileName]);
  }

  async deleteImageEvent(filePath: string) {
    const fileName = filePath.split('/').pop();
    await this.supabase
      .storage
      .from('event-images')
      .remove([fileName]);
  }
}
