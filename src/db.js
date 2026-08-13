const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Get authenticated user
async function getUser(req) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) console.error('Auth error:', error);
  return user;
}

// Photographer queries
async function getPhotographers(filters = {}) {
  let query = supabase
    .from('photographer_profiles')
    .select(`
      *,
      user_id,
      users(id, full_name, avatar_url, city)
    `);

  if (filters.specialty) {
    query = query.eq('specialty', filters.specialty);
  }
  if (filters.city) {
    query = query.eq('users.city', filters.city);
  }
  if (filters.available !== undefined) {
    query = query.eq('available', filters.available);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getPhotographerById(id) {
  const { data, error } = await supabase
    .from('photographer_profiles')
    .select(`
      *,
      users(id, full_name, avatar_url, city, bio),
      portfolio_items(*)
    `)
    .eq('user_id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Booking queries
async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select();
  
  if (error) throw error;
  return data[0];
}

async function getBookingsByUser(userId, userType = 'client') {
  const column = userType === 'client' ? 'client_id' : 'photographer_id';
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      client:client_id(id, full_name, avatar_url),
      photographer:photographer_id(id, full_name, avatar_url)
    `)
    .eq(column, userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

async function updateBookingStatus(bookingId, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date() })
    .eq('id', bookingId)
    .select();
  
  if (error) throw error;
  return data[0];
}

// Message queries
async function sendMessage(messageData) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select();
  
  if (error) throw error;
  return data[0];
}

async function getConversation(userId, otherUserId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`*`)
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`
    )
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

// Review queries
async function createReview(reviewData) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select();
  
  if (error) throw error;
  return data[0];
}

async function getPhotographerRating(photographerId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('rated_user_id', photographerId);
  
  if (error) throw error;
  
  if (data.length === 0) return null;
  const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return {
    average: avgRating.toFixed(1),
    count: data.length
  };
}

module.exports = {
  supabase,
  getUser,
  getPhotographers,
  getPhotographerById,
  createBooking,
  getBookingsByUser,
  updateBookingStatus,
  sendMessage,
  getConversation,
  createReview,
  getPhotographerRating
};
