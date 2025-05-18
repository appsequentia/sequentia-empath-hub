
import { supabase } from './client';

const BUCKET_ID = 'therapist_docs';

/**
 * This function creates the necessary storage buckets if they don't exist
 * and configures proper CORS settings
 * It can be called during app initialization
 */
export async function createTherapistDocumentsBucket() {
  try {
    console.log("Starting bucket verification/creation process");
    
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(b => b.name === BUCKET_ID);
    
    if (!bucketExists) {
      console.log(`Bucket '${BUCKET_ID}' not found, creating...`);
      
      // Create storage bucket for therapist documents
      const { data, error } = await supabase.storage.createBucket(BUCKET_ID, {
        public: true, // Make bucket public for ease of access
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
        allowedMimeTypes: [
          'image/jpeg', 
          'image/png', 
          'application/pdf',
          'image/jpg'
        ]
      });
      
      if (error) {
        // Specific handling for RLS policy errors
        if (error.message?.includes('row-level security policy')) {
          console.error('RLS policy error creating bucket. This user may not have permission.', error);
          
          // Try to use an existing bucket instead of creating
          const { data: objData, error: objError } = await supabase.storage
            .from(BUCKET_ID)
            .list();
            
          if (!objError) {
            console.log(`Bucket '${BUCKET_ID}' exists but couldn't be created. Will try to use it anyway.`);
            return true;
          } else {
            console.error(`Cannot access '${BUCKET_ID}' bucket:`, objError);
          }
        } else {
          console.error('Error creating bucket:', error);
        }
        return false;
      }
      
      console.log(`Created '${BUCKET_ID}' bucket successfully`);
      return true;
    }
    
    console.log(`Storage bucket '${BUCKET_ID}' already exists, checking accessibility...`);
    
    // Verify the bucket is accessible (important check)
    const { data: objData, error: objError } = await supabase.storage
      .from(BUCKET_ID)
      .list('', { limit: 1 });
      
    if (objError) {
      console.error(`Bucket '${BUCKET_ID}' exists but may not be accessible:`, objError);
      return false;
    }
    
    console.log(`Bucket '${BUCKET_ID}' is accessible`);
    return true;
  } catch (err) {
    console.error('Error checking/creating therapist docs bucket:', err);
    return false;
  }
}
