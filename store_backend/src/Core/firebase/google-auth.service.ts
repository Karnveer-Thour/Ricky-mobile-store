import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

/**
 * GoogleAuthService
 *
 * Verifies Google Identity Services credential tokens (JWT) using
 * google-auth-library — no Firebase SDK required on the frontend.
 *
 * Flow:
 *   1. Frontend uses @react-oauth/google to get a credential (JWT)
 *   2. Frontend POSTs credential to POST /user/login/social/:token
 *   3. This service verifies the JWT against Google's public keys
 *   4. Returns decoded user info (uid, email, name, picture)
 */
@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger('GoogleAuthService');
  private readonly client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.client = new OAuth2Client(clientId);
  }

  /**
   * Verify a Google credential token (from Google Identity Services / @react-oauth/google).
   * Returns decoded payload or throws UnauthorizedException.
   */
  async verifyGoogleCredential(credential: string): Promise<{
    uid: string;
    email: string;
    name: string;
    picture: string;
  }> {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';

    if (!clientId) {
      this.logger.warn('GOOGLE_CLIENT_ID is not set — skipping Google credential verification');
      throw new UnauthorizedException('Google authentication is not configured on the server');
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google credential payload');
      }

      return {
        uid: payload.sub,
        email: payload.email || '',
        name: payload.name || '',
        picture: payload.picture || '',
      };
    } catch (err: any) {
      this.logger.warn(`Google credential verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid Google credential token');
    }
  }

  /**
   * Returns true if GOOGLE_CLIENT_ID is configured.
   */
  isConfigured(): boolean {
    return !!process.env.GOOGLE_CLIENT_ID;
  }
}
