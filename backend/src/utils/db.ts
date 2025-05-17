import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://tzekravlcxjpfeetbsfr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWtyYXZsY3hqcGZlZXRic2ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTUwMTU2MiwiZXhwIjoyMDYxMDc3NTYyfQ.UHbcYbnlcqVMNjVTUxaMlH9xRGDmxXZEotG7v5Kw-Dw';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    
    console.log('Successfully connected to Supabase.');
    return true;
  } catch (error) {
    console.error('Unexpected error testing connection:', error);
    return false;
  }
}

export default supabase; 