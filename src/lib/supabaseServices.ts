import { supabase } from './supabaseClient';
import { 
  Building, 
  Member, 
  Vote, 
  EmailTemplate, 
  GlobalVariable, 
  BuildingVariable, 
  Observer 
} from '../data/mockData';

// Helper function to handle Supabase errors with more context
const handleSupabaseError = (error: any, operation: string) => {
  // Wrap error with context for UI toast; avoid noisy console logs
  throw new Error(`${operation} failed: ${error?.message || error?.details || 'Unknown error'}`);
};

// Building Services
export const buildingService = {
  async getAll(): Promise<Building[]> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*');
    
    if (error) {
      handleSupabaseError(error, 'fetching buildings');
    }
    
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      address: row.address,
      totalUnits: row.total_units,
      variables: row.variables || {}
    }));
  },

  async create(building: Omit<Building, 'id'>): Promise<Building> {
    const { data, error } = await supabase
      .from('buildings')
      .insert({
        name: building.name,
        address: building.address,
        total_units: building.totalUnits,
        variables: building.variables
      })
      .select()
      .single();
    
    if (error) {
      handleSupabaseError(error, 'creating building');
    }
    
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      totalUnits: data.total_units,
      variables: data.variables || {}
    };
  },

  async update(building: Building): Promise<Building> {
    const { data, error } = await supabase
      .from('buildings')
      .update({
        name: building.name,
        address: building.address,
        total_units: building.totalUnits,
        variables: building.variables
      })
      .eq('id', building.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      totalUnits: data.total_units,
      variables: data.variables || {}
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Member Services
export const memberService = {
  async getByBuildingId(buildingId: string): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('building_id', buildingId);
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      unit: row.unit,
      voteWeight: row.vote_weight,
      representativeId: row.representative_id || undefined,
      buildingId: row.building_id
    }));
  },

  async getAll(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*');
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      unit: row.unit,
      voteWeight: row.vote_weight,
      representativeId: row.representative_id || undefined,
      buildingId: row.building_id
    }));
  },

  async create(member: Omit<Member, 'id'>): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .insert({
        name: member.name,
        email: member.email,
        phone: member.phone || null,
        unit: member.unit,
        vote_weight: member.voteWeight,
        representative_id: member.representativeId || null,
        building_id: member.buildingId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      unit: data.unit,
      voteWeight: data.vote_weight,
      representativeId: data.representative_id || undefined,
      buildingId: data.building_id
    };
  },

  async update(member: Member): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .update({
        name: member.name,
        email: member.email,
        phone: member.phone || null,
        unit: member.unit,
        vote_weight: member.voteWeight,
        representative_id: member.representativeId || null,
        building_id: member.buildingId
      })
      .eq('id', member.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      unit: data.unit,
      voteWeight: data.vote_weight,
      representativeId: data.representative_id || undefined,
      buildingId: data.building_id
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async importMembers(members: Omit<Member, 'id'>[]): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .insert(members.map(member => ({
        name: member.name,
        email: member.email,
        phone: member.phone || null,
        unit: member.unit,
        vote_weight: member.voteWeight,
        representative_id: member.representativeId || null,
        building_id: member.buildingId
      })))
      .select();
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      unit: row.unit,
      voteWeight: row.vote_weight,
      representativeId: row.representative_id || undefined,
      buildingId: row.building_id
    }));
  }
};

// Vote Services
export const voteService = {
  async getByBuildingId(buildingId: string): Promise<Vote[]> {
    // Get votes with questions
    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select(`
        *,
        questions (*)
      `)
      .eq('building_id', buildingId);
    
    if (votesError) throw votesError;

    // Get member votes for each vote
    const votes: Vote[] = [];
    for (const voteRow of votesData) {
      const { data: memberVotesData, error: memberVotesError } = await supabase
        .from('member_votes')
        .select('*')
        .eq('vote_id', voteRow.id);
      
      if (memberVotesError) throw memberVotesError;

      // Transform member votes to the expected format
      const memberVotes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>> = {};
      memberVotesData.forEach(vote => {
        if (!memberVotes[vote.member_id]) {
          memberVotes[vote.member_id] = {};
        }
        memberVotes[vote.member_id][vote.question_id] = vote.answer as 'yes' | 'no' | 'abstain';
      });

      // Get manual vote attachments
      const { data: attachmentsData } = await supabase
        .from('manual_vote_attachments')
        .select('*')
        .eq('vote_id', voteRow.id);

      const manualVoteAttachments: Record<string, string[]> = {};
      attachmentsData?.forEach(attachment => {
        if (!manualVoteAttachments[attachment.member_id]) {
          manualVoteAttachments[attachment.member_id] = [];
        }
        manualVoteAttachments[attachment.member_id].push(attachment.attachment_name);
      });

      // Get manual vote notes
      const { data: notesData } = await supabase
        .from('manual_vote_notes')
        .select('*')
        .eq('vote_id', voteRow.id);

      const manualVoteNotes: Record<string, string> = {};
      notesData?.forEach(note => {
        manualVoteNotes[note.member_id] = note.note;
      });

      votes.push({
        id: voteRow.id,
        title: voteRow.title,
        description: voteRow.description,
        buildingId: voteRow.building_id,
        status: voteRow.status as 'draft' | 'active' | 'completed' | 'cancelled',
        questions: voteRow.questions.map((q: {
          id: string;
          text: string;
          quorum_type: string;
          custom_quorum_numerator?: number;
          custom_quorum_denominator?: number;
        }) => ({
          id: q.id,
          text: q.text,
          quorumType: q.quorum_type as 'simple' | 'qualified' | 'unanimous' | 'custom',
          customQuorum: q.custom_quorum_numerator && q.custom_quorum_denominator ? {
            numerator: q.custom_quorum_numerator,
            denominator: q.custom_quorum_denominator
          } : undefined
        })),
        createdAt: voteRow.created_at,
        startDate: voteRow.start_date || undefined,
        endDate: voteRow.end_date || undefined,
        attachments: voteRow.attachments || undefined,
        memberVotes,
        observers: voteRow.observers || [],
        manualVoteAttachments: Object.keys(manualVoteAttachments).length > 0 ? manualVoteAttachments : undefined,
        manualVoteNotes: Object.keys(manualVoteNotes).length > 0 ? manualVoteNotes : undefined
      });
    }

    return votes;
  },

  async getAll(): Promise<Vote[]> {
    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select(`
        *,
        questions (*)
      `);
    
    if (votesError) throw votesError;

    const votes: Vote[] = [];
    for (const voteRow of votesData) {
      const { data: memberVotesData, error: memberVotesError } = await supabase
        .from('member_votes')
        .select('*')
        .eq('vote_id', voteRow.id);
      
      if (memberVotesError) throw memberVotesError;

      const memberVotes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>> = {};
      memberVotesData.forEach(vote => {
        if (!memberVotes[vote.member_id]) {
          memberVotes[vote.member_id] = {};
        }
        memberVotes[vote.member_id][vote.question_id] = vote.answer as 'yes' | 'no' | 'abstain';
      });

      votes.push({
        id: voteRow.id,
        title: voteRow.title,
        description: voteRow.description,
        buildingId: voteRow.building_id,
        status: voteRow.status as 'draft' | 'active' | 'completed' | 'cancelled',
        questions: voteRow.questions.map((q: {
          id: string;
          text: string;
          quorum_type: string;
          custom_quorum_numerator?: number;
          custom_quorum_denominator?: number;
        }) => ({
          id: q.id,
          text: q.text,
          quorumType: q.quorum_type as 'simple' | 'qualified' | 'unanimous' | 'custom',
          customQuorum: q.custom_quorum_numerator && q.custom_quorum_denominator ? {
            numerator: q.custom_quorum_numerator,
            denominator: q.custom_quorum_denominator
          } : undefined
        })),
        createdAt: voteRow.created_at,
        startDate: voteRow.start_date || undefined,
        endDate: voteRow.end_date || undefined,
        attachments: voteRow.attachments || undefined,
        memberVotes,
        observers: voteRow.observers || []
      });
    }

    return votes;
  },

  async create(vote: Omit<Vote, 'id'>): Promise<Vote> {
    // Create vote
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert({
        title: vote.title,
        description: vote.description,
        building_id: vote.buildingId,
        status: vote.status,
        created_at: vote.createdAt,
        start_date: vote.startDate || null,
        end_date: vote.endDate || null,
        attachments: vote.attachments || null,
        observers: vote.observers || null
      })
      .select()
      .single();
    
    if (voteError) throw voteError;

    // Create questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .insert(vote.questions.map(q => ({
        vote_id: voteData.id,
        text: q.text,
        quorum_type: q.quorumType,
        custom_quorum_numerator: q.customQuorum?.numerator || null,
        custom_quorum_denominator: q.customQuorum?.denominator || null
      })))
      .select();
    
    if (questionsError) throw questionsError;

    return {
      id: voteData.id,
      title: voteData.title,
      description: voteData.description,
      buildingId: voteData.building_id,
      status: voteData.status as 'draft' | 'active' | 'completed' | 'cancelled',
      questions: questionsData.map(q => ({
        id: q.id,
        text: q.text,
        quorumType: q.quorum_type as 'simple' | 'qualified' | 'unanimous' | 'custom',
        customQuorum: q.custom_quorum_numerator && q.custom_quorum_denominator ? {
          numerator: q.custom_quorum_numerator,
          denominator: q.custom_quorum_denominator
        } : undefined
      })),
      createdAt: voteData.created_at,
      startDate: voteData.start_date || undefined,
      endDate: voteData.end_date || undefined,
      attachments: voteData.attachments || undefined,
      memberVotes: vote.memberVotes || {},
      observers: voteData.observers || []
    };
  },

  async update(vote: Vote): Promise<Vote> {
    // Update vote
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .update({
        title: vote.title,
        description: vote.description,
        building_id: vote.buildingId,
        status: vote.status,
        start_date: vote.startDate || null,
        end_date: vote.endDate || null,
        attachments: vote.attachments || null,
        observers: vote.observers || null
      })
      .eq('id', vote.id)
      .select()
      .single();
    
    if (voteError) throw voteError;

    return {
      ...vote,
      title: voteData.title,
      description: voteData.description,
      buildingId: voteData.building_id,
      status: voteData.status as 'draft' | 'active' | 'completed' | 'cancelled',
      startDate: voteData.start_date || undefined,
      endDate: voteData.end_date || undefined,
      attachments: voteData.attachments || undefined,
      observers: voteData.observers || []
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async castVote(voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string): Promise<void> {
    // Delete existing votes for this member
    await supabase
      .from('member_votes')
      .delete()
      .eq('vote_id', voteId)
      .eq('member_id', memberId);

    // Insert new votes
    const votesToInsert = Object.entries(answers).map(([questionId, answer]) => ({
      vote_id: voteId,
      member_id: memberId,
      question_id: questionId,
      answer
    }));

    const { error: voteError } = await supabase
      .from('member_votes')
      .insert(votesToInsert);
    
    if (voteError) throw voteError;

    // Handle attachments if provided
    if (attachments && attachments.length > 0) {
      // Delete existing attachments
      await supabase
        .from('manual_vote_attachments')
        .delete()
        .eq('vote_id', voteId)
        .eq('member_id', memberId);

      // Insert new attachments
      const attachmentsToInsert = attachments.map(attachment => ({
        vote_id: voteId,
        member_id: memberId,
        attachment_name: attachment
      }));

      const { error: attachmentError } = await supabase
        .from('manual_vote_attachments')
        .insert(attachmentsToInsert);
      
      if (attachmentError) throw attachmentError;
    }

    // Handle note if provided
    if (note) {
      // Delete existing note
      await supabase
        .from('manual_vote_notes')
        .delete()
        .eq('vote_id', voteId)
        .eq('member_id', memberId);

      // Insert new note
      const { error: noteError } = await supabase
        .from('manual_vote_notes')
        .insert({
          vote_id: voteId,
          member_id: memberId,
          note
        });
      
      if (noteError) throw noteError;
    }
  }
};

// Template Services
export const templateService = {
  async getAll(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*');
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      subject: row.subject,
      body: row.body,
      buildingId: row.building_id || undefined,
      isGlobal: row.is_global,
      customVariables: row.custom_variables || undefined
    }));
  },

  async create(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        name: template.name,
        subject: template.subject,
        body: template.body,
        building_id: template.buildingId || null,
        is_global: template.isGlobal,
        custom_variables: template.customVariables || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      body: data.body,
      buildingId: data.building_id || undefined,
      isGlobal: data.is_global,
      customVariables: data.custom_variables || undefined
    };
  },

  async update(template: EmailTemplate): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update({
        name: template.name,
        subject: template.subject,
        body: template.body,
        building_id: template.buildingId || null,
        is_global: template.isGlobal,
        custom_variables: template.customVariables || null
      })
      .eq('id', template.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      body: data.body,
      buildingId: data.building_id || undefined,
      isGlobal: data.is_global,
      customVariables: data.custom_variables || undefined
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Global Variables Services
export const globalVariableService = {
  async getAll(): Promise<GlobalVariable[]> {
    const { data, error } = await supabase
      .from('global_variables')
      .select('*');
    
    if (error) throw error;
    
    return data.map(row => ({
      name: row.name,
      description: row.description,
      value: row.value,
      isEditable: row.is_editable
    }));
  },

  async create(variable: GlobalVariable): Promise<GlobalVariable> {
    const { data, error } = await supabase
      .from('global_variables')
      .insert({
        name: variable.name,
        description: variable.description,
        value: variable.value,
        is_editable: variable.isEditable ?? true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      name: data.name,
      description: data.description,
      value: data.value,
      isEditable: data.is_editable
    };
  },

  async update(variable: GlobalVariable): Promise<GlobalVariable> {
    const { data, error } = await supabase
      .from('global_variables')
      .update({
        description: variable.description,
        value: variable.value,
        is_editable: variable.isEditable ?? true
      })
      .eq('name', variable.name)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      name: data.name,
      description: data.description,
      value: data.value,
      isEditable: data.is_editable
    };
  },

  async delete(name: string): Promise<void> {
    const { error } = await supabase
      .from('global_variables')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
  }
};

// Building Variables Services
export const buildingVariableService = {
  async getAll(): Promise<BuildingVariable[]> {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .select('*');
    
    if (error) throw error;
    
    return data.map(row => ({
      name: row.name,
      description: row.description,
      type: row.type as 'text' | 'textarea' | 'select',
      options: row.options || undefined,
      required: row.required,
      placeholder: row.placeholder || undefined
    }));
  },

  async create(variable: BuildingVariable): Promise<BuildingVariable> {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .insert({
        name: variable.name,
        description: variable.description,
        type: variable.type,
        options: variable.options || null,
        required: variable.required ?? false,
        placeholder: variable.placeholder || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      name: data.name,
      description: data.description,
      type: data.type as 'text' | 'textarea' | 'select',
      options: data.options || undefined,
      required: data.required,
      placeholder: data.placeholder || undefined
    };
  },

  async update(variable: BuildingVariable): Promise<BuildingVariable> {
    const { data, error } = await supabase
      .from('building_variable_definitions')
      .update({
        description: variable.description,
        type: variable.type,
        options: variable.options || null,
        required: variable.required ?? false,
        placeholder: variable.placeholder || null
      })
      .eq('name', variable.name)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      name: data.name,
      description: data.description,
      type: data.type as 'text' | 'textarea' | 'select',
      options: data.options || undefined,
      required: data.required,
      placeholder: data.placeholder || undefined
    };
  },

  async delete(name: string): Promise<void> {
    const { error } = await supabase
      .from('building_variable_definitions')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
  }
};

// Observer Services
export const observerService = {
  async getByBuildingId(buildingId: string): Promise<Observer[]> {
    const { data, error } = await supabase
      .from('observers')
      .select('*')
      .eq('building_id', buildingId);
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      buildingId: row.building_id,
      createdAt: row.created_at
    }));
  },

  async getAll(): Promise<Observer[]> {
    const { data, error } = await supabase
      .from('observers')
      .select('*');
    
    if (error) throw error;
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      buildingId: row.building_id,
      createdAt: row.created_at
    }));
  },

  async create(observer: Omit<Observer, 'id'>): Promise<Observer> {
    const { data, error } = await supabase
      .from('observers')
      .insert({
        name: observer.name,
        email: observer.email,
        building_id: observer.buildingId,
        created_at: observer.createdAt
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      buildingId: data.building_id,
      createdAt: data.created_at
    };
  },

  async update(observer: Observer): Promise<Observer> {
    const { data, error } = await supabase
      .from('observers')
      .update({
        name: observer.name,
        email: observer.email,
        building_id: observer.buildingId
      })
      .eq('id', observer.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      buildingId: data.building_id,
      createdAt: data.created_at
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('observers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
