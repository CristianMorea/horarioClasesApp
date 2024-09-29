import supabase from '../supabase';

export const authService = {
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
};
