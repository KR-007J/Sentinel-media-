import { supabase } from './supabase';
import { MOCK_THREATS, MOCK_ASSETS } from '../data/mockData';

export const seedDatabase = async () => {
  // Check if already seeded
  const { count } = await supabase.from('threats').select('*', { count: 'exact', head: true });
  
  if (count === 0) {
    console.log('Seeding database with tactical data...');
    
    // Cleanup IDs for auto-generation
    const threats = MOCK_THREATS.map(({ id, ...rest }) => ({
       ...rest,
       risk: rest.risk || 'medium',
       status: rest.status || 'unauthorized'
    }));

    const assets = MOCK_ASSETS.map(({ id, ...rest }) => ({
       ...rest,
       status: rest.status || 'monitored'
    }));

    await supabase.from('threats').insert(threats);
    await supabase.from('assets').insert(assets);
    
    await supabase.from('system_logs').insert([{
      event_type: 'SYSTEM_INITIALIZATION',
      description: 'Tactical database successfully seeded with baseline intelligence patterns.',
      level: 'critical'
    }]);

    console.log('Database synchronization complete.');
  }
};
