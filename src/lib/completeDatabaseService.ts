// KOMPLETNÍ DatabaseService s rozšířenou funkcionalitou
// Zachovává všechny původní metody + přidává nové pokročilé funkce

import { supabase } from './supabaseClient';
import type { 
  ExtendedBuilding, 
  ExtendedMember, 
  ExtendedVote, 
  ExtendedQuestion,
  VoteDelegation,
  Notification,
  SmsVerification,
  AuditLogEntry,
  VoteAnalytics,
  Report,
  ProxyVote,
  Attachment,
  ExtendedMemberVote,
  PaginatedResponse,
  VoteFilters,
  MemberFilters,
  NotificationFilters,
  CreateVoteData,
  CreateDelegationData,
  CastVoteData
} from '../types/extended';

export class CompleteDatabaseService {
  
  // ========================================
  // ZÁKLADNÍ CRUD OPERACE (Zachovány všechny původní)
  // ========================================

  // Buildings
  async getBuildings(): Promise<ExtendedBuilding[]> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getBuildingById(id: string): Promise<ExtendedBuilding | null> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createBuilding(building: Omit<ExtendedBuilding, 'id' | 'created_at' | 'updated_at'>): Promise<ExtendedBuilding> {
    const { data, error } = await supabase
      .from('buildings')
      .insert(building)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateBuilding(id: string, updates: Partial<ExtendedBuilding>): Promise<ExtendedBuilding> {
    const { data, error } = await supabase
      .from('buildings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteBuilding(id: string): Promise<void> {
    const { error } = await supabase
      .from('buildings')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }

  // Members
  async getMembersByBuilding(buildingId: string, filters?: MemberFilters): Promise<ExtendedMember[]> {
    let query = supabase
      .from('members')
      .select('*')
      .eq('building_id', buildingId);

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    if (filters?.role?.length) {
      query = query.in('role', filters.role);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,unit.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('unit');
    
    if (error) throw error;
    return data || [];
  }

  async getMemberById(id: string): Promise<ExtendedMember | null> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createMember(member: Omit<ExtendedMember, 'id' | 'created_at' | 'updated_at'>): Promise<ExtendedMember> {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMember(id: string, updates: Partial<ExtendedMember>): Promise<ExtendedMember> {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }

  async importMembers(buildingId: string, members: Omit<ExtendedMember, 'id' | 'building_id' | 'created_at' | 'updated_at'>[]): Promise<ExtendedMember[]> {
    const membersToInsert = members.map(member => ({
      ...member,
      building_id: buildingId
    }));

    const { data, error } = await supabase
      .from('members')
      .insert(membersToInsert)
      .select();
    
    if (error) throw error;
    return data || [];
  }

  // Votes
  async getVotesByBuilding(buildingId: string, filters?: VoteFilters): Promise<ExtendedVote[]> {
    let query = supabase
      .from('votes')
      .select('*')
      .eq('building_id', buildingId);

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.voting_type?.length) {
      query = query.in('voting_type', filters.voting_type);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getVoteById(id: string): Promise<ExtendedVote | null> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createVote(voteData: CreateVoteData): Promise<ExtendedVote> {
    const { questions, ...voteInfo } = voteData;

    // Vytvoření hlasování
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert(voteInfo)
      .select()
      .single();
    
    if (voteError) throw voteError;

    // Vytvoření otázek
    const questionsToInsert = questions.map((q, index) => ({
      ...q,
      vote_id: vote.id,
      order_index: index
    }));

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (questionsError) throw questionsError;

    return vote;
  }

  async updateVote(id: string, updates: Partial<ExtendedVote>): Promise<ExtendedVote> {
    const { data, error } = await supabase
      .from('votes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteVote(id: string): Promise<void> {
    const { error } = await supabase
      .from('votes')
      .update({ status: 'cancelled' })
      .eq('id', id);
    
    if (error) throw error;
  }

  async startVote(id: string): Promise<ExtendedVote> {
    const { data, error } = await supabase
      .from('votes')
      .update({ 
        status: 'active',
        start_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Questions
  async getQuestionsByVote(voteId: string): Promise<ExtendedQuestion[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('vote_id', voteId)
      .order('order_index');
    
    if (error) throw error;
    return data || [];
  }

  async createQuestion(question: Omit<ExtendedQuestion, 'id' | 'created_at'>): Promise<ExtendedQuestion> {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateQuestion(id: string, updates: Partial<ExtendedQuestion>): Promise<ExtendedQuestion> {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Member Votes
  async castVote(voteData: CastVoteData): Promise<ExtendedMemberVote[]> {
    const memberVotes = voteData.responses.map(response => ({
      vote_id: voteData.vote_id,
      member_id: voteData.member_id,
      question_id: response.question_id,
      answer_data: response.response_data,
      confidence_level: response.confidence_level,
      comment: response.comment
    }));

    const { data, error } = await supabase
      .from('member_votes')
      .insert(memberVotes)
      .select();
    
    if (error) throw error;

    // Označit voting token jako použitý
    if (voteData.voting_token) {
      await supabase
        .from('voting_tokens')
        .update({ 
          is_used: true,
          used_at: new Date().toISOString()
        })
        .eq('token', voteData.voting_token);
    }

    return data || [];
  }

  async getMemberVotes(voteId: string, memberId?: string): Promise<ExtendedMemberVote[]> {
    let query = supabase
      .from('member_votes')
      .select('*')
      .eq('vote_id', voteId);

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  // ========================================
  // NOVÉ POKROČILÉ FUNKCE
  // ========================================

  // Delegování hlasů
  async createDelegation(delegationData: CreateDelegationData): Promise<VoteDelegation> {
    const { data, error } = await supabase
      .from('vote_delegations')
      .insert(delegationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getDelegationsByVote(voteId: string): Promise<VoteDelegation[]> {
    const { data, error } = await supabase
      .from('vote_delegations')
      .select('*')
      .eq('vote_id', voteId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  }

  async revokeDelegation(delegationId: string): Promise<VoteDelegation> {
    const { data, error } = await supabase
      .from('vote_delegations')
      .update({ 
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('id', delegationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Notifikace
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getNotifications(recipientId: string, filters?: NotificationFilters): Promise<PaginatedResponse<Notification>> {
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_id', recipientId);

    if (filters?.type?.length) {
      query = query.in('type', filters.type);
    }

    if (filters?.priority?.length) {
      query = query.in('priority', filters.priority);
    }

    if (filters?.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    return {
      data: data || [],
      total: count || 0,
      page: 1,
      limit: 50,
      has_more: (count || 0) > 50
    };
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // SMS ověřování
  async createSmsVerification(verification: Omit<SmsVerification, 'id' | 'created_at'>): Promise<SmsVerification> {
    const { data, error } = await supabase
      .from('sms_verifications')
      .insert(verification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async verifySmsCode(tokenHash: string, code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('sms_verifications')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('verification_code', code)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      // Zvýšit počet pokusů
      const { data: current } = await supabase
        .from('sms_verifications')
        .select('attempts')
        .eq('token_hash', tokenHash)
        .single();
        
      if (current) {
        await supabase
          .from('sms_verifications')
          .update({ attempts: current.attempts + 1 })
          .eq('token_hash', tokenHash);
      }
      
      return false;
    }

    // Označit jako ověřené
    await supabase
      .from('sms_verifications')
      .update({ 
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', data.id);

    return true;
  }

  // Analytics a reporty
  async getVoteAnalytics(voteId: string): Promise<VoteAnalytics | null> {
    const { data, error } = await supabase
      .from('vote_analytics')
      .select('*')
      .eq('vote_id', voteId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async generateVoteReport(voteId: string, reportType: Report['report_type'], format: Report['format']): Promise<Report> {
    const reportData = {
      vote_id: voteId,
      report_type: reportType,
      format: format,
      building_id: '', // Bude doplněno z vote
      is_official: true,
      access_level: 'admin' as const
    };

    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Proxy hlasování
  async createProxyVote(proxy: Omit<ProxyVote, 'id' | 'created_at'>): Promise<ProxyVote> {
    const { data, error } = await supabase
      .from('proxy_votes')
      .insert(proxy)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getProxyVotes(voteId: string): Promise<ProxyVote[]> {
    const { data, error } = await supabase
      .from('proxy_votes')
      .select('*')
      .eq('vote_id', voteId)
      .eq('is_valid', true);
    
    if (error) throw error;
    return data || [];
  }

  // Přílohy
  async createAttachment(attachment: Omit<Attachment, 'id' | 'created_at'>): Promise<Attachment> {
    const { data, error } = await supabase
      .from('attachments')
      .insert(attachment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAttachments(entityType: string, entityId: string): Promise<Attachment[]> {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    if (error) throw error;
    return data || [];
  }

  // Audit log
  async getAuditLog(entityType?: string, entityId?: string): Promise<AuditLogEntry[]> {
    let query = supabase
      .from('audit_log')
      .select('*');

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return data || [];
  }

  // ========================================
  // POKROČILÉ DOTAZY A STATISTIKY
  // ========================================

  async getVoteStatistics(voteId: string) {
    // Použití view pro získání statistik
    const { data, error } = await supabase
      .from('vote_statistics_view')
      .select('*')
      .eq('id', voteId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getDelegationOverview(voteId: string) {
    const { data, error } = await supabase
      .from('delegation_overview')
      .select('*')
      .eq('vote_id', voteId);
    
    if (error) throw error;
    return data || [];
  }

  async calculateQuorum(voteId: string, questionId: string) {
    const { data, error } = await supabase
      .rpc('calculate_quorum', {
        vote_id_param: voteId,
        question_id_param: questionId
      });
    
    if (error) throw error;
    return data;
  }

  async autoCompleteVote(voteId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('auto_complete_vote', {
        vote_id_param: voteId
      });
    
    if (error) throw error;
    return data;
  }

  // ========================================
  // PŮVODNÍ METODY PRO ZPĚTNOU KOMPATIBILITU
  // ========================================

  async getMembers(buildingId: string): Promise<ExtendedMember[]> {
    return this.getMembersByBuilding(buildingId);
  }

  async addMember(member: Omit<ExtendedMember, 'id' | 'created_at' | 'updated_at'>): Promise<ExtendedMember> {
    return this.createMember(member);
  }

  async getVotes(buildingId: string): Promise<ExtendedVote[]> {
    return this.getVotesByBuilding(buildingId);
  }

  async addVote(vote: CreateVoteData): Promise<ExtendedVote> {
    return this.createVote(vote);
  }

  // Email templates - zachováno původní API
  async getEmailTemplates(buildingId?: string) {
    let query = supabase.from('email_templates').select('*');
    
    if (buildingId) {
      query = query.or(`building_id.eq.${buildingId},is_global.eq.true`);
    } else {
      query = query.eq('is_global', true);
    }
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data || [];
  }

  async addTemplate(template: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTemplate(id: string, template: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('email_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTemplate(id: string) {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Global variables
  async getGlobalVariables() {
    const { data, error } = await supabase
      .from('global_variables')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async addGlobalVariable(variable: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('global_variables')
      .insert(variable)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateGlobalVariable(name: string, variable: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('global_variables')
      .update(variable)
      .eq('name', name)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteGlobalVariable(name: string) {
    const { error } = await supabase
      .from('global_variables')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
  }

  // Building variables
  async getBuildingVariables() {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async addBuildingVariable(variable: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .insert(variable)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateBuildingVariable(name: string, variable: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .update(variable)
      .eq('name', name)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteBuildingVariable(name: string) {
    const { error } = await supabase
      .from('building_variable_definitions')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
  }

  // Observers
  async getObservers(buildingId: string) {
    const { data, error } = await supabase
      .from('observers')
      .select('*')
      .eq('building_id', buildingId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async addObserver(observer: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('observers')
      .insert(observer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteObserver(id: string) {
    const { error } = await supabase
      .from('observers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Voting tokens
  async createVotingToken(voteId: string, memberId: string) {
    const token = this.generateUniqueToken();
    const verificationCode = this.generateVerificationCode();
    
    const { data, error } = await supabase
      .from('voting_tokens')
      .insert({
        vote_id: voteId,
        member_id: memberId,
        token,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hodin
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getVotingToken(token: string) {
    const { data, error } = await supabase
      .from('voting_tokens')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error) throw error;
    return data;
  }

  private generateUniqueToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export const completeDatabaseService = new CompleteDatabaseService();
