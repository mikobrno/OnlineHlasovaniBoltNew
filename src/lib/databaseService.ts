import { supabase } from './supabaseClient';
import type { Database } from './supabaseClient';

// Type aliases for easier use
type Building = Database['public']['Tables']['buildings']['Row'];
type BuildingInsert = Database['public']['Tables']['buildings']['Insert'];
type BuildingUpdate = Database['public']['Tables']['buildings']['Update'];

type Member = Database['public']['Tables']['members']['Row'];
type MemberInsert = Database['public']['Tables']['members']['Insert'];
type MemberUpdate = Database['public']['Tables']['members']['Update'];

type Vote = Database['public']['Tables']['votes']['Row'];
type VoteInsert = Database['public']['Tables']['votes']['Insert'];
type VoteUpdate = Database['public']['Tables']['votes']['Update'];

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];
type EmailTemplateInsert = Database['public']['Tables']['email_templates']['Insert'];
type EmailTemplateUpdate = Database['public']['Tables']['email_templates']['Update'];

type GlobalVariable = Database['public']['Tables']['global_variables']['Row'];
type GlobalVariableInsert = Database['public']['Tables']['global_variables']['Insert'];
type GlobalVariableUpdate = Database['public']['Tables']['global_variables']['Update'];

type Observer = Database['public']['Tables']['observers']['Row'];
type ObserverInsert = Database['public']['Tables']['observers']['Insert'];

export class DatabaseService {
  // Buildings
  static async getBuildings(): Promise<Building[]> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async getBuildingById(id: string): Promise<Building | null> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createBuilding(building: BuildingInsert): Promise<Building> {
    const { data, error } = await supabase
      .from('buildings')
      .insert(building)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateBuilding(id: string, updates: BuildingUpdate): Promise<Building> {
    const { data, error } = await supabase
      .from('buildings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteBuilding(id: string): Promise<void> {
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Members
  static async getMembersByBuilding(buildingId: string): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('building_id', buildingId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async createMember(member: MemberInsert): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateMember(id: string, updates: MemberUpdate): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async importMembers(members: MemberInsert[]): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .insert(members)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Votes
  static async getVotesByBuilding(buildingId: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('building_id', buildingId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getVoteById(id: string): Promise<Vote | null> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createVote(vote: VoteInsert): Promise<Vote> {
    const { data, error } = await supabase
      .from('votes')
      .insert(vote)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateVote(id: string, updates: VoteUpdate): Promise<Vote> {
    const { data, error } = await supabase
      .from('votes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteVote(id: string): Promise<void> {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Questions
  static async getQuestionsByVote(voteId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('vote_id', voteId)
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  static async createQuestions(questions: QuestionInsert[]): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();
    
    if (error) throw error;
    return data;
  }

  static async deleteQuestionsByVote(voteId: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('vote_id', voteId);
    
    if (error) throw error;
  }

  // Email Templates
  static async getTemplates(buildingId?: string): Promise<EmailTemplate[]> {
    let query = supabase
      .from('email_templates')
      .select('*');
    
    if (buildingId) {
      query = query.or(`building_id.eq.${buildingId},is_global.eq.true`);
    } else {
      query = query.eq('is_global', true);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async createTemplate(template: EmailTemplateInsert): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTemplate(id: string, updates: EmailTemplateUpdate): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Global Variables
  static async getGlobalVariables(): Promise<GlobalVariable[]> {
    const { data, error } = await supabase
      .from('global_variables')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async createGlobalVariable(variable: GlobalVariableInsert): Promise<GlobalVariable> {
    const { data, error } = await supabase
      .from('global_variables')
      .insert(variable)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateGlobalVariable(name: string, updates: GlobalVariableUpdate): Promise<GlobalVariable> {
    const { data, error } = await supabase
      .from('global_variables')
      .update(updates)
      .eq('name', name)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteGlobalVariable(name: string): Promise<void> {
    const { error } = await supabase
      .from('global_variables')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
  }

  // Building Variable Definitions
  static async getBuildingVariableDefinitions() {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Observers
  static async getObserversByBuilding(buildingId: string): Promise<Observer[]> {
    const { data, error } = await supabase
      .from('observers')
      .select('*')
      .eq('building_id', buildingId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async createObserver(observer: ObserverInsert): Promise<Observer> {
    const { data, error } = await supabase
      .from('observers')
      .insert(observer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteObserver(id: string): Promise<void> {
    const { error } = await supabase
      .from('observers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Voting Tokens
  static async createVotingTokens(voteId: string, memberIds: string[]): Promise<void> {
    const tokens = memberIds.map(memberId => ({
      vote_id: voteId,
      member_id: memberId,
      token: this.generateToken(),
      verification_code: this.generateVerificationCode(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }));

    const { error } = await supabase
      .from('voting_tokens')
      .insert(tokens);
    
    if (error) throw error;
  }

  static async getVotingToken(token: string): Promise<any> {
    const { data, error } = await supabase
      .from('voting_tokens')
      .select(`
        *,
        vote:votes(*),
        member:members(*)
      `)
      .eq('token', token)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async verifyVotingToken(token: string, verificationCode: string): Promise<void> {
    const { error } = await supabase
      .from('voting_tokens')
      .update({ 
        is_verified: true, 
        verified_at: new Date().toISOString() 
      })
      .eq('token', token)
      .eq('verification_code', verificationCode);
    
    if (error) throw error;
  }

  static async submitVote(
    voteId: string, 
    memberId: string, 
    answers: { questionId: string; answer: 'yes' | 'no' | 'abstain' }[]
  ): Promise<void> {
    // First, mark the token as used
    await supabase
      .from('voting_tokens')
      .update({ 
        is_used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('vote_id', voteId)
      .eq('member_id', memberId);

    // Then insert the votes
    const votes = answers.map(answer => ({
      vote_id: voteId,
      member_id: memberId,
      question_id: answer.questionId,
      answer: answer.answer
    }));

    const { error } = await supabase
      .from('member_votes')
      .insert(votes);
    
    if (error) throw error;
  }

  static async getVoteResults(voteId: string): Promise<any> {
    const { data, error } = await supabase
      .from('member_votes')
      .select(`
        *,
        member:members(*),
        question:questions(*)
      `)
      .eq('vote_id', voteId);
    
    if (error) throw error;
    return data || [];
  }

  // Helper methods
  private static generateToken(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Export types for use in components
export type {
  Building,
  BuildingInsert,
  BuildingUpdate,
  Member,
  MemberInsert,
  MemberUpdate,
  Vote,
  VoteInsert,
  VoteUpdate,
  Question,
  QuestionInsert,
  EmailTemplate,
  EmailTemplateInsert,
  EmailTemplateUpdate,
  GlobalVariable,
  GlobalVariableInsert,
  GlobalVariableUpdate,
  Observer,
  ObserverInsert
};
