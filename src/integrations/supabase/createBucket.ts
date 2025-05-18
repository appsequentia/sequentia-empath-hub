
import { supabase } from './client';

/**
 * This function creates the necessary storage buckets if they don't exist
 * It can be called during app initialization
 */
export async function createTherapistDocumentsBucket() {
  try {
    // Check if bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === 'therapist_docs');
    
    if (!bucketExists) {
      // Create storage bucket for therapist documents
      const { data, error } = await supabase.storage.createBucket('therapist_docs', {
        public: false
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      // Create public policy for the bucket
      const { error: policyError } = await supabase.storage.from('therapist_docs')
        .createSignedUrl('dummy-path', 60); // This is just to trigger policy creation
        
      if (policyError && !policyError.message.includes('not found')) {
        console.error('Error setting bucket policy:', policyError);
      }
      
      console.log('Created therapist_docs bucket');
      return true;
    }
    
    console.log('Storage bucket for therapist documents already exists');
    return true;
  } catch (err) {
    console.error('Error checking/creating therapist docs bucket:', err);
    return false;
  }
}
