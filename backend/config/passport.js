const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { email: profile.emails[0].value },
        { googleId: profile.id }
      ]
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = profile.id;
        user.googleEmail = profile.emails[0].value;
        if (!user.avatar && profile.photos[0]) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      googleEmail: profile.emails[0].value,
      avatar: profile.photos[0]?.value || '',
      isEmailVerified: true, // Google emails are verified
      isActive: true
    });

    await user.save();
    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

module.exports = passport; 