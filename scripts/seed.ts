import { createClient } from '@supabase/supabase-js';
import { mockParts } from '../src/mockData';
import fs from 'fs';
import path from 'path';

// Read .env.local or .env for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Starting to seed ${mockParts.length} products...`);
  
  for (const part of mockParts) {
    try {
      const { data, error } = await supabase.from('products').upsert({
        sku: part.sku,
        name: part.name,
        brand: part.brand,
        category: part.category,
        price: part.price,
        stock: part.stock,
        status: part.status,
        image_url: part.image_url,
        description: part.description,
        specifications: part.specifications
      }, { onConflict: 'sku' });
      
      if (error) {
         console.error(`Failed to upsert ${part.sku}: ${error.message}`);
      } else {
         console.log(`Successfully upserted: ${part.name} (${part.sku})`);
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  console.log('Seeding complete!');
}

seed();
