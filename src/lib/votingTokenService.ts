import { generateUUID } from './utils';

export interface VotingToken {
  id: string;
  voteId: string;
  memberId: string;
  token: string;
  verificationCode: string;
  isVerified: boolean;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  verifiedAt?: string;
  usedAt?: string;
}

class VotingTokenService {
  private tokens: VotingToken[] = [];

  generateToken(voteId: string, memberId: string): VotingToken {
    const token = this.generateSecureToken();
    const verificationCode = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const votingToken: VotingToken = {
            id: generateUUID(),
      voteId,
      memberId,
      token,
      verificationCode,
      isVerified: false,
      isUsed: false,
      expiresAt,
      createdAt: new Date().toISOString()
    };

    this.tokens.push(votingToken);
    return votingToken;
  }

  getTokenByToken(token: string): VotingToken | null {
    return this.tokens.find(t => t.token === token) || null;
  }

  // Helper to resolve a public token string to the underlying voteId
  resolveTokenToVoteId(token: string): string | null {
    const t = this.getTokenByToken(token);
    return t ? t.voteId : null;
  }

  getTokenByVerificationCode(code: string): VotingToken | null {
    return this.tokens.find(t => t.verificationCode === code && !this.isExpired(t)) || null;
  }

  verifyToken(token: string, verificationCode: string): boolean {
    const votingToken = this.tokens.find(t => 
      t.token === token && 
      t.verificationCode === verificationCode && 
      !t.isVerified && 
      !this.isExpired(t)
    );

    if (votingToken) {
      votingToken.isVerified = true;
      votingToken.verifiedAt = new Date().toISOString();
      return true;
    }

    return false;
  }

  markTokenAsUsed(token: string): boolean {
    const votingToken = this.tokens.find(t => t.token === token && t.isVerified && !t.isUsed);
    
    if (votingToken) {
      votingToken.isUsed = true;
      votingToken.usedAt = new Date().toISOString();
      return true;
    }

    return false;
  }

  isTokenValid(token: string): boolean {
    const votingToken = this.getTokenByToken(token);
    return votingToken !== null && 
           votingToken.isVerified && 
           !votingToken.isUsed && 
           !this.isExpired(votingToken);
  }

  private isExpired(token: VotingToken): boolean {
    return new Date() > new Date(token.expiresAt);
  }

  private generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  getTokensForVote(voteId: string): VotingToken[] {
    return this.tokens.filter(t => t.voteId === voteId);
  }

  cleanupExpiredTokens(): void {
    this.tokens = this.tokens.filter(t => !this.isExpired(t));
  }
}

export const votingTokenService = new VotingTokenService();