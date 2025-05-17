const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://tzekravlcxjpfeetbsfr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWtyYXZsY3hqcGZlZXRic2ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTUwMTU2MiwiZXhwIjoyMDYxMDc3NTYyfQ.UHbcYbnlcqVMNjVTUxaMlH9xRGDmxXZEotG7v5Kw-Dw';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  try {
    // Read the schema SQL file
    const schemaSql = fs.readFileSync('./supabase-schema.sql', 'utf8');
    
    // Split the schema into individual statements
    const statements = schemaSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      
      const { error } = await supabase.rpc('exec_sql', { query: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        // Continue with other statements
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('Schema application completed');
  } catch (error) {
    console.error('Error applying schema:', error);
  }
}

// Run the schema application
applySchema(); 