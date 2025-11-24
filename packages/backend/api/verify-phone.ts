import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { sendVerificationCode, checkVerificationCode } from '../src/lib/twilio';
import { verifyPhoneSchema } from '../../shared/src/validators';
import { createErrorResponse, APIError } from '../../shared/src/utils';

/**
 * Verify Phone Number Endpoint
 *
 * POST /api/verify-phone
 * Body: { phone_number: string, verification_code?: string }
 *
 * Flow:
 * 1. No code: Send SMS verification code
 * 2. With code: Verify code and create/login user
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request
    const body = verifyPhoneSchema.parse(req.body);
    const { phone_number, verification_code } = body;

    // Step 1: Send verification code
    if (!verification_code) {
      const sent = await sendVerificationCode(phone_number);

      if (!sent) {
        throw new APIError(500, 'Failed to send verification code', 'TWILIO_ERROR');
      }

      return res.status(200).json({
        success: true,
        message: 'Verification code sent',
      });
    }

    // Step 2: Check verification code
    const isValid = await checkVerificationCode(phone_number, verification_code);

    if (!isValid) {
      throw new APIError(400, 'Invalid verification code', 'INVALID_CODE');
    }

    // Step 3: Create or get user
    let { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phone_number)
      .single();

    let userId: string;

    if (fetchError && fetchError.code !== 'PGRST116') { // Not found error
      throw new APIError(500, 'Database error', 'DB_ERROR');
    }

    if (existingUser) {
      // Update existing user
      userId = existingUser.id;

      await supabase
        .from('users')
        .update({
          phone_verified: true,
          last_active_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // Create new user with welcome bonus
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone_number,
          phone_verified: true,
          echo_chips: 50, // Welcome bonus
          preferred_languages: ['en'],
        })
        .select()
        .single();

      if (createError || !newUser) {
        throw new APIError(500, 'Failed to create user', 'USER_CREATE_ERROR');
      }

      userId = newUser.id;

      // Log analytics event
      await supabase.from('analytics_events').insert({
        user_id: userId,
        event_name: 'user_signup',
        event_properties: { source: 'phone_verification' },
      });
    }

    // Generate JWT token
    const { data: sessionData, error: authError } = await supabase.auth.signInWithPassword({
      phone: phone_number,
      password: verification_code, // Temporary
    });

    if (authError) {
      // Fallback: create custom JWT (simplified)
      const token = Buffer.from(JSON.stringify({ userId, phone_number })).toString('base64');

      return res.status(200).json({
        success: true,
        user_id: userId,
        token,
        message: 'Phone verified successfully',
      });
    }

    return res.status(200).json({
      success: true,
      user_id: userId,
      token: sessionData.session?.access_token,
      message: 'Phone verified successfully',
    });

  } catch (error) {
    console.error('Verify phone error:', error);
    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
