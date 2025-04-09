import { Module } from '@nestjs/common';
import { BucketSupabaseService } from './bucket_supabase.service';

@Module({
  providers: [BucketSupabaseService],
  exports: [BucketSupabaseService],
})
export class BucketSupabaseModule { }
