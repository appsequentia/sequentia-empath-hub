
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
      
      // Create storage bucket for therapist documents with less restrictive options
      const { error } = await supabase.storage.createBucket(BUCKET_ID, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
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
            return false;
          }
        } else {
          console.error('Error creating bucket:', error);
          return false;
        }
      } else {
        console.log(`Created '${BUCKET_ID}' bucket successfully`);
        
        // Configure CORS for the bucket to allow direct access
        // Extract URL and key from environment variables or use hardcoded fallbacks
        const supabaseUrl = 'https://wyyefqjcdwgyeixcbhda.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eWVmcWpjZHdneWVpeGNiaGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODU0OTEsImV4cCI6MjA2MzA2MTQ5MX0._R8yqY9lYyMNlgmZpq1QRwMeVgwRpo8_kaYp2qPyzxQ';
        
        try {
          const corsResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/${BUCKET_ID}/cors`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
              allowedOrigins: ['*'],
              allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
              allowedHeaders: ['*'],
              maxAgeSeconds: 3600
            })
          });
          
          if (!corsResponse.ok) {
            console.warn('Could not set CORS policy for bucket, but bucket was created', 
              `Status: ${corsResponse.status}`, 
              `Response: ${await corsResponse.text().catch(() => 'Unable to read response')}`);
          } else {
            console.log('CORS policy set for bucket');
          }
        } catch (corsError) {
          console.warn('Error setting CORS policy, continuing anyway:', corsError);
        }
        
        return true;
      }
    }
    
    console.log(`Storage bucket '${BUCKET_ID}' already exists, checking accessibility...`);
    
    // Verify the bucket is accessible (important check)
    const { data: objData, error: objError } = await supabase.storage
      .from(BUCKET_ID)
      .list('', { limit: 1 });
      
    if (objError) {
      console.error(`Bucket '${BUCKET_ID}' exists but may not be accessible:`, objError);
      
      // Try to update bucket settings if we can't access it
      try {
        const { error: updateError } = await supabase.storage.updateBucket(BUCKET_ID, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024,
        });
        
        if (!updateError) {
          console.log(`Updated bucket '${BUCKET_ID}' settings to be public`);
          return true;
        } else {
          console.error('Error updating bucket permissions:', updateError);
        }
      } catch (updateErr) {
        console.error('Error trying to update bucket settings:', updateErr);
      }
      
      return false;
    }
    
    console.log(`Bucket '${BUCKET_ID}' is accessible`);
    return true;
  } catch (err) {
    console.error('Error checking/creating therapist docs bucket:', err);
    return false;
  }
}
