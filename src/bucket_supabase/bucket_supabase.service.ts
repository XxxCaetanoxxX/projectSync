import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

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
      const filename = urlParts[urlParts.length - 1];
      await this.supabase
        .storage
        .from('user-images')
        .remove([filename]);
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
}
