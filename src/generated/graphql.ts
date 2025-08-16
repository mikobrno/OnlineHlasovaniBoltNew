import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  bigint: { input: any; output: any; }
  bytea: { input: any; output: any; }
  citext: { input: any; output: any; }
  inet: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamptz: { input: string; output: string; }
  uuid: { input: string; output: string; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['String']['input']>>;
  _eq?: InputMaybe<Array<Scalars['String']['input']>>;
  _gt?: InputMaybe<Array<Scalars['String']['input']>>;
  _gte?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['String']['input']>>;
  _lte?: InputMaybe<Array<Scalars['String']['input']>>;
  _neq?: InputMaybe<Array<Scalars['String']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "attachments" */
export type Attachments = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  entity_id: Scalars['uuid']['output'];
  entity_type: Scalars['String']['output'];
  file_name: Scalars['String']['output'];
  file_path: Scalars['String']['output'];
  file_size?: Maybe<Scalars['Int']['output']>;
  id: Scalars['uuid']['output'];
  is_public?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  mime_type?: Maybe<Scalars['String']['output']>;
  uploaded_by?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "attachments" */
export type AttachmentsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "attachments" */
export type Attachments_Aggregate = {
  aggregate?: Maybe<Attachments_Aggregate_Fields>;
  nodes: Array<Attachments>;
};

/** aggregate fields of "attachments" */
export type Attachments_Aggregate_Fields = {
  avg?: Maybe<Attachments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Attachments_Max_Fields>;
  min?: Maybe<Attachments_Min_Fields>;
  stddev?: Maybe<Attachments_Stddev_Fields>;
  stddev_pop?: Maybe<Attachments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Attachments_Stddev_Samp_Fields>;
  sum?: Maybe<Attachments_Sum_Fields>;
  var_pop?: Maybe<Attachments_Var_Pop_Fields>;
  var_samp?: Maybe<Attachments_Var_Samp_Fields>;
  variance?: Maybe<Attachments_Variance_Fields>;
};


/** aggregate fields of "attachments" */
export type Attachments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Attachments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Attachments_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Attachments_Avg_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "attachments". All fields are combined with a logical 'AND'. */
export type Attachments_Bool_Exp = {
  _and?: InputMaybe<Array<Attachments_Bool_Exp>>;
  _not?: InputMaybe<Attachments_Bool_Exp>;
  _or?: InputMaybe<Array<Attachments_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  entity_id?: InputMaybe<Uuid_Comparison_Exp>;
  entity_type?: InputMaybe<String_Comparison_Exp>;
  file_name?: InputMaybe<String_Comparison_Exp>;
  file_path?: InputMaybe<String_Comparison_Exp>;
  file_size?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_public?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mime_type?: InputMaybe<String_Comparison_Exp>;
  uploaded_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "attachments" */
export enum Attachments_Constraint {
  /** unique or primary key constraint on columns "id" */
  AttachmentsPkey = 'attachments_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Attachments_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Attachments_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Attachments_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "attachments" */
export type Attachments_Inc_Input = {
  file_size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "attachments" */
export type Attachments_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  file_name?: InputMaybe<Scalars['String']['input']>;
  file_path?: InputMaybe<Scalars['String']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_public?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mime_type?: InputMaybe<Scalars['String']['input']>;
  uploaded_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Attachments_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  entity_id?: Maybe<Scalars['uuid']['output']>;
  entity_type?: Maybe<Scalars['String']['output']>;
  file_name?: Maybe<Scalars['String']['output']>;
  file_path?: Maybe<Scalars['String']['output']>;
  file_size?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  mime_type?: Maybe<Scalars['String']['output']>;
  uploaded_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Attachments_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  entity_id?: Maybe<Scalars['uuid']['output']>;
  entity_type?: Maybe<Scalars['String']['output']>;
  file_name?: Maybe<Scalars['String']['output']>;
  file_path?: Maybe<Scalars['String']['output']>;
  file_size?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  mime_type?: Maybe<Scalars['String']['output']>;
  uploaded_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "attachments" */
export type Attachments_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Attachments>;
};

/** on_conflict condition type for table "attachments" */
export type Attachments_On_Conflict = {
  constraint: Attachments_Constraint;
  update_columns?: Array<Attachments_Update_Column>;
  where?: InputMaybe<Attachments_Bool_Exp>;
};

/** Ordering options when selecting data from "attachments". */
export type Attachments_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  entity_id?: InputMaybe<Order_By>;
  entity_type?: InputMaybe<Order_By>;
  file_name?: InputMaybe<Order_By>;
  file_path?: InputMaybe<Order_By>;
  file_size?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_public?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mime_type?: InputMaybe<Order_By>;
  uploaded_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: attachments */
export type Attachments_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Attachments_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "attachments" */
export enum Attachments_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  FileName = 'file_name',
  /** column name */
  FilePath = 'file_path',
  /** column name */
  FileSize = 'file_size',
  /** column name */
  Id = 'id',
  /** column name */
  IsPublic = 'is_public',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MimeType = 'mime_type',
  /** column name */
  UploadedBy = 'uploaded_by'
}

/** input type for updating data in table "attachments" */
export type Attachments_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  file_name?: InputMaybe<Scalars['String']['input']>;
  file_path?: InputMaybe<Scalars['String']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_public?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mime_type?: InputMaybe<Scalars['String']['input']>;
  uploaded_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Attachments_Stddev_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Attachments_Stddev_Pop_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Attachments_Stddev_Samp_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "attachments" */
export type Attachments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Attachments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Attachments_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  file_name?: InputMaybe<Scalars['String']['input']>;
  file_path?: InputMaybe<Scalars['String']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_public?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mime_type?: InputMaybe<Scalars['String']['input']>;
  uploaded_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Attachments_Sum_Fields = {
  file_size?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "attachments" */
export enum Attachments_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  FileName = 'file_name',
  /** column name */
  FilePath = 'file_path',
  /** column name */
  FileSize = 'file_size',
  /** column name */
  Id = 'id',
  /** column name */
  IsPublic = 'is_public',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MimeType = 'mime_type',
  /** column name */
  UploadedBy = 'uploaded_by'
}

export type Attachments_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Attachments_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Attachments_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Attachments_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Attachments_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Attachments_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Attachments_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Attachments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Attachments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Attachments_Var_Pop_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Attachments_Var_Samp_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Attachments_Variance_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "audit_log" */
export type Audit_Log = {
  action: Scalars['String']['output'];
  actor_id?: Maybe<Scalars['uuid']['output']>;
  actor_name?: Maybe<Scalars['String']['output']>;
  actor_type?: Maybe<Scalars['String']['output']>;
  changes?: Maybe<Scalars['jsonb']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  entity_id: Scalars['uuid']['output'];
  entity_type: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  ip_address?: Maybe<Scalars['inet']['output']>;
  new_data?: Maybe<Scalars['jsonb']['output']>;
  old_data?: Maybe<Scalars['jsonb']['output']>;
  session_id?: Maybe<Scalars['String']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "audit_log" */
export type Audit_LogChangesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit_log" */
export type Audit_LogNew_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "audit_log" */
export type Audit_LogOld_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit_log" */
export type Audit_Log_Aggregate = {
  aggregate?: Maybe<Audit_Log_Aggregate_Fields>;
  nodes: Array<Audit_Log>;
};

/** aggregate fields of "audit_log" */
export type Audit_Log_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Audit_Log_Max_Fields>;
  min?: Maybe<Audit_Log_Min_Fields>;
};


/** aggregate fields of "audit_log" */
export type Audit_Log_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Audit_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Audit_Log_Append_Input = {
  changes?: InputMaybe<Scalars['jsonb']['input']>;
  new_data?: InputMaybe<Scalars['jsonb']['input']>;
  old_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit_log". All fields are combined with a logical 'AND'. */
export type Audit_Log_Bool_Exp = {
  _and?: InputMaybe<Array<Audit_Log_Bool_Exp>>;
  _not?: InputMaybe<Audit_Log_Bool_Exp>;
  _or?: InputMaybe<Array<Audit_Log_Bool_Exp>>;
  action?: InputMaybe<String_Comparison_Exp>;
  actor_id?: InputMaybe<Uuid_Comparison_Exp>;
  actor_name?: InputMaybe<String_Comparison_Exp>;
  actor_type?: InputMaybe<String_Comparison_Exp>;
  changes?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  entity_id?: InputMaybe<Uuid_Comparison_Exp>;
  entity_type?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ip_address?: InputMaybe<Inet_Comparison_Exp>;
  new_data?: InputMaybe<Jsonb_Comparison_Exp>;
  old_data?: InputMaybe<Jsonb_Comparison_Exp>;
  session_id?: InputMaybe<String_Comparison_Exp>;
  user_agent?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "audit_log" */
export enum Audit_Log_Constraint {
  /** unique or primary key constraint on columns "id" */
  AuditLogPkey = 'audit_log_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Audit_Log_Delete_At_Path_Input = {
  changes?: InputMaybe<Array<Scalars['String']['input']>>;
  new_data?: InputMaybe<Array<Scalars['String']['input']>>;
  old_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Audit_Log_Delete_Elem_Input = {
  changes?: InputMaybe<Scalars['Int']['input']>;
  new_data?: InputMaybe<Scalars['Int']['input']>;
  old_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Audit_Log_Delete_Key_Input = {
  changes?: InputMaybe<Scalars['String']['input']>;
  new_data?: InputMaybe<Scalars['String']['input']>;
  old_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit_log" */
export type Audit_Log_Insert_Input = {
  action?: InputMaybe<Scalars['String']['input']>;
  actor_id?: InputMaybe<Scalars['uuid']['input']>;
  actor_name?: InputMaybe<Scalars['String']['input']>;
  actor_type?: InputMaybe<Scalars['String']['input']>;
  changes?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  new_data?: InputMaybe<Scalars['jsonb']['input']>;
  old_data?: InputMaybe<Scalars['jsonb']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Audit_Log_Max_Fields = {
  action?: Maybe<Scalars['String']['output']>;
  actor_id?: Maybe<Scalars['uuid']['output']>;
  actor_name?: Maybe<Scalars['String']['output']>;
  actor_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  entity_id?: Maybe<Scalars['uuid']['output']>;
  entity_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  session_id?: Maybe<Scalars['String']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Audit_Log_Min_Fields = {
  action?: Maybe<Scalars['String']['output']>;
  actor_id?: Maybe<Scalars['uuid']['output']>;
  actor_name?: Maybe<Scalars['String']['output']>;
  actor_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  entity_id?: Maybe<Scalars['uuid']['output']>;
  entity_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  session_id?: Maybe<Scalars['String']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "audit_log" */
export type Audit_Log_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Audit_Log>;
};

/** on_conflict condition type for table "audit_log" */
export type Audit_Log_On_Conflict = {
  constraint: Audit_Log_Constraint;
  update_columns?: Array<Audit_Log_Update_Column>;
  where?: InputMaybe<Audit_Log_Bool_Exp>;
};

/** Ordering options when selecting data from "audit_log". */
export type Audit_Log_Order_By = {
  action?: InputMaybe<Order_By>;
  actor_id?: InputMaybe<Order_By>;
  actor_name?: InputMaybe<Order_By>;
  actor_type?: InputMaybe<Order_By>;
  changes?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  entity_id?: InputMaybe<Order_By>;
  entity_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ip_address?: InputMaybe<Order_By>;
  new_data?: InputMaybe<Order_By>;
  old_data?: InputMaybe<Order_By>;
  session_id?: InputMaybe<Order_By>;
  user_agent?: InputMaybe<Order_By>;
};

/** primary key columns input for table: audit_log */
export type Audit_Log_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Audit_Log_Prepend_Input = {
  changes?: InputMaybe<Scalars['jsonb']['input']>;
  new_data?: InputMaybe<Scalars['jsonb']['input']>;
  old_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit_log" */
export enum Audit_Log_Select_Column {
  /** column name */
  Action = 'action',
  /** column name */
  ActorId = 'actor_id',
  /** column name */
  ActorName = 'actor_name',
  /** column name */
  ActorType = 'actor_type',
  /** column name */
  Changes = 'changes',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  NewData = 'new_data',
  /** column name */
  OldData = 'old_data',
  /** column name */
  SessionId = 'session_id',
  /** column name */
  UserAgent = 'user_agent'
}

/** input type for updating data in table "audit_log" */
export type Audit_Log_Set_Input = {
  action?: InputMaybe<Scalars['String']['input']>;
  actor_id?: InputMaybe<Scalars['uuid']['input']>;
  actor_name?: InputMaybe<Scalars['String']['input']>;
  actor_type?: InputMaybe<Scalars['String']['input']>;
  changes?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  new_data?: InputMaybe<Scalars['jsonb']['input']>;
  old_data?: InputMaybe<Scalars['jsonb']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "audit_log" */
export type Audit_Log_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Audit_Log_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Audit_Log_Stream_Cursor_Value_Input = {
  action?: InputMaybe<Scalars['String']['input']>;
  actor_id?: InputMaybe<Scalars['uuid']['input']>;
  actor_name?: InputMaybe<Scalars['String']['input']>;
  actor_type?: InputMaybe<Scalars['String']['input']>;
  changes?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  entity_id?: InputMaybe<Scalars['uuid']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  new_data?: InputMaybe<Scalars['jsonb']['input']>;
  old_data?: InputMaybe<Scalars['jsonb']['input']>;
  session_id?: InputMaybe<Scalars['String']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "audit_log" */
export enum Audit_Log_Update_Column {
  /** column name */
  Action = 'action',
  /** column name */
  ActorId = 'actor_id',
  /** column name */
  ActorName = 'actor_name',
  /** column name */
  ActorType = 'actor_type',
  /** column name */
  Changes = 'changes',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EntityId = 'entity_id',
  /** column name */
  EntityType = 'entity_type',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  NewData = 'new_data',
  /** column name */
  OldData = 'old_data',
  /** column name */
  SessionId = 'session_id',
  /** column name */
  UserAgent = 'user_agent'
}

export type Audit_Log_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Audit_Log_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Audit_Log_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Audit_Log_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Audit_Log_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Audit_Log_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Audit_Log_Set_Input>;
  /** filter the rows which have to be updated */
  where: Audit_Log_Bool_Exp;
};

/** Oauth requests, inserted before redirecting to the provider's site. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProviderRequests = {
  id: Scalars['uuid']['output'];
  options?: Maybe<Scalars['jsonb']['output']>;
};


/** Oauth requests, inserted before redirecting to the provider's site. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProviderRequestsOptionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate = {
  aggregate?: Maybe<AuthProviderRequests_Aggregate_Fields>;
  nodes: Array<AuthProviderRequests>;
};

/** aggregate fields of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthProviderRequests_Max_Fields>;
  min?: Maybe<AuthProviderRequests_Min_Fields>;
};


/** aggregate fields of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuthProviderRequests_Append_Input = {
  options?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "auth.provider_requests". All fields are combined with a logical 'AND'. */
export type AuthProviderRequests_Bool_Exp = {
  _and?: InputMaybe<Array<AuthProviderRequests_Bool_Exp>>;
  _not?: InputMaybe<AuthProviderRequests_Bool_Exp>;
  _or?: InputMaybe<Array<AuthProviderRequests_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  options?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.provider_requests" */
export enum AuthProviderRequests_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProviderRequestsPkey = 'provider_requests_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuthProviderRequests_Delete_At_Path_Input = {
  options?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuthProviderRequests_Delete_Elem_Input = {
  options?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuthProviderRequests_Delete_Key_Input = {
  options?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "auth.provider_requests" */
export type AuthProviderRequests_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  options?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type AuthProviderRequests_Max_Fields = {
  id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type AuthProviderRequests_Min_Fields = {
  id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "auth.provider_requests" */
export type AuthProviderRequests_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthProviderRequests>;
};

/** on_conflict condition type for table "auth.provider_requests" */
export type AuthProviderRequests_On_Conflict = {
  constraint: AuthProviderRequests_Constraint;
  update_columns?: Array<AuthProviderRequests_Update_Column>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.provider_requests". */
export type AuthProviderRequests_Order_By = {
  id?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.provider_requests */
export type AuthProviderRequests_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuthProviderRequests_Prepend_Input = {
  options?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "auth.provider_requests" */
export enum AuthProviderRequests_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Options = 'options'
}

/** input type for updating data in table "auth.provider_requests" */
export type AuthProviderRequests_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  options?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "authProviderRequests" */
export type AuthProviderRequests_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthProviderRequests_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthProviderRequests_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  options?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "auth.provider_requests" */
export enum AuthProviderRequests_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Options = 'options'
}

export type AuthProviderRequests_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthProviderRequests_Bool_Exp;
};

/** List of available Oauth providers. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProviders = {
  id: Scalars['String']['output'];
  /** An array relationship */
  userProviders: Array<AuthUserProviders>;
  /** An aggregate relationship */
  userProviders_aggregate: AuthUserProviders_Aggregate;
};


/** List of available Oauth providers. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProvidersUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


/** List of available Oauth providers. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProvidersUserProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** aggregated selection of "auth.providers" */
export type AuthProviders_Aggregate = {
  aggregate?: Maybe<AuthProviders_Aggregate_Fields>;
  nodes: Array<AuthProviders>;
};

/** aggregate fields of "auth.providers" */
export type AuthProviders_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthProviders_Max_Fields>;
  min?: Maybe<AuthProviders_Min_Fields>;
};


/** aggregate fields of "auth.providers" */
export type AuthProviders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "auth.providers". All fields are combined with a logical 'AND'. */
export type AuthProviders_Bool_Exp = {
  _and?: InputMaybe<Array<AuthProviders_Bool_Exp>>;
  _not?: InputMaybe<AuthProviders_Bool_Exp>;
  _or?: InputMaybe<Array<AuthProviders_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
  userProviders?: InputMaybe<AuthUserProviders_Bool_Exp>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.providers" */
export enum AuthProviders_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey'
}

/** input type for inserting data into table "auth.providers" */
export type AuthProviders_Insert_Input = {
  id?: InputMaybe<Scalars['String']['input']>;
  userProviders?: InputMaybe<AuthUserProviders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type AuthProviders_Max_Fields = {
  id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AuthProviders_Min_Fields = {
  id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "auth.providers" */
export type AuthProviders_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthProviders>;
};

/** input type for inserting object relation for remote table "auth.providers" */
export type AuthProviders_Obj_Rel_Insert_Input = {
  data: AuthProviders_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};

/** on_conflict condition type for table "auth.providers" */
export type AuthProviders_On_Conflict = {
  constraint: AuthProviders_Constraint;
  update_columns?: Array<AuthProviders_Update_Column>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.providers". */
export type AuthProviders_Order_By = {
  id?: InputMaybe<Order_By>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Order_By>;
};

/** primary key columns input for table: auth.providers */
export type AuthProviders_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "auth.providers" */
export enum AuthProviders_Select_Column {
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "auth.providers" */
export type AuthProviders_Set_Input = {
  id?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "authProviders" */
export type AuthProviders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthProviders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthProviders_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "auth.providers" */
export enum AuthProviders_Update_Column {
  /** column name */
  Id = 'id'
}

export type AuthProviders_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthProviders_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthProviders_Bool_Exp;
};

/** columns and relationships of "auth.refresh_token_types" */
export type AuthRefreshTokenTypes = {
  comment?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  refreshTokens: Array<AuthRefreshTokens>;
  /** An aggregate relationship */
  refreshTokens_aggregate: AuthRefreshTokens_Aggregate;
  value: Scalars['String']['output'];
};


/** columns and relationships of "auth.refresh_token_types" */
export type AuthRefreshTokenTypesRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** columns and relationships of "auth.refresh_token_types" */
export type AuthRefreshTokenTypesRefreshTokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};

/** aggregated selection of "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_Aggregate = {
  aggregate?: Maybe<AuthRefreshTokenTypes_Aggregate_Fields>;
  nodes: Array<AuthRefreshTokenTypes>;
};

/** aggregate fields of "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthRefreshTokenTypes_Max_Fields>;
  min?: Maybe<AuthRefreshTokenTypes_Min_Fields>;
};


/** aggregate fields of "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRefreshTokenTypes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "auth.refresh_token_types". All fields are combined with a logical 'AND'. */
export type AuthRefreshTokenTypes_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRefreshTokenTypes_Bool_Exp>>;
  _not?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRefreshTokenTypes_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Bool_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.refresh_token_types" */
export enum AuthRefreshTokenTypes_Constraint {
  /** unique or primary key constraint on columns "value" */
  RefreshTokenTypesPkey = 'refresh_token_types_pkey'
}

export enum AuthRefreshTokenTypes_Enum {
  /** Personal access token */
  Pat = 'pat',
  /** Regular refresh token */
  Regular = 'regular'
}

/** Boolean expression to compare columns of type "authRefreshTokenTypes_enum". All fields are combined with logical 'AND'. */
export type AuthRefreshTokenTypes_Enum_Comparison_Exp = {
  _eq?: InputMaybe<AuthRefreshTokenTypes_Enum>;
  _in?: InputMaybe<Array<AuthRefreshTokenTypes_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<AuthRefreshTokenTypes_Enum>;
  _nin?: InputMaybe<Array<AuthRefreshTokenTypes_Enum>>;
};

/** input type for inserting data into table "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Arr_Rel_Insert_Input>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type AuthRefreshTokenTypes_Max_Fields = {
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AuthRefreshTokenTypes_Min_Fields = {
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRefreshTokenTypes>;
};

/** on_conflict condition type for table "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_On_Conflict = {
  constraint: AuthRefreshTokenTypes_Constraint;
  update_columns?: Array<AuthRefreshTokenTypes_Update_Column>;
  where?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.refresh_token_types". */
export type AuthRefreshTokenTypes_Order_By = {
  comment?: InputMaybe<Order_By>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.refresh_token_types */
export type AuthRefreshTokenTypes_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "auth.refresh_token_types" */
export enum AuthRefreshTokenTypes_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "auth.refresh_token_types" */
export type AuthRefreshTokenTypes_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "authRefreshTokenTypes" */
export type AuthRefreshTokenTypes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthRefreshTokenTypes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthRefreshTokenTypes_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "auth.refresh_token_types" */
export enum AuthRefreshTokenTypes_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export type AuthRefreshTokenTypes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthRefreshTokenTypes_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthRefreshTokenTypes_Bool_Exp;
};

/** User refresh tokens. Hasura auth uses them to rotate new access tokens as long as the refresh token is not expired. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRefreshTokens = {
  createdAt: Scalars['timestamptz']['output'];
  expiresAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  refreshTokenHash?: Maybe<Scalars['String']['output']>;
  type: AuthRefreshTokenTypes_Enum;
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
};


/** User refresh tokens. Hasura auth uses them to rotate new access tokens as long as the refresh token is not expired. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRefreshTokensMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate = {
  aggregate?: Maybe<AuthRefreshTokens_Aggregate_Fields>;
  nodes: Array<AuthRefreshTokens>;
};

export type AuthRefreshTokens_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthRefreshTokens_Aggregate_Bool_Exp_Count>;
};

export type AuthRefreshTokens_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthRefreshTokens_Max_Fields>;
  min?: Maybe<AuthRefreshTokens_Min_Fields>;
};


/** aggregate fields of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthRefreshTokens_Max_Order_By>;
  min?: InputMaybe<AuthRefreshTokens_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuthRefreshTokens_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "auth.refresh_tokens" */
export type AuthRefreshTokens_Arr_Rel_Insert_Input = {
  data: Array<AuthRefreshTokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.refresh_tokens". All fields are combined with a logical 'AND'. */
export type AuthRefreshTokens_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRefreshTokens_Bool_Exp>>;
  _not?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRefreshTokens_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  expiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  refreshTokenHash?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<AuthRefreshTokenTypes_Enum_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Constraint {
  /** unique or primary key constraint on columns "id" */
  RefreshTokensPkey = 'refresh_tokens_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuthRefreshTokens_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuthRefreshTokens_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuthRefreshTokens_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "auth.refresh_tokens" */
export type AuthRefreshTokens_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  refreshTokenHash?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AuthRefreshTokenTypes_Enum>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuthRefreshTokens_Max_Fields = {
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  refreshTokenHash?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  refreshTokenHash?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthRefreshTokens_Min_Fields = {
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  expiresAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  refreshTokenHash?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  refreshTokenHash?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.refresh_tokens" */
export type AuthRefreshTokens_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRefreshTokens>;
};

/** on_conflict condition type for table "auth.refresh_tokens" */
export type AuthRefreshTokens_On_Conflict = {
  constraint: AuthRefreshTokens_Constraint;
  update_columns?: Array<AuthRefreshTokens_Update_Column>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.refresh_tokens". */
export type AuthRefreshTokens_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  refreshTokenHash?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.refresh_tokens */
export type AuthRefreshTokens_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuthRefreshTokens_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  RefreshTokenHash = 'refreshTokenHash',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.refresh_tokens" */
export type AuthRefreshTokens_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  refreshTokenHash?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AuthRefreshTokenTypes_Enum>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "authRefreshTokens" */
export type AuthRefreshTokens_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthRefreshTokens_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthRefreshTokens_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  refreshTokenHash?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AuthRefreshTokenTypes_Enum>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  RefreshTokenHash = 'refreshTokenHash',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'userId'
}

export type AuthRefreshTokens_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuthRefreshTokens_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuthRefreshTokens_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuthRefreshTokens_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuthRefreshTokens_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuthRefreshTokens_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthRefreshTokens_Bool_Exp;
};

/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRoles = {
  role: Scalars['String']['output'];
  /** An array relationship */
  userRoles: Array<AuthUserRoles>;
  /** An aggregate relationship */
  userRoles_aggregate: AuthUserRoles_Aggregate;
  /** An array relationship */
  usersByDefaultRole: Array<Users>;
  /** An aggregate relationship */
  usersByDefaultRole_aggregate: Users_Aggregate;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUserRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUsersByDefaultRoleArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUsersByDefaultRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** aggregated selection of "auth.roles" */
export type AuthRoles_Aggregate = {
  aggregate?: Maybe<AuthRoles_Aggregate_Fields>;
  nodes: Array<AuthRoles>;
};

/** aggregate fields of "auth.roles" */
export type AuthRoles_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthRoles_Max_Fields>;
  min?: Maybe<AuthRoles_Min_Fields>;
};


/** aggregate fields of "auth.roles" */
export type AuthRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "auth.roles". All fields are combined with a logical 'AND'. */
export type AuthRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRoles_Bool_Exp>>;
  _not?: InputMaybe<AuthRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRoles_Bool_Exp>>;
  role?: InputMaybe<String_Comparison_Exp>;
  userRoles?: InputMaybe<AuthUserRoles_Bool_Exp>;
  userRoles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Bool_Exp>;
  usersByDefaultRole?: InputMaybe<Users_Bool_Exp>;
  usersByDefaultRole_aggregate?: InputMaybe<Users_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.roles" */
export enum AuthRoles_Constraint {
  /** unique or primary key constraint on columns "role" */
  RolesPkey = 'roles_pkey'
}

/** input type for inserting data into table "auth.roles" */
export type AuthRoles_Insert_Input = {
  role?: InputMaybe<Scalars['String']['input']>;
  userRoles?: InputMaybe<AuthUserRoles_Arr_Rel_Insert_Input>;
  usersByDefaultRole?: InputMaybe<Users_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type AuthRoles_Max_Fields = {
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AuthRoles_Min_Fields = {
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "auth.roles" */
export type AuthRoles_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRoles>;
};

/** input type for inserting object relation for remote table "auth.roles" */
export type AuthRoles_Obj_Rel_Insert_Input = {
  data: AuthRoles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};

/** on_conflict condition type for table "auth.roles" */
export type AuthRoles_On_Conflict = {
  constraint: AuthRoles_Constraint;
  update_columns?: Array<AuthRoles_Update_Column>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.roles". */
export type AuthRoles_Order_By = {
  role?: InputMaybe<Order_By>;
  userRoles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Order_By>;
  usersByDefaultRole_aggregate?: InputMaybe<Users_Aggregate_Order_By>;
};

/** primary key columns input for table: auth.roles */
export type AuthRoles_Pk_Columns_Input = {
  role: Scalars['String']['input'];
};

/** select columns of table "auth.roles" */
export enum AuthRoles_Select_Column {
  /** column name */
  Role = 'role'
}

/** input type for updating data in table "auth.roles" */
export type AuthRoles_Set_Input = {
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "authRoles" */
export type AuthRoles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthRoles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthRoles_Stream_Cursor_Value_Input = {
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "auth.roles" */
export enum AuthRoles_Update_Column {
  /** column name */
  Role = 'role'
}

export type AuthRoles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthRoles_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthRoles_Bool_Exp;
};

/** Active providers for a given user. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthUserProviders = {
  accessToken: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  provider: AuthProviders;
  providerId: Scalars['String']['output'];
  providerUserId: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "auth.user_providers" */
export type AuthUserProviders_Aggregate = {
  aggregate?: Maybe<AuthUserProviders_Aggregate_Fields>;
  nodes: Array<AuthUserProviders>;
};

export type AuthUserProviders_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthUserProviders_Aggregate_Bool_Exp_Count>;
};

export type AuthUserProviders_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AuthUserProviders_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.user_providers" */
export type AuthUserProviders_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthUserProviders_Max_Fields>;
  min?: Maybe<AuthUserProviders_Min_Fields>;
};


/** aggregate fields of "auth.user_providers" */
export type AuthUserProviders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "auth.user_providers" */
export type AuthUserProviders_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserProviders_Max_Order_By>;
  min?: InputMaybe<AuthUserProviders_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_providers" */
export type AuthUserProviders_Arr_Rel_Insert_Input = {
  data: Array<AuthUserProviders_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.user_providers". All fields are combined with a logical 'AND'. */
export type AuthUserProviders_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserProviders_Bool_Exp>>;
  _not?: InputMaybe<AuthUserProviders_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserProviders_Bool_Exp>>;
  accessToken?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  provider?: InputMaybe<AuthProviders_Bool_Exp>;
  providerId?: InputMaybe<String_Comparison_Exp>;
  providerUserId?: InputMaybe<String_Comparison_Exp>;
  refreshToken?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_providers" */
export enum AuthUserProviders_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserProvidersPkey = 'user_providers_pkey',
  /** unique or primary key constraint on columns "provider_user_id", "provider_id" */
  UserProvidersProviderIdProviderUserIdKey = 'user_providers_provider_id_provider_user_id_key'
}

/** input type for inserting data into table "auth.user_providers" */
export type AuthUserProviders_Insert_Input = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  provider?: InputMaybe<AuthProviders_Obj_Rel_Insert_Input>;
  providerId?: InputMaybe<Scalars['String']['input']>;
  providerUserId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuthUserProviders_Max_Fields = {
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  providerId?: Maybe<Scalars['String']['output']>;
  providerUserId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "auth.user_providers" */
export type AuthUserProviders_Max_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserProviders_Min_Fields = {
  accessToken?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  providerId?: Maybe<Scalars['String']['output']>;
  providerUserId?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "auth.user_providers" */
export type AuthUserProviders_Min_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_providers" */
export type AuthUserProviders_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserProviders>;
};

/** on_conflict condition type for table "auth.user_providers" */
export type AuthUserProviders_On_Conflict = {
  constraint: AuthUserProviders_Constraint;
  update_columns?: Array<AuthUserProviders_Update_Column>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_providers". */
export type AuthUserProviders_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  provider?: InputMaybe<AuthProviders_Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.user_providers */
export type AuthUserProviders_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "auth.user_providers" */
export enum AuthUserProviders_Select_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'providerId',
  /** column name */
  ProviderUserId = 'providerUserId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.user_providers" */
export type AuthUserProviders_Set_Input = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  providerId?: InputMaybe<Scalars['String']['input']>;
  providerUserId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "authUserProviders" */
export type AuthUserProviders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthUserProviders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUserProviders_Stream_Cursor_Value_Input = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  providerId?: InputMaybe<Scalars['String']['input']>;
  providerUserId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "auth.user_providers" */
export enum AuthUserProviders_Update_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'providerId',
  /** column name */
  ProviderUserId = 'providerUserId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

export type AuthUserProviders_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthUserProviders_Bool_Exp;
};

/** Roles of users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthUserRoles = {
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
  /** An object relationship */
  roleByRole: AuthRoles;
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "auth.user_roles" */
export type AuthUserRoles_Aggregate = {
  aggregate?: Maybe<AuthUserRoles_Aggregate_Fields>;
  nodes: Array<AuthUserRoles>;
};

export type AuthUserRoles_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthUserRoles_Aggregate_Bool_Exp_Count>;
};

export type AuthUserRoles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AuthUserRoles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.user_roles" */
export type AuthUserRoles_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<AuthUserRoles_Max_Fields>;
  min?: Maybe<AuthUserRoles_Min_Fields>;
};


/** aggregate fields of "auth.user_roles" */
export type AuthUserRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "auth.user_roles" */
export type AuthUserRoles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserRoles_Max_Order_By>;
  min?: InputMaybe<AuthUserRoles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_roles" */
export type AuthUserRoles_Arr_Rel_Insert_Input = {
  data: Array<AuthUserRoles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.user_roles". All fields are combined with a logical 'AND'. */
export type AuthUserRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserRoles_Bool_Exp>>;
  _not?: InputMaybe<AuthUserRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserRoles_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  roleByRole?: InputMaybe<AuthRoles_Bool_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_roles" */
export enum AuthUserRoles_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserRolesPkey = 'user_roles_pkey',
  /** unique or primary key constraint on columns "user_id", "role" */
  UserRolesUserIdRoleKey = 'user_roles_user_id_role_key'
}

/** input type for inserting data into table "auth.user_roles" */
export type AuthUserRoles_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  roleByRole?: InputMaybe<AuthRoles_Obj_Rel_Insert_Input>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuthUserRoles_Max_Fields = {
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "auth.user_roles" */
export type AuthUserRoles_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserRoles_Min_Fields = {
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "auth.user_roles" */
export type AuthUserRoles_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_roles" */
export type AuthUserRoles_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserRoles>;
};

/** on_conflict condition type for table "auth.user_roles" */
export type AuthUserRoles_On_Conflict = {
  constraint: AuthUserRoles_Constraint;
  update_columns?: Array<AuthUserRoles_Update_Column>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_roles". */
export type AuthUserRoles_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  roleByRole?: InputMaybe<AuthRoles_Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.user_roles */
export type AuthUserRoles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "auth.user_roles" */
export enum AuthUserRoles_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.user_roles" */
export type AuthUserRoles_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "authUserRoles" */
export type AuthUserRoles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthUserRoles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUserRoles_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "auth.user_roles" */
export enum AuthUserRoles_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

export type AuthUserRoles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthUserRoles_Bool_Exp;
};

/** User webauthn security keys. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthUserSecurityKeys = {
  counter: Scalars['bigint']['output'];
  credentialId: Scalars['String']['output'];
  credentialPublicKey?: Maybe<Scalars['bytea']['output']>;
  id: Scalars['uuid']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  transports: Scalars['String']['output'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate = {
  aggregate?: Maybe<AuthUserSecurityKeys_Aggregate_Fields>;
  nodes: Array<AuthUserSecurityKeys>;
};

export type AuthUserSecurityKeys_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthUserSecurityKeys_Aggregate_Bool_Exp_Count>;
};

export type AuthUserSecurityKeys_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate_Fields = {
  avg?: Maybe<AuthUserSecurityKeys_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<AuthUserSecurityKeys_Max_Fields>;
  min?: Maybe<AuthUserSecurityKeys_Min_Fields>;
  stddev?: Maybe<AuthUserSecurityKeys_Stddev_Fields>;
  stddev_pop?: Maybe<AuthUserSecurityKeys_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<AuthUserSecurityKeys_Stddev_Samp_Fields>;
  sum?: Maybe<AuthUserSecurityKeys_Sum_Fields>;
  var_pop?: Maybe<AuthUserSecurityKeys_Var_Pop_Fields>;
  var_samp?: Maybe<AuthUserSecurityKeys_Var_Samp_Fields>;
  variance?: Maybe<AuthUserSecurityKeys_Variance_Fields>;
};


/** aggregate fields of "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate_Order_By = {
  avg?: InputMaybe<AuthUserSecurityKeys_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserSecurityKeys_Max_Order_By>;
  min?: InputMaybe<AuthUserSecurityKeys_Min_Order_By>;
  stddev?: InputMaybe<AuthUserSecurityKeys_Stddev_Order_By>;
  stddev_pop?: InputMaybe<AuthUserSecurityKeys_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<AuthUserSecurityKeys_Stddev_Samp_Order_By>;
  sum?: InputMaybe<AuthUserSecurityKeys_Sum_Order_By>;
  var_pop?: InputMaybe<AuthUserSecurityKeys_Var_Pop_Order_By>;
  var_samp?: InputMaybe<AuthUserSecurityKeys_Var_Samp_Order_By>;
  variance?: InputMaybe<AuthUserSecurityKeys_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Arr_Rel_Insert_Input = {
  data: Array<AuthUserSecurityKeys_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserSecurityKeys_On_Conflict>;
};

/** aggregate avg on columns */
export type AuthUserSecurityKeys_Avg_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Avg_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "auth.user_security_keys". All fields are combined with a logical 'AND'. */
export type AuthUserSecurityKeys_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserSecurityKeys_Bool_Exp>>;
  _not?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserSecurityKeys_Bool_Exp>>;
  counter?: InputMaybe<Bigint_Comparison_Exp>;
  credentialId?: InputMaybe<String_Comparison_Exp>;
  credentialPublicKey?: InputMaybe<Bytea_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
  transports?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Constraint {
  /** unique or primary key constraint on columns "credential_id" */
  UserSecurityKeyCredentialIdKey = 'user_security_key_credential_id_key',
  /** unique or primary key constraint on columns "id" */
  UserSecurityKeysPkey = 'user_security_keys_pkey'
}

/** input type for incrementing numeric columns in table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Inc_Input = {
  counter?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Insert_Input = {
  counter?: InputMaybe<Scalars['bigint']['input']>;
  credentialId?: InputMaybe<Scalars['String']['input']>;
  credentialPublicKey?: InputMaybe<Scalars['bytea']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  transports?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type AuthUserSecurityKeys_Max_Fields = {
  counter?: Maybe<Scalars['bigint']['output']>;
  credentialId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  transports?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Max_Order_By = {
  counter?: InputMaybe<Order_By>;
  credentialId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  transports?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserSecurityKeys_Min_Fields = {
  counter?: Maybe<Scalars['bigint']['output']>;
  credentialId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  transports?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Min_Order_By = {
  counter?: InputMaybe<Order_By>;
  credentialId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  transports?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserSecurityKeys>;
};

/** on_conflict condition type for table "auth.user_security_keys" */
export type AuthUserSecurityKeys_On_Conflict = {
  constraint: AuthUserSecurityKeys_Constraint;
  update_columns?: Array<AuthUserSecurityKeys_Update_Column>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_security_keys". */
export type AuthUserSecurityKeys_Order_By = {
  counter?: InputMaybe<Order_By>;
  credentialId?: InputMaybe<Order_By>;
  credentialPublicKey?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  transports?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.user_security_keys */
export type AuthUserSecurityKeys_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Select_Column {
  /** column name */
  Counter = 'counter',
  /** column name */
  CredentialId = 'credentialId',
  /** column name */
  CredentialPublicKey = 'credentialPublicKey',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Transports = 'transports',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Set_Input = {
  counter?: InputMaybe<Scalars['bigint']['input']>;
  credentialId?: InputMaybe<Scalars['String']['input']>;
  credentialPublicKey?: InputMaybe<Scalars['bytea']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  transports?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type AuthUserSecurityKeys_Stddev_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Stddev_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type AuthUserSecurityKeys_Stddev_Pop_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Stddev_Pop_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type AuthUserSecurityKeys_Stddev_Samp_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Stddev_Samp_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "authUserSecurityKeys" */
export type AuthUserSecurityKeys_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthUserSecurityKeys_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUserSecurityKeys_Stream_Cursor_Value_Input = {
  counter?: InputMaybe<Scalars['bigint']['input']>;
  credentialId?: InputMaybe<Scalars['String']['input']>;
  credentialPublicKey?: InputMaybe<Scalars['bytea']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  transports?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type AuthUserSecurityKeys_Sum_Fields = {
  counter?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Sum_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** update columns of table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Update_Column {
  /** column name */
  Counter = 'counter',
  /** column name */
  CredentialId = 'credentialId',
  /** column name */
  CredentialPublicKey = 'credentialPublicKey',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Transports = 'transports',
  /** column name */
  UserId = 'userId'
}

export type AuthUserSecurityKeys_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<AuthUserSecurityKeys_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUserSecurityKeys_Set_Input>;
  /** filter the rows which have to be updated */
  where: AuthUserSecurityKeys_Bool_Exp;
};

/** aggregate var_pop on columns */
export type AuthUserSecurityKeys_Var_Pop_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Var_Pop_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type AuthUserSecurityKeys_Var_Samp_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Var_Samp_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type AuthUserSecurityKeys_Variance_Fields = {
  counter?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Variance_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "storage.buckets" */
export type Buckets = {
  cacheControl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  downloadExpiration: Scalars['Int']['output'];
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: Files_Aggregate;
  id: Scalars['String']['output'];
  maxUploadFileSize: Scalars['Int']['output'];
  minUploadFileSize: Scalars['Int']['output'];
  presignedUrlsEnabled: Scalars['Boolean']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "storage.buckets" */
export type BucketsFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


/** columns and relationships of "storage.buckets" */
export type BucketsFiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** aggregated selection of "storage.buckets" */
export type Buckets_Aggregate = {
  aggregate?: Maybe<Buckets_Aggregate_Fields>;
  nodes: Array<Buckets>;
};

/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_Fields = {
  avg?: Maybe<Buckets_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Buckets_Max_Fields>;
  min?: Maybe<Buckets_Min_Fields>;
  stddev?: Maybe<Buckets_Stddev_Fields>;
  stddev_pop?: Maybe<Buckets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Buckets_Stddev_Samp_Fields>;
  sum?: Maybe<Buckets_Sum_Fields>;
  var_pop?: Maybe<Buckets_Var_Pop_Fields>;
  var_samp?: Maybe<Buckets_Var_Samp_Fields>;
  variance?: Maybe<Buckets_Variance_Fields>;
};


/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Buckets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Buckets_Avg_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "storage.buckets". All fields are combined with a logical 'AND'. */
export type Buckets_Bool_Exp = {
  _and?: InputMaybe<Array<Buckets_Bool_Exp>>;
  _not?: InputMaybe<Buckets_Bool_Exp>;
  _or?: InputMaybe<Array<Buckets_Bool_Exp>>;
  cacheControl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  downloadExpiration?: InputMaybe<Int_Comparison_Exp>;
  files?: InputMaybe<Files_Bool_Exp>;
  files_aggregate?: InputMaybe<Files_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  maxUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  minUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  presignedUrlsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.buckets" */
export enum Buckets_Constraint {
  /** unique or primary key constraint on columns "id" */
  BucketsPkey = 'buckets_pkey'
}

/** input type for incrementing numeric columns in table "storage.buckets" */
export type Buckets_Inc_Input = {
  downloadExpiration?: InputMaybe<Scalars['Int']['input']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "storage.buckets" */
export type Buckets_Insert_Input = {
  cacheControl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  downloadExpiration?: InputMaybe<Scalars['Int']['input']>;
  files?: InputMaybe<Files_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['String']['input']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  presignedUrlsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Buckets_Max_Fields = {
  cacheControl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  downloadExpiration?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Int']['output']>;
  minUploadFileSize?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Buckets_Min_Fields = {
  cacheControl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  downloadExpiration?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Int']['output']>;
  minUploadFileSize?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "storage.buckets" */
export type Buckets_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Buckets>;
};

/** input type for inserting object relation for remote table "storage.buckets" */
export type Buckets_Obj_Rel_Insert_Input = {
  data: Buckets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** on_conflict condition type for table "storage.buckets" */
export type Buckets_On_Conflict = {
  constraint: Buckets_Constraint;
  update_columns?: Array<Buckets_Update_Column>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.buckets". */
export type Buckets_Order_By = {
  cacheControl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  downloadExpiration?: InputMaybe<Order_By>;
  files_aggregate?: InputMaybe<Files_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  maxUploadFileSize?: InputMaybe<Order_By>;
  minUploadFileSize?: InputMaybe<Order_By>;
  presignedUrlsEnabled?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.buckets */
export type Buckets_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "storage.buckets" */
export enum Buckets_Select_Column {
  /** column name */
  CacheControl = 'cacheControl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DownloadExpiration = 'downloadExpiration',
  /** column name */
  Id = 'id',
  /** column name */
  MaxUploadFileSize = 'maxUploadFileSize',
  /** column name */
  MinUploadFileSize = 'minUploadFileSize',
  /** column name */
  PresignedUrlsEnabled = 'presignedUrlsEnabled',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "storage.buckets" */
export type Buckets_Set_Input = {
  cacheControl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  downloadExpiration?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  presignedUrlsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Buckets_Stddev_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Buckets_Stddev_Pop_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Buckets_Stddev_Samp_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "buckets" */
export type Buckets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buckets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buckets_Stream_Cursor_Value_Input = {
  cacheControl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  downloadExpiration?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']['input']>;
  presignedUrlsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Buckets_Sum_Fields = {
  downloadExpiration?: Maybe<Scalars['Int']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Int']['output']>;
  minUploadFileSize?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "storage.buckets" */
export enum Buckets_Update_Column {
  /** column name */
  CacheControl = 'cacheControl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DownloadExpiration = 'downloadExpiration',
  /** column name */
  Id = 'id',
  /** column name */
  MaxUploadFileSize = 'maxUploadFileSize',
  /** column name */
  MinUploadFileSize = 'minUploadFileSize',
  /** column name */
  PresignedUrlsEnabled = 'presignedUrlsEnabled',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Buckets_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Buckets_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Buckets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Buckets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Buckets_Var_Pop_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Buckets_Var_Samp_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Buckets_Variance_Fields = {
  downloadExpiration?: Maybe<Scalars['Float']['output']>;
  maxUploadFileSize?: Maybe<Scalars['Float']['output']>;
  minUploadFileSize?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "building_variable_definitions" */
export type Building_Variable_Definitions = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: Scalars['String']['output'];
};

/** aggregated selection of "building_variable_definitions" */
export type Building_Variable_Definitions_Aggregate = {
  aggregate?: Maybe<Building_Variable_Definitions_Aggregate_Fields>;
  nodes: Array<Building_Variable_Definitions>;
};

/** aggregate fields of "building_variable_definitions" */
export type Building_Variable_Definitions_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Building_Variable_Definitions_Max_Fields>;
  min?: Maybe<Building_Variable_Definitions_Min_Fields>;
};


/** aggregate fields of "building_variable_definitions" */
export type Building_Variable_Definitions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Building_Variable_Definitions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "building_variable_definitions". All fields are combined with a logical 'AND'. */
export type Building_Variable_Definitions_Bool_Exp = {
  _and?: InputMaybe<Array<Building_Variable_Definitions_Bool_Exp>>;
  _not?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
  _or?: InputMaybe<Array<Building_Variable_Definitions_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  options?: InputMaybe<String_Array_Comparison_Exp>;
  placeholder?: InputMaybe<String_Comparison_Exp>;
  required?: InputMaybe<Boolean_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "building_variable_definitions" */
export enum Building_Variable_Definitions_Constraint {
  /** unique or primary key constraint on columns "name" */
  BuildingVariableDefinitionsPkey = 'building_variable_definitions_pkey'
}

/** input type for inserting data into table "building_variable_definitions" */
export type Building_Variable_Definitions_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Building_Variable_Definitions_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Scalars['String']['output']>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Building_Variable_Definitions_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Scalars['String']['output']>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "building_variable_definitions" */
export type Building_Variable_Definitions_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Building_Variable_Definitions>;
};

/** on_conflict condition type for table "building_variable_definitions" */
export type Building_Variable_Definitions_On_Conflict = {
  constraint: Building_Variable_Definitions_Constraint;
  update_columns?: Array<Building_Variable_Definitions_Update_Column>;
  where?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
};

/** Ordering options when selecting data from "building_variable_definitions". */
export type Building_Variable_Definitions_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
  placeholder?: InputMaybe<Order_By>;
  required?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: building_variable_definitions */
export type Building_Variable_Definitions_Pk_Columns_Input = {
  name: Scalars['String']['input'];
};

/** select columns of table "building_variable_definitions" */
export enum Building_Variable_Definitions_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name',
  /** column name */
  Options = 'options',
  /** column name */
  Placeholder = 'placeholder',
  /** column name */
  Required = 'required',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "building_variable_definitions" */
export type Building_Variable_Definitions_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "building_variable_definitions" */
export type Building_Variable_Definitions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Building_Variable_Definitions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Building_Variable_Definitions_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "building_variable_definitions" */
export enum Building_Variable_Definitions_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name',
  /** column name */
  Options = 'options',
  /** column name */
  Placeholder = 'placeholder',
  /** column name */
  Required = 'required',
  /** column name */
  Type = 'type'
}

export type Building_Variable_Definitions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Building_Variable_Definitions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Building_Variable_Definitions_Bool_Exp;
};

/** columns and relationships of "building_variables" */
export type Building_Variables = {
  building_id: Scalars['uuid']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "building_variables" */
export type Building_Variables_Aggregate = {
  aggregate?: Maybe<Building_Variables_Aggregate_Fields>;
  nodes: Array<Building_Variables>;
};

/** aggregate fields of "building_variables" */
export type Building_Variables_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Building_Variables_Max_Fields>;
  min?: Maybe<Building_Variables_Min_Fields>;
};


/** aggregate fields of "building_variables" */
export type Building_Variables_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Building_Variables_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "building_variables". All fields are combined with a logical 'AND'. */
export type Building_Variables_Bool_Exp = {
  _and?: InputMaybe<Array<Building_Variables_Bool_Exp>>;
  _not?: InputMaybe<Building_Variables_Bool_Exp>;
  _or?: InputMaybe<Array<Building_Variables_Bool_Exp>>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "building_variables" */
export enum Building_Variables_Constraint {
  /** unique or primary key constraint on columns "building_id", "name" */
  BuildingVariablesPkey = 'building_variables_pkey'
}

/** input type for inserting data into table "building_variables" */
export type Building_Variables_Insert_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Building_Variables_Max_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Building_Variables_Min_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "building_variables" */
export type Building_Variables_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Building_Variables>;
};

/** on_conflict condition type for table "building_variables" */
export type Building_Variables_On_Conflict = {
  constraint: Building_Variables_Constraint;
  update_columns?: Array<Building_Variables_Update_Column>;
  where?: InputMaybe<Building_Variables_Bool_Exp>;
};

/** Ordering options when selecting data from "building_variables". */
export type Building_Variables_Order_By = {
  building_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: building_variables */
export type Building_Variables_Pk_Columns_Input = {
  building_id: Scalars['uuid']['input'];
  name: Scalars['String']['input'];
};

/** select columns of table "building_variables" */
export enum Building_Variables_Select_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "building_variables" */
export type Building_Variables_Set_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "building_variables" */
export type Building_Variables_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Building_Variables_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Building_Variables_Stream_Cursor_Value_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "building_variables" */
export enum Building_Variables_Update_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

export type Building_Variables_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Building_Variables_Set_Input>;
  /** filter the rows which have to be updated */
  where: Building_Variables_Bool_Exp;
};

/** columns and relationships of "buildings" */
export type Buildings = {
  address: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  total_units: Scalars['Int']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  variables?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "buildings" */
export type BuildingsVariablesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "buildings" */
export type Buildings_Aggregate = {
  aggregate?: Maybe<Buildings_Aggregate_Fields>;
  nodes: Array<Buildings>;
};

/** aggregate fields of "buildings" */
export type Buildings_Aggregate_Fields = {
  avg?: Maybe<Buildings_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Buildings_Max_Fields>;
  min?: Maybe<Buildings_Min_Fields>;
  stddev?: Maybe<Buildings_Stddev_Fields>;
  stddev_pop?: Maybe<Buildings_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Buildings_Stddev_Samp_Fields>;
  sum?: Maybe<Buildings_Sum_Fields>;
  var_pop?: Maybe<Buildings_Var_Pop_Fields>;
  var_samp?: Maybe<Buildings_Var_Samp_Fields>;
  variance?: Maybe<Buildings_Variance_Fields>;
};


/** aggregate fields of "buildings" */
export type Buildings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Buildings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Buildings_Append_Input = {
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Buildings_Avg_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "buildings". All fields are combined with a logical 'AND'. */
export type Buildings_Bool_Exp = {
  _and?: InputMaybe<Array<Buildings_Bool_Exp>>;
  _not?: InputMaybe<Buildings_Bool_Exp>;
  _or?: InputMaybe<Array<Buildings_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  total_units?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  variables?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "buildings" */
export enum Buildings_Constraint {
  /** unique or primary key constraint on columns "id" */
  BuildingsPkey = 'buildings_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Buildings_Delete_At_Path_Input = {
  variables?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Buildings_Delete_Elem_Input = {
  variables?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Buildings_Delete_Key_Input = {
  variables?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "buildings" */
export type Buildings_Inc_Input = {
  total_units?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "buildings" */
export type Buildings_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  total_units?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Buildings_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  total_units?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Buildings_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  total_units?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "buildings" */
export type Buildings_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Buildings>;
};

/** on_conflict condition type for table "buildings" */
export type Buildings_On_Conflict = {
  constraint: Buildings_Constraint;
  update_columns?: Array<Buildings_Update_Column>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};

/** Ordering options when selecting data from "buildings". */
export type Buildings_Order_By = {
  address?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  total_units?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  variables?: InputMaybe<Order_By>;
};

/** primary key columns input for table: buildings */
export type Buildings_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Buildings_Prepend_Input = {
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "buildings" */
export enum Buildings_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TotalUnits = 'total_units',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

/** input type for updating data in table "buildings" */
export type Buildings_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  total_units?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate stddev on columns */
export type Buildings_Stddev_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Buildings_Stddev_Pop_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Buildings_Stddev_Samp_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "buildings" */
export type Buildings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buildings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buildings_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  total_units?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Buildings_Sum_Fields = {
  total_units?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "buildings" */
export enum Buildings_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TotalUnits = 'total_units',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

export type Buildings_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Buildings_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Buildings_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Buildings_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Buildings_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Buildings_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Buildings_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Buildings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Buildings_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Buildings_Var_Pop_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Buildings_Var_Samp_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Buildings_Variance_Fields = {
  total_units?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
export type Bytea_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bytea']['input']>;
  _gt?: InputMaybe<Scalars['bytea']['input']>;
  _gte?: InputMaybe<Scalars['bytea']['input']>;
  _in?: InputMaybe<Array<Scalars['bytea']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bytea']['input']>;
  _lte?: InputMaybe<Scalars['bytea']['input']>;
  _neq?: InputMaybe<Scalars['bytea']['input']>;
  _nin?: InputMaybe<Array<Scalars['bytea']['input']>>;
};

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['citext']['input']>;
  _gt?: InputMaybe<Scalars['citext']['input']>;
  _gte?: InputMaybe<Scalars['citext']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['citext']['input']>;
  _in?: InputMaybe<Array<Scalars['citext']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['citext']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['citext']['input']>;
  _lt?: InputMaybe<Scalars['citext']['input']>;
  _lte?: InputMaybe<Scalars['citext']['input']>;
  _neq?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['citext']['input']>;
  _nin?: InputMaybe<Array<Scalars['citext']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['citext']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['citext']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['citext']['input']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "document_templates" */
export type Document_Templates = {
  body: Scalars['String']['output'];
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at: Scalars['timestamptz']['output'];
  help_text?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  is_global: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "document_templates" */
export type Document_Templates_Aggregate = {
  aggregate?: Maybe<Document_Templates_Aggregate_Fields>;
  nodes: Array<Document_Templates>;
};

/** aggregate fields of "document_templates" */
export type Document_Templates_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Document_Templates_Max_Fields>;
  min?: Maybe<Document_Templates_Min_Fields>;
};


/** aggregate fields of "document_templates" */
export type Document_Templates_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Document_Templates_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "document_templates". All fields are combined with a logical 'AND'. */
export type Document_Templates_Bool_Exp = {
  _and?: InputMaybe<Array<Document_Templates_Bool_Exp>>;
  _not?: InputMaybe<Document_Templates_Bool_Exp>;
  _or?: InputMaybe<Array<Document_Templates_Bool_Exp>>;
  body?: InputMaybe<String_Comparison_Exp>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  help_text?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_global?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "document_templates" */
export enum Document_Templates_Constraint {
  /** unique or primary key constraint on columns "id" */
  DocumentTemplatesPkey = 'document_templates_pkey'
}

/** input type for inserting data into table "document_templates" */
export type Document_Templates_Insert_Input = {
  body?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  help_text?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Document_Templates_Max_Fields = {
  body?: Maybe<Scalars['String']['output']>;
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  help_text?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Document_Templates_Min_Fields = {
  body?: Maybe<Scalars['String']['output']>;
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  help_text?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "document_templates" */
export type Document_Templates_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Document_Templates>;
};

/** on_conflict condition type for table "document_templates" */
export type Document_Templates_On_Conflict = {
  constraint: Document_Templates_Constraint;
  update_columns?: Array<Document_Templates_Update_Column>;
  where?: InputMaybe<Document_Templates_Bool_Exp>;
};

/** Ordering options when selecting data from "document_templates". */
export type Document_Templates_Order_By = {
  body?: InputMaybe<Order_By>;
  building_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  help_text?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_global?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: document_templates */
export type Document_Templates_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "document_templates" */
export enum Document_Templates_Select_Column {
  /** column name */
  Body = 'body',
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HelpText = 'help_text',
  /** column name */
  Id = 'id',
  /** column name */
  IsGlobal = 'is_global',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "document_templates" */
export type Document_Templates_Set_Input = {
  body?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  help_text?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "document_templates" */
export type Document_Templates_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Document_Templates_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Document_Templates_Stream_Cursor_Value_Input = {
  body?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  help_text?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "document_templates" */
export enum Document_Templates_Update_Column {
  /** column name */
  Body = 'body',
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HelpText = 'help_text',
  /** column name */
  Id = 'id',
  /** column name */
  IsGlobal = 'is_global',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Document_Templates_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Document_Templates_Set_Input>;
  /** filter the rows which have to be updated */
  where: Document_Templates_Bool_Exp;
};

/** columns and relationships of "email_templates" */
export type Email_Templates = {
  body: Scalars['String']['output'];
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  is_global?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  variables?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "email_templates" */
export type Email_TemplatesVariablesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "email_templates" */
export type Email_Templates_Aggregate = {
  aggregate?: Maybe<Email_Templates_Aggregate_Fields>;
  nodes: Array<Email_Templates>;
};

/** aggregate fields of "email_templates" */
export type Email_Templates_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Email_Templates_Max_Fields>;
  min?: Maybe<Email_Templates_Min_Fields>;
};


/** aggregate fields of "email_templates" */
export type Email_Templates_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Email_Templates_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Email_Templates_Append_Input = {
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "email_templates". All fields are combined with a logical 'AND'. */
export type Email_Templates_Bool_Exp = {
  _and?: InputMaybe<Array<Email_Templates_Bool_Exp>>;
  _not?: InputMaybe<Email_Templates_Bool_Exp>;
  _or?: InputMaybe<Array<Email_Templates_Bool_Exp>>;
  body?: InputMaybe<String_Comparison_Exp>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_global?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  subject?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  variables?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "email_templates" */
export enum Email_Templates_Constraint {
  /** unique or primary key constraint on columns "id" */
  EmailTemplatesPkey = 'email_templates_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Email_Templates_Delete_At_Path_Input = {
  variables?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Email_Templates_Delete_Elem_Input = {
  variables?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Email_Templates_Delete_Key_Input = {
  variables?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "email_templates" */
export type Email_Templates_Insert_Input = {
  body?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Email_Templates_Max_Fields = {
  body?: Maybe<Scalars['String']['output']>;
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Email_Templates_Min_Fields = {
  body?: Maybe<Scalars['String']['output']>;
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "email_templates" */
export type Email_Templates_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Email_Templates>;
};

/** on_conflict condition type for table "email_templates" */
export type Email_Templates_On_Conflict = {
  constraint: Email_Templates_Constraint;
  update_columns?: Array<Email_Templates_Update_Column>;
  where?: InputMaybe<Email_Templates_Bool_Exp>;
};

/** Ordering options when selecting data from "email_templates". */
export type Email_Templates_Order_By = {
  body?: InputMaybe<Order_By>;
  building_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_global?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  subject?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  variables?: InputMaybe<Order_By>;
};

/** primary key columns input for table: email_templates */
export type Email_Templates_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Email_Templates_Prepend_Input = {
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "email_templates" */
export enum Email_Templates_Select_Column {
  /** column name */
  Body = 'body',
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsGlobal = 'is_global',
  /** column name */
  Name = 'name',
  /** column name */
  Subject = 'subject',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

/** input type for updating data in table "email_templates" */
export type Email_Templates_Set_Input = {
  body?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "email_templates" */
export type Email_Templates_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Email_Templates_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Email_Templates_Stream_Cursor_Value_Input = {
  body?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_global?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  variables?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "email_templates" */
export enum Email_Templates_Update_Column {
  /** column name */
  Body = 'body',
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsGlobal = 'is_global',
  /** column name */
  Name = 'name',
  /** column name */
  Subject = 'subject',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

export type Email_Templates_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Email_Templates_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Email_Templates_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Email_Templates_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Email_Templates_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Email_Templates_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Email_Templates_Set_Input>;
  /** filter the rows which have to be updated */
  where: Email_Templates_Bool_Exp;
};

/** columns and relationships of "storage.files" */
export type Files = {
  /** An object relationship */
  bucket: Buckets;
  bucketId: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  etag?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  isUploaded?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['timestamptz']['output'];
  uploadedByUserId?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "storage.files" */
export type FilesMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "storage.files" */
export type Files_Aggregate = {
  aggregate?: Maybe<Files_Aggregate_Fields>;
  nodes: Array<Files>;
};

export type Files_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Files_Aggregate_Bool_Exp_Count>;
};

export type Files_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "storage.files" */
export type Files_Aggregate_Fields = {
  avg?: Maybe<Files_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Files_Max_Fields>;
  min?: Maybe<Files_Min_Fields>;
  stddev?: Maybe<Files_Stddev_Fields>;
  stddev_pop?: Maybe<Files_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Files_Stddev_Samp_Fields>;
  sum?: Maybe<Files_Sum_Fields>;
  var_pop?: Maybe<Files_Var_Pop_Fields>;
  var_samp?: Maybe<Files_Var_Samp_Fields>;
  variance?: Maybe<Files_Variance_Fields>;
};


/** aggregate fields of "storage.files" */
export type Files_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "storage.files" */
export type Files_Aggregate_Order_By = {
  avg?: InputMaybe<Files_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Files_Max_Order_By>;
  min?: InputMaybe<Files_Min_Order_By>;
  stddev?: InputMaybe<Files_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Files_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Files_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Files_Sum_Order_By>;
  var_pop?: InputMaybe<Files_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Files_Var_Samp_Order_By>;
  variance?: InputMaybe<Files_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Files_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "storage.files" */
export type Files_Arr_Rel_Insert_Input = {
  data: Array<Files_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** aggregate avg on columns */
export type Files_Avg_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "storage.files" */
export type Files_Avg_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "storage.files". All fields are combined with a logical 'AND'. */
export type Files_Bool_Exp = {
  _and?: InputMaybe<Array<Files_Bool_Exp>>;
  _not?: InputMaybe<Files_Bool_Exp>;
  _or?: InputMaybe<Array<Files_Bool_Exp>>;
  bucket?: InputMaybe<Buckets_Bool_Exp>;
  bucketId?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  etag?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isUploaded?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mimeType?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  size?: InputMaybe<Int_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  uploadedByUserId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.files" */
export enum Files_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilesPkey = 'files_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Files_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Files_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Files_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "storage.files" */
export type Files_Inc_Input = {
  size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "storage.files" */
export type Files_Insert_Input = {
  bucket?: InputMaybe<Buckets_Obj_Rel_Insert_Input>;
  bucketId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  etag?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isUploaded?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  uploadedByUserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Files_Max_Fields = {
  bucketId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  etag?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  uploadedByUserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "storage.files" */
export type Files_Max_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Files_Min_Fields = {
  bucketId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  etag?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  uploadedByUserId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "storage.files" */
export type Files_Min_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "storage.files" */
export type Files_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Files>;
};

/** input type for inserting object relation for remote table "storage.files" */
export type Files_Obj_Rel_Insert_Input = {
  data: Files_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** on_conflict condition type for table "storage.files" */
export type Files_On_Conflict = {
  constraint: Files_Constraint;
  update_columns?: Array<Files_Update_Column>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.files". */
export type Files_Order_By = {
  bucket?: InputMaybe<Buckets_Order_By>;
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isUploaded?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.files */
export type Files_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Files_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "storage.files" */
export enum Files_Select_Column {
  /** column name */
  BucketId = 'bucketId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Etag = 'etag',
  /** column name */
  Id = 'id',
  /** column name */
  IsUploaded = 'isUploaded',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  Name = 'name',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UploadedByUserId = 'uploadedByUserId'
}

/** select "files_aggregate_bool_exp_bool_and_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUploaded = 'isUploaded'
}

/** select "files_aggregate_bool_exp_bool_or_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUploaded = 'isUploaded'
}

/** input type for updating data in table "storage.files" */
export type Files_Set_Input = {
  bucketId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  etag?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isUploaded?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  uploadedByUserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Files_Stddev_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "storage.files" */
export type Files_Stddev_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Files_Stddev_Pop_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "storage.files" */
export type Files_Stddev_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Files_Stddev_Samp_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "storage.files" */
export type Files_Stddev_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "files" */
export type Files_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Files_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Files_Stream_Cursor_Value_Input = {
  bucketId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  etag?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isUploaded?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  uploadedByUserId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Files_Sum_Fields = {
  size?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "storage.files" */
export type Files_Sum_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** update columns of table "storage.files" */
export enum Files_Update_Column {
  /** column name */
  BucketId = 'bucketId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Etag = 'etag',
  /** column name */
  Id = 'id',
  /** column name */
  IsUploaded = 'isUploaded',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  Name = 'name',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UploadedByUserId = 'uploadedByUserId'
}

export type Files_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Files_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Files_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Files_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Files_Set_Input>;
  /** filter the rows which have to be updated */
  where: Files_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Files_Var_Pop_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "storage.files" */
export type Files_Var_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Files_Var_Samp_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "storage.files" */
export type Files_Var_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Files_Variance_Fields = {
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "storage.files" */
export type Files_Variance_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** columns and relationships of "global_variables" */
export type Global_Variables = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description: Scalars['String']['output'];
  is_editable?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  value: Scalars['String']['output'];
};

/** aggregated selection of "global_variables" */
export type Global_Variables_Aggregate = {
  aggregate?: Maybe<Global_Variables_Aggregate_Fields>;
  nodes: Array<Global_Variables>;
};

/** aggregate fields of "global_variables" */
export type Global_Variables_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Global_Variables_Max_Fields>;
  min?: Maybe<Global_Variables_Min_Fields>;
};


/** aggregate fields of "global_variables" */
export type Global_Variables_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Global_Variables_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "global_variables". All fields are combined with a logical 'AND'. */
export type Global_Variables_Bool_Exp = {
  _and?: InputMaybe<Array<Global_Variables_Bool_Exp>>;
  _not?: InputMaybe<Global_Variables_Bool_Exp>;
  _or?: InputMaybe<Array<Global_Variables_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  is_editable?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "global_variables" */
export enum Global_Variables_Constraint {
  /** unique or primary key constraint on columns "name" */
  GlobalVariablesPkey = 'global_variables_pkey'
}

/** input type for inserting data into table "global_variables" */
export type Global_Variables_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_editable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Global_Variables_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Global_Variables_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "global_variables" */
export type Global_Variables_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Global_Variables>;
};

/** on_conflict condition type for table "global_variables" */
export type Global_Variables_On_Conflict = {
  constraint: Global_Variables_Constraint;
  update_columns?: Array<Global_Variables_Update_Column>;
  where?: InputMaybe<Global_Variables_Bool_Exp>;
};

/** Ordering options when selecting data from "global_variables". */
export type Global_Variables_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  is_editable?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: global_variables */
export type Global_Variables_Pk_Columns_Input = {
  name: Scalars['String']['input'];
};

/** select columns of table "global_variables" */
export enum Global_Variables_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IsEditable = 'is_editable',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "global_variables" */
export type Global_Variables_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_editable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "global_variables" */
export type Global_Variables_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Global_Variables_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Global_Variables_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_editable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "global_variables" */
export enum Global_Variables_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IsEditable = 'is_editable',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

export type Global_Variables_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Global_Variables_Set_Input>;
  /** filter the rows which have to be updated */
  where: Global_Variables_Bool_Exp;
};

/** Boolean expression to compare columns of type "inet". All fields are combined with logical 'AND'. */
export type Inet_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['inet']['input']>;
  _gt?: InputMaybe<Scalars['inet']['input']>;
  _gte?: InputMaybe<Scalars['inet']['input']>;
  _in?: InputMaybe<Array<Scalars['inet']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['inet']['input']>;
  _lte?: InputMaybe<Scalars['inet']['input']>;
  _neq?: InputMaybe<Scalars['inet']['input']>;
  _nin?: InputMaybe<Array<Scalars['inet']['input']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "manual_vote_attachments" */
export type Manual_Vote_Attachments = {
  attachment_name: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  member_id: Scalars['uuid']['output'];
  vote_id: Scalars['uuid']['output'];
};

/** aggregated selection of "manual_vote_attachments" */
export type Manual_Vote_Attachments_Aggregate = {
  aggregate?: Maybe<Manual_Vote_Attachments_Aggregate_Fields>;
  nodes: Array<Manual_Vote_Attachments>;
};

/** aggregate fields of "manual_vote_attachments" */
export type Manual_Vote_Attachments_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Manual_Vote_Attachments_Max_Fields>;
  min?: Maybe<Manual_Vote_Attachments_Min_Fields>;
};


/** aggregate fields of "manual_vote_attachments" */
export type Manual_Vote_Attachments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Manual_Vote_Attachments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "manual_vote_attachments". All fields are combined with a logical 'AND'. */
export type Manual_Vote_Attachments_Bool_Exp = {
  _and?: InputMaybe<Array<Manual_Vote_Attachments_Bool_Exp>>;
  _not?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
  _or?: InputMaybe<Array<Manual_Vote_Attachments_Bool_Exp>>;
  attachment_name?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member_id?: InputMaybe<Uuid_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "manual_vote_attachments" */
export enum Manual_Vote_Attachments_Constraint {
  /** unique or primary key constraint on columns "id" */
  ManualVoteAttachmentsPkey = 'manual_vote_attachments_pkey'
}

/** input type for inserting data into table "manual_vote_attachments" */
export type Manual_Vote_Attachments_Insert_Input = {
  attachment_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Manual_Vote_Attachments_Max_Fields = {
  attachment_name?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Manual_Vote_Attachments_Min_Fields = {
  attachment_name?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "manual_vote_attachments" */
export type Manual_Vote_Attachments_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Manual_Vote_Attachments>;
};

/** on_conflict condition type for table "manual_vote_attachments" */
export type Manual_Vote_Attachments_On_Conflict = {
  constraint: Manual_Vote_Attachments_Constraint;
  update_columns?: Array<Manual_Vote_Attachments_Update_Column>;
  where?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
};

/** Ordering options when selecting data from "manual_vote_attachments". */
export type Manual_Vote_Attachments_Order_By = {
  attachment_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: manual_vote_attachments */
export type Manual_Vote_Attachments_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "manual_vote_attachments" */
export enum Manual_Vote_Attachments_Select_Column {
  /** column name */
  AttachmentName = 'attachment_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "manual_vote_attachments" */
export type Manual_Vote_Attachments_Set_Input = {
  attachment_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "manual_vote_attachments" */
export type Manual_Vote_Attachments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Manual_Vote_Attachments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Manual_Vote_Attachments_Stream_Cursor_Value_Input = {
  attachment_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "manual_vote_attachments" */
export enum Manual_Vote_Attachments_Update_Column {
  /** column name */
  AttachmentName = 'attachment_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  VoteId = 'vote_id'
}

export type Manual_Vote_Attachments_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Manual_Vote_Attachments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Manual_Vote_Attachments_Bool_Exp;
};

/** columns and relationships of "manual_vote_notes" */
export type Manual_Vote_Notes = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  member_id: Scalars['uuid']['output'];
  note: Scalars['String']['output'];
  vote_id: Scalars['uuid']['output'];
};

/** aggregated selection of "manual_vote_notes" */
export type Manual_Vote_Notes_Aggregate = {
  aggregate?: Maybe<Manual_Vote_Notes_Aggregate_Fields>;
  nodes: Array<Manual_Vote_Notes>;
};

/** aggregate fields of "manual_vote_notes" */
export type Manual_Vote_Notes_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Manual_Vote_Notes_Max_Fields>;
  min?: Maybe<Manual_Vote_Notes_Min_Fields>;
};


/** aggregate fields of "manual_vote_notes" */
export type Manual_Vote_Notes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Manual_Vote_Notes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "manual_vote_notes". All fields are combined with a logical 'AND'. */
export type Manual_Vote_Notes_Bool_Exp = {
  _and?: InputMaybe<Array<Manual_Vote_Notes_Bool_Exp>>;
  _not?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
  _or?: InputMaybe<Array<Manual_Vote_Notes_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member_id?: InputMaybe<Uuid_Comparison_Exp>;
  note?: InputMaybe<String_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "manual_vote_notes" */
export enum Manual_Vote_Notes_Constraint {
  /** unique or primary key constraint on columns "id" */
  ManualVoteNotesPkey = 'manual_vote_notes_pkey',
  /** unique or primary key constraint on columns "member_id", "vote_id" */
  ManualVoteNotesVoteIdMemberIdKey = 'manual_vote_notes_vote_id_member_id_key'
}

/** input type for inserting data into table "manual_vote_notes" */
export type Manual_Vote_Notes_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Manual_Vote_Notes_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Manual_Vote_Notes_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "manual_vote_notes" */
export type Manual_Vote_Notes_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Manual_Vote_Notes>;
};

/** on_conflict condition type for table "manual_vote_notes" */
export type Manual_Vote_Notes_On_Conflict = {
  constraint: Manual_Vote_Notes_Constraint;
  update_columns?: Array<Manual_Vote_Notes_Update_Column>;
  where?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
};

/** Ordering options when selecting data from "manual_vote_notes". */
export type Manual_Vote_Notes_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: manual_vote_notes */
export type Manual_Vote_Notes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "manual_vote_notes" */
export enum Manual_Vote_Notes_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  Note = 'note',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "manual_vote_notes" */
export type Manual_Vote_Notes_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "manual_vote_notes" */
export type Manual_Vote_Notes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Manual_Vote_Notes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Manual_Vote_Notes_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "manual_vote_notes" */
export enum Manual_Vote_Notes_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  Note = 'note',
  /** column name */
  VoteId = 'vote_id'
}

export type Manual_Vote_Notes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Manual_Vote_Notes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Manual_Vote_Notes_Bool_Exp;
};

/** columns and relationships of "member_votes" */
export type Member_Votes = {
  answer?: Maybe<Scalars['String']['output']>;
  answer_data?: Maybe<Scalars['jsonb']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  confidence_level?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  delegated_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  ip_address?: Maybe<Scalars['inet']['output']>;
  is_delegated?: Maybe<Scalars['Boolean']['output']>;
  is_proxy?: Maybe<Scalars['Boolean']['output']>;
  member_id: Scalars['uuid']['output'];
  proxy_for?: Maybe<Scalars['uuid']['output']>;
  question_id: Scalars['uuid']['output'];
  user_agent?: Maybe<Scalars['String']['output']>;
  vote_id: Scalars['uuid']['output'];
  voting_power_used?: Maybe<Scalars['numeric']['output']>;
};


/** columns and relationships of "member_votes" */
export type Member_VotesAnswer_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "member_votes" */
export type Member_Votes_Aggregate = {
  aggregate?: Maybe<Member_Votes_Aggregate_Fields>;
  nodes: Array<Member_Votes>;
};

/** aggregate fields of "member_votes" */
export type Member_Votes_Aggregate_Fields = {
  avg?: Maybe<Member_Votes_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Member_Votes_Max_Fields>;
  min?: Maybe<Member_Votes_Min_Fields>;
  stddev?: Maybe<Member_Votes_Stddev_Fields>;
  stddev_pop?: Maybe<Member_Votes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Member_Votes_Stddev_Samp_Fields>;
  sum?: Maybe<Member_Votes_Sum_Fields>;
  var_pop?: Maybe<Member_Votes_Var_Pop_Fields>;
  var_samp?: Maybe<Member_Votes_Var_Samp_Fields>;
  variance?: Maybe<Member_Votes_Variance_Fields>;
};


/** aggregate fields of "member_votes" */
export type Member_Votes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Member_Votes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Member_Votes_Append_Input = {
  answer_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Member_Votes_Avg_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "member_votes". All fields are combined with a logical 'AND'. */
export type Member_Votes_Bool_Exp = {
  _and?: InputMaybe<Array<Member_Votes_Bool_Exp>>;
  _not?: InputMaybe<Member_Votes_Bool_Exp>;
  _or?: InputMaybe<Array<Member_Votes_Bool_Exp>>;
  answer?: InputMaybe<String_Comparison_Exp>;
  answer_data?: InputMaybe<Jsonb_Comparison_Exp>;
  comment?: InputMaybe<String_Comparison_Exp>;
  confidence_level?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  delegated_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ip_address?: InputMaybe<Inet_Comparison_Exp>;
  is_delegated?: InputMaybe<Boolean_Comparison_Exp>;
  is_proxy?: InputMaybe<Boolean_Comparison_Exp>;
  member_id?: InputMaybe<Uuid_Comparison_Exp>;
  proxy_for?: InputMaybe<Uuid_Comparison_Exp>;
  question_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_agent?: InputMaybe<String_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
  voting_power_used?: InputMaybe<Numeric_Comparison_Exp>;
};

/** unique or primary key constraints on table "member_votes" */
export enum Member_Votes_Constraint {
  /** unique or primary key constraint on columns "id" */
  MemberVotesPkey = 'member_votes_pkey',
  /** unique or primary key constraint on columns "member_id", "question_id", "vote_id" */
  MemberVotesVoteIdMemberIdQuestionIdKey = 'member_votes_vote_id_member_id_question_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Member_Votes_Delete_At_Path_Input = {
  answer_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Member_Votes_Delete_Elem_Input = {
  answer_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Member_Votes_Delete_Key_Input = {
  answer_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "member_votes" */
export type Member_Votes_Inc_Input = {
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  voting_power_used?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "member_votes" */
export type Member_Votes_Insert_Input = {
  answer?: InputMaybe<Scalars['String']['input']>;
  answer_data?: InputMaybe<Scalars['jsonb']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  delegated_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_delegated?: InputMaybe<Scalars['Boolean']['input']>;
  is_proxy?: InputMaybe<Scalars['Boolean']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  proxy_for?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
  voting_power_used?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type Member_Votes_Max_Fields = {
  answer?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  confidence_level?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  delegated_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  proxy_for?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
  voting_power_used?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Member_Votes_Min_Fields = {
  answer?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<Scalars['String']['output']>;
  confidence_level?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  delegated_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  proxy_for?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
  voting_power_used?: Maybe<Scalars['numeric']['output']>;
};

/** response of any mutation on the table "member_votes" */
export type Member_Votes_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Member_Votes>;
};

/** on_conflict condition type for table "member_votes" */
export type Member_Votes_On_Conflict = {
  constraint: Member_Votes_Constraint;
  update_columns?: Array<Member_Votes_Update_Column>;
  where?: InputMaybe<Member_Votes_Bool_Exp>;
};

/** Ordering options when selecting data from "member_votes". */
export type Member_Votes_Order_By = {
  answer?: InputMaybe<Order_By>;
  answer_data?: InputMaybe<Order_By>;
  comment?: InputMaybe<Order_By>;
  confidence_level?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  delegated_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ip_address?: InputMaybe<Order_By>;
  is_delegated?: InputMaybe<Order_By>;
  is_proxy?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  proxy_for?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  user_agent?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
  voting_power_used?: InputMaybe<Order_By>;
};

/** primary key columns input for table: member_votes */
export type Member_Votes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Member_Votes_Prepend_Input = {
  answer_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "member_votes" */
export enum Member_Votes_Select_Column {
  /** column name */
  Answer = 'answer',
  /** column name */
  AnswerData = 'answer_data',
  /** column name */
  Comment = 'comment',
  /** column name */
  ConfidenceLevel = 'confidence_level',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DelegatedBy = 'delegated_by',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  IsDelegated = 'is_delegated',
  /** column name */
  IsProxy = 'is_proxy',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  ProxyFor = 'proxy_for',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  UserAgent = 'user_agent',
  /** column name */
  VoteId = 'vote_id',
  /** column name */
  VotingPowerUsed = 'voting_power_used'
}

/** input type for updating data in table "member_votes" */
export type Member_Votes_Set_Input = {
  answer?: InputMaybe<Scalars['String']['input']>;
  answer_data?: InputMaybe<Scalars['jsonb']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  delegated_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_delegated?: InputMaybe<Scalars['Boolean']['input']>;
  is_proxy?: InputMaybe<Scalars['Boolean']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  proxy_for?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
  voting_power_used?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type Member_Votes_Stddev_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Member_Votes_Stddev_Pop_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Member_Votes_Stddev_Samp_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "member_votes" */
export type Member_Votes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Member_Votes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Member_Votes_Stream_Cursor_Value_Input = {
  answer?: InputMaybe<Scalars['String']['input']>;
  answer_data?: InputMaybe<Scalars['jsonb']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  delegated_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_delegated?: InputMaybe<Scalars['Boolean']['input']>;
  is_proxy?: InputMaybe<Scalars['Boolean']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  proxy_for?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
  voting_power_used?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Member_Votes_Sum_Fields = {
  confidence_level?: Maybe<Scalars['Int']['output']>;
  voting_power_used?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "member_votes" */
export enum Member_Votes_Update_Column {
  /** column name */
  Answer = 'answer',
  /** column name */
  AnswerData = 'answer_data',
  /** column name */
  Comment = 'comment',
  /** column name */
  ConfidenceLevel = 'confidence_level',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DelegatedBy = 'delegated_by',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  IsDelegated = 'is_delegated',
  /** column name */
  IsProxy = 'is_proxy',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  ProxyFor = 'proxy_for',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  UserAgent = 'user_agent',
  /** column name */
  VoteId = 'vote_id',
  /** column name */
  VotingPowerUsed = 'voting_power_used'
}

export type Member_Votes_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Member_Votes_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Member_Votes_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Member_Votes_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Member_Votes_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Member_Votes_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Member_Votes_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Member_Votes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Member_Votes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Member_Votes_Var_Pop_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Member_Votes_Var_Samp_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Member_Votes_Variance_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
  voting_power_used?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "members" */
export type Members = {
  building_id: Scalars['uuid']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  is_active?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  representative_id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  unit: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_weight?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "members" */
export type Members_Aggregate = {
  aggregate?: Maybe<Members_Aggregate_Fields>;
  nodes: Array<Members>;
};

/** aggregate fields of "members" */
export type Members_Aggregate_Fields = {
  avg?: Maybe<Members_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Members_Max_Fields>;
  min?: Maybe<Members_Min_Fields>;
  stddev?: Maybe<Members_Stddev_Fields>;
  stddev_pop?: Maybe<Members_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Members_Stddev_Samp_Fields>;
  sum?: Maybe<Members_Sum_Fields>;
  var_pop?: Maybe<Members_Var_Pop_Fields>;
  var_samp?: Maybe<Members_Var_Samp_Fields>;
  variance?: Maybe<Members_Variance_Fields>;
};


/** aggregate fields of "members" */
export type Members_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Members_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Members_Avg_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "members". All fields are combined with a logical 'AND'. */
export type Members_Bool_Exp = {
  _and?: InputMaybe<Array<Members_Bool_Exp>>;
  _not?: InputMaybe<Members_Bool_Exp>;
  _or?: InputMaybe<Array<Members_Bool_Exp>>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  representative_id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  unit?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  vote_weight?: InputMaybe<Numeric_Comparison_Exp>;
};

/** unique or primary key constraints on table "members" */
export enum Members_Constraint {
  /** unique or primary key constraint on columns "id" */
  MembersPkey = 'members_pkey'
}

/** input type for incrementing numeric columns in table "members" */
export type Members_Inc_Input = {
  vote_weight?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "members" */
export type Members_Insert_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  representative_id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_weight?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type Members_Max_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  representative_id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_weight?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Members_Min_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  representative_id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_weight?: Maybe<Scalars['numeric']['output']>;
};

/** response of any mutation on the table "members" */
export type Members_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Members>;
};

/** on_conflict condition type for table "members" */
export type Members_On_Conflict = {
  constraint: Members_Constraint;
  update_columns?: Array<Members_Update_Column>;
  where?: InputMaybe<Members_Bool_Exp>;
};

/** Ordering options when selecting data from "members". */
export type Members_Order_By = {
  building_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  representative_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  unit?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  vote_weight?: InputMaybe<Order_By>;
};

/** primary key columns input for table: members */
export type Members_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "members" */
export enum Members_Select_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  Name = 'name',
  /** column name */
  Phone = 'phone',
  /** column name */
  RepresentativeId = 'representative_id',
  /** column name */
  Role = 'role',
  /** column name */
  Unit = 'unit',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VoteWeight = 'vote_weight'
}

/** input type for updating data in table "members" */
export type Members_Set_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  representative_id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_weight?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type Members_Stddev_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Members_Stddev_Pop_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Members_Stddev_Samp_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "members" */
export type Members_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Members_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Members_Stream_Cursor_Value_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  representative_id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_weight?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type Members_Sum_Fields = {
  vote_weight?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "members" */
export enum Members_Update_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  Name = 'name',
  /** column name */
  Phone = 'phone',
  /** column name */
  RepresentativeId = 'representative_id',
  /** column name */
  Role = 'role',
  /** column name */
  Unit = 'unit',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VoteWeight = 'vote_weight'
}

export type Members_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Members_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Members_Set_Input>;
  /** filter the rows which have to be updated */
  where: Members_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Members_Var_Pop_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Members_Var_Samp_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Members_Variance_Fields = {
  vote_weight?: Maybe<Scalars['Float']['output']>;
};

/** mutation root */
export type Mutation_Root = {
  /** delete single row from the table: "auth.providers" */
  deleteAuthProvider?: Maybe<AuthProviders>;
  /** delete single row from the table: "auth.provider_requests" */
  deleteAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** delete data from the table: "auth.provider_requests" */
  deleteAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** delete data from the table: "auth.providers" */
  deleteAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** delete single row from the table: "auth.refresh_tokens" */
  deleteAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** delete single row from the table: "auth.refresh_token_types" */
  deleteAuthRefreshTokenType?: Maybe<AuthRefreshTokenTypes>;
  /** delete data from the table: "auth.refresh_token_types" */
  deleteAuthRefreshTokenTypes?: Maybe<AuthRefreshTokenTypes_Mutation_Response>;
  /** delete data from the table: "auth.refresh_tokens" */
  deleteAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** delete single row from the table: "auth.roles" */
  deleteAuthRole?: Maybe<AuthRoles>;
  /** delete data from the table: "auth.roles" */
  deleteAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** delete single row from the table: "auth.user_providers" */
  deleteAuthUserProvider?: Maybe<AuthUserProviders>;
  /** delete data from the table: "auth.user_providers" */
  deleteAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** delete single row from the table: "auth.user_roles" */
  deleteAuthUserRole?: Maybe<AuthUserRoles>;
  /** delete data from the table: "auth.user_roles" */
  deleteAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** delete single row from the table: "auth.user_security_keys" */
  deleteAuthUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** delete data from the table: "auth.user_security_keys" */
  deleteAuthUserSecurityKeys?: Maybe<AuthUserSecurityKeys_Mutation_Response>;
  /** delete single row from the table: "storage.buckets" */
  deleteBucket?: Maybe<Buckets>;
  /** delete data from the table: "storage.buckets" */
  deleteBuckets?: Maybe<Buckets_Mutation_Response>;
  /** delete single row from the table: "storage.files" */
  deleteFile?: Maybe<Files>;
  /** delete data from the table: "storage.files" */
  deleteFiles?: Maybe<Files_Mutation_Response>;
  /** delete single row from the table: "auth.users" */
  deleteUser?: Maybe<Users>;
  /** delete data from the table: "auth.users" */
  deleteUsers?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "storage.virus" */
  deleteVirus?: Maybe<Virus>;
  /** delete data from the table: "storage.virus" */
  deleteViruses?: Maybe<Virus_Mutation_Response>;
  /** delete data from the table: "attachments" */
  delete_attachments?: Maybe<Attachments_Mutation_Response>;
  /** delete single row from the table: "attachments" */
  delete_attachments_by_pk?: Maybe<Attachments>;
  /** delete data from the table: "audit_log" */
  delete_audit_log?: Maybe<Audit_Log_Mutation_Response>;
  /** delete single row from the table: "audit_log" */
  delete_audit_log_by_pk?: Maybe<Audit_Log>;
  /** delete data from the table: "building_variable_definitions" */
  delete_building_variable_definitions?: Maybe<Building_Variable_Definitions_Mutation_Response>;
  /** delete single row from the table: "building_variable_definitions" */
  delete_building_variable_definitions_by_pk?: Maybe<Building_Variable_Definitions>;
  /** delete data from the table: "building_variables" */
  delete_building_variables?: Maybe<Building_Variables_Mutation_Response>;
  /** delete single row from the table: "building_variables" */
  delete_building_variables_by_pk?: Maybe<Building_Variables>;
  /** delete data from the table: "buildings" */
  delete_buildings?: Maybe<Buildings_Mutation_Response>;
  /** delete single row from the table: "buildings" */
  delete_buildings_by_pk?: Maybe<Buildings>;
  /** delete data from the table: "document_templates" */
  delete_document_templates?: Maybe<Document_Templates_Mutation_Response>;
  /** delete single row from the table: "document_templates" */
  delete_document_templates_by_pk?: Maybe<Document_Templates>;
  /** delete data from the table: "email_templates" */
  delete_email_templates?: Maybe<Email_Templates_Mutation_Response>;
  /** delete single row from the table: "email_templates" */
  delete_email_templates_by_pk?: Maybe<Email_Templates>;
  /** delete data from the table: "global_variables" */
  delete_global_variables?: Maybe<Global_Variables_Mutation_Response>;
  /** delete single row from the table: "global_variables" */
  delete_global_variables_by_pk?: Maybe<Global_Variables>;
  /** delete data from the table: "manual_vote_attachments" */
  delete_manual_vote_attachments?: Maybe<Manual_Vote_Attachments_Mutation_Response>;
  /** delete single row from the table: "manual_vote_attachments" */
  delete_manual_vote_attachments_by_pk?: Maybe<Manual_Vote_Attachments>;
  /** delete data from the table: "manual_vote_notes" */
  delete_manual_vote_notes?: Maybe<Manual_Vote_Notes_Mutation_Response>;
  /** delete single row from the table: "manual_vote_notes" */
  delete_manual_vote_notes_by_pk?: Maybe<Manual_Vote_Notes>;
  /** delete data from the table: "member_votes" */
  delete_member_votes?: Maybe<Member_Votes_Mutation_Response>;
  /** delete single row from the table: "member_votes" */
  delete_member_votes_by_pk?: Maybe<Member_Votes>;
  /** delete data from the table: "members" */
  delete_members?: Maybe<Members_Mutation_Response>;
  /** delete single row from the table: "members" */
  delete_members_by_pk?: Maybe<Members>;
  /** delete data from the table: "notifications" */
  delete_notifications?: Maybe<Notifications_Mutation_Response>;
  /** delete single row from the table: "notifications" */
  delete_notifications_by_pk?: Maybe<Notifications>;
  /** delete data from the table: "observers" */
  delete_observers?: Maybe<Observers_Mutation_Response>;
  /** delete single row from the table: "observers" */
  delete_observers_by_pk?: Maybe<Observers>;
  /** delete data from the table: "proxy_votes" */
  delete_proxy_votes?: Maybe<Proxy_Votes_Mutation_Response>;
  /** delete single row from the table: "proxy_votes" */
  delete_proxy_votes_by_pk?: Maybe<Proxy_Votes>;
  /** delete data from the table: "question_responses" */
  delete_question_responses?: Maybe<Question_Responses_Mutation_Response>;
  /** delete single row from the table: "question_responses" */
  delete_question_responses_by_pk?: Maybe<Question_Responses>;
  /** delete data from the table: "questions" */
  delete_questions?: Maybe<Questions_Mutation_Response>;
  /** delete single row from the table: "questions" */
  delete_questions_by_pk?: Maybe<Questions>;
  /** delete data from the table: "reports" */
  delete_reports?: Maybe<Reports_Mutation_Response>;
  /** delete single row from the table: "reports" */
  delete_reports_by_pk?: Maybe<Reports>;
  /** delete data from the table: "sms_verifications" */
  delete_sms_verifications?: Maybe<Sms_Verifications_Mutation_Response>;
  /** delete single row from the table: "sms_verifications" */
  delete_sms_verifications_by_pk?: Maybe<Sms_Verifications>;
  /** delete data from the table: "vote_analytics" */
  delete_vote_analytics?: Maybe<Vote_Analytics_Mutation_Response>;
  /** delete single row from the table: "vote_analytics" */
  delete_vote_analytics_by_pk?: Maybe<Vote_Analytics>;
  /** delete data from the table: "vote_delegations" */
  delete_vote_delegations?: Maybe<Vote_Delegations_Mutation_Response>;
  /** delete single row from the table: "vote_delegations" */
  delete_vote_delegations_by_pk?: Maybe<Vote_Delegations>;
  /** delete data from the table: "votes" */
  delete_votes?: Maybe<Votes_Mutation_Response>;
  /** delete single row from the table: "votes" */
  delete_votes_by_pk?: Maybe<Votes>;
  /** delete data from the table: "voting_tokens" */
  delete_voting_tokens?: Maybe<Voting_Tokens_Mutation_Response>;
  /** delete single row from the table: "voting_tokens" */
  delete_voting_tokens_by_pk?: Maybe<Voting_Tokens>;
  /** insert a single row into the table: "auth.providers" */
  insertAuthProvider?: Maybe<AuthProviders>;
  /** insert a single row into the table: "auth.provider_requests" */
  insertAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** insert data into the table: "auth.provider_requests" */
  insertAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** insert data into the table: "auth.providers" */
  insertAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** insert a single row into the table: "auth.refresh_tokens" */
  insertAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** insert a single row into the table: "auth.refresh_token_types" */
  insertAuthRefreshTokenType?: Maybe<AuthRefreshTokenTypes>;
  /** insert data into the table: "auth.refresh_token_types" */
  insertAuthRefreshTokenTypes?: Maybe<AuthRefreshTokenTypes_Mutation_Response>;
  /** insert data into the table: "auth.refresh_tokens" */
  insertAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** insert a single row into the table: "auth.roles" */
  insertAuthRole?: Maybe<AuthRoles>;
  /** insert data into the table: "auth.roles" */
  insertAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** insert a single row into the table: "auth.user_providers" */
  insertAuthUserProvider?: Maybe<AuthUserProviders>;
  /** insert data into the table: "auth.user_providers" */
  insertAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** insert a single row into the table: "auth.user_roles" */
  insertAuthUserRole?: Maybe<AuthUserRoles>;
  /** insert data into the table: "auth.user_roles" */
  insertAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** insert a single row into the table: "auth.user_security_keys" */
  insertAuthUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** insert data into the table: "auth.user_security_keys" */
  insertAuthUserSecurityKeys?: Maybe<AuthUserSecurityKeys_Mutation_Response>;
  /** insert a single row into the table: "storage.buckets" */
  insertBucket?: Maybe<Buckets>;
  /** insert data into the table: "storage.buckets" */
  insertBuckets?: Maybe<Buckets_Mutation_Response>;
  /** insert a single row into the table: "storage.files" */
  insertFile?: Maybe<Files>;
  /** insert data into the table: "storage.files" */
  insertFiles?: Maybe<Files_Mutation_Response>;
  /** insert a single row into the table: "auth.users" */
  insertUser?: Maybe<Users>;
  /** insert data into the table: "auth.users" */
  insertUsers?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "storage.virus" */
  insertVirus?: Maybe<Virus>;
  /** insert data into the table: "storage.virus" */
  insertViruses?: Maybe<Virus_Mutation_Response>;
  /** insert data into the table: "attachments" */
  insert_attachments?: Maybe<Attachments_Mutation_Response>;
  /** insert a single row into the table: "attachments" */
  insert_attachments_one?: Maybe<Attachments>;
  /** insert data into the table: "audit_log" */
  insert_audit_log?: Maybe<Audit_Log_Mutation_Response>;
  /** insert a single row into the table: "audit_log" */
  insert_audit_log_one?: Maybe<Audit_Log>;
  /** insert data into the table: "building_variable_definitions" */
  insert_building_variable_definitions?: Maybe<Building_Variable_Definitions_Mutation_Response>;
  /** insert a single row into the table: "building_variable_definitions" */
  insert_building_variable_definitions_one?: Maybe<Building_Variable_Definitions>;
  /** insert data into the table: "building_variables" */
  insert_building_variables?: Maybe<Building_Variables_Mutation_Response>;
  /** insert a single row into the table: "building_variables" */
  insert_building_variables_one?: Maybe<Building_Variables>;
  /** insert data into the table: "buildings" */
  insert_buildings?: Maybe<Buildings_Mutation_Response>;
  /** insert a single row into the table: "buildings" */
  insert_buildings_one?: Maybe<Buildings>;
  /** insert data into the table: "document_templates" */
  insert_document_templates?: Maybe<Document_Templates_Mutation_Response>;
  /** insert a single row into the table: "document_templates" */
  insert_document_templates_one?: Maybe<Document_Templates>;
  /** insert data into the table: "email_templates" */
  insert_email_templates?: Maybe<Email_Templates_Mutation_Response>;
  /** insert a single row into the table: "email_templates" */
  insert_email_templates_one?: Maybe<Email_Templates>;
  /** insert data into the table: "global_variables" */
  insert_global_variables?: Maybe<Global_Variables_Mutation_Response>;
  /** insert a single row into the table: "global_variables" */
  insert_global_variables_one?: Maybe<Global_Variables>;
  /** insert data into the table: "manual_vote_attachments" */
  insert_manual_vote_attachments?: Maybe<Manual_Vote_Attachments_Mutation_Response>;
  /** insert a single row into the table: "manual_vote_attachments" */
  insert_manual_vote_attachments_one?: Maybe<Manual_Vote_Attachments>;
  /** insert data into the table: "manual_vote_notes" */
  insert_manual_vote_notes?: Maybe<Manual_Vote_Notes_Mutation_Response>;
  /** insert a single row into the table: "manual_vote_notes" */
  insert_manual_vote_notes_one?: Maybe<Manual_Vote_Notes>;
  /** insert data into the table: "member_votes" */
  insert_member_votes?: Maybe<Member_Votes_Mutation_Response>;
  /** insert a single row into the table: "member_votes" */
  insert_member_votes_one?: Maybe<Member_Votes>;
  /** insert data into the table: "members" */
  insert_members?: Maybe<Members_Mutation_Response>;
  /** insert a single row into the table: "members" */
  insert_members_one?: Maybe<Members>;
  /** insert data into the table: "notifications" */
  insert_notifications?: Maybe<Notifications_Mutation_Response>;
  /** insert a single row into the table: "notifications" */
  insert_notifications_one?: Maybe<Notifications>;
  /** insert data into the table: "observers" */
  insert_observers?: Maybe<Observers_Mutation_Response>;
  /** insert a single row into the table: "observers" */
  insert_observers_one?: Maybe<Observers>;
  /** insert data into the table: "proxy_votes" */
  insert_proxy_votes?: Maybe<Proxy_Votes_Mutation_Response>;
  /** insert a single row into the table: "proxy_votes" */
  insert_proxy_votes_one?: Maybe<Proxy_Votes>;
  /** insert data into the table: "question_responses" */
  insert_question_responses?: Maybe<Question_Responses_Mutation_Response>;
  /** insert a single row into the table: "question_responses" */
  insert_question_responses_one?: Maybe<Question_Responses>;
  /** insert data into the table: "questions" */
  insert_questions?: Maybe<Questions_Mutation_Response>;
  /** insert a single row into the table: "questions" */
  insert_questions_one?: Maybe<Questions>;
  /** insert data into the table: "reports" */
  insert_reports?: Maybe<Reports_Mutation_Response>;
  /** insert a single row into the table: "reports" */
  insert_reports_one?: Maybe<Reports>;
  /** insert data into the table: "sms_verifications" */
  insert_sms_verifications?: Maybe<Sms_Verifications_Mutation_Response>;
  /** insert a single row into the table: "sms_verifications" */
  insert_sms_verifications_one?: Maybe<Sms_Verifications>;
  /** insert data into the table: "vote_analytics" */
  insert_vote_analytics?: Maybe<Vote_Analytics_Mutation_Response>;
  /** insert a single row into the table: "vote_analytics" */
  insert_vote_analytics_one?: Maybe<Vote_Analytics>;
  /** insert data into the table: "vote_delegations" */
  insert_vote_delegations?: Maybe<Vote_Delegations_Mutation_Response>;
  /** insert a single row into the table: "vote_delegations" */
  insert_vote_delegations_one?: Maybe<Vote_Delegations>;
  /** insert data into the table: "votes" */
  insert_votes?: Maybe<Votes_Mutation_Response>;
  /** insert a single row into the table: "votes" */
  insert_votes_one?: Maybe<Votes>;
  /** insert data into the table: "voting_tokens" */
  insert_voting_tokens?: Maybe<Voting_Tokens_Mutation_Response>;
  /** insert a single row into the table: "voting_tokens" */
  insert_voting_tokens_one?: Maybe<Voting_Tokens>;
  /** update single row of the table: "auth.providers" */
  updateAuthProvider?: Maybe<AuthProviders>;
  /** update single row of the table: "auth.provider_requests" */
  updateAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** update data of the table: "auth.provider_requests" */
  updateAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** update data of the table: "auth.providers" */
  updateAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** update single row of the table: "auth.refresh_tokens" */
  updateAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** update single row of the table: "auth.refresh_token_types" */
  updateAuthRefreshTokenType?: Maybe<AuthRefreshTokenTypes>;
  /** update data of the table: "auth.refresh_token_types" */
  updateAuthRefreshTokenTypes?: Maybe<AuthRefreshTokenTypes_Mutation_Response>;
  /** update data of the table: "auth.refresh_tokens" */
  updateAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** update single row of the table: "auth.roles" */
  updateAuthRole?: Maybe<AuthRoles>;
  /** update data of the table: "auth.roles" */
  updateAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** update single row of the table: "auth.user_providers" */
  updateAuthUserProvider?: Maybe<AuthUserProviders>;
  /** update data of the table: "auth.user_providers" */
  updateAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** update single row of the table: "auth.user_roles" */
  updateAuthUserRole?: Maybe<AuthUserRoles>;
  /** update data of the table: "auth.user_roles" */
  updateAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** update single row of the table: "auth.user_security_keys" */
  updateAuthUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** update data of the table: "auth.user_security_keys" */
  updateAuthUserSecurityKeys?: Maybe<AuthUserSecurityKeys_Mutation_Response>;
  /** update single row of the table: "storage.buckets" */
  updateBucket?: Maybe<Buckets>;
  /** update data of the table: "storage.buckets" */
  updateBuckets?: Maybe<Buckets_Mutation_Response>;
  /** update single row of the table: "storage.files" */
  updateFile?: Maybe<Files>;
  /** update data of the table: "storage.files" */
  updateFiles?: Maybe<Files_Mutation_Response>;
  /** update single row of the table: "auth.users" */
  updateUser?: Maybe<Users>;
  /** update data of the table: "auth.users" */
  updateUsers?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "storage.virus" */
  updateVirus?: Maybe<Virus>;
  /** update data of the table: "storage.virus" */
  updateViruses?: Maybe<Virus_Mutation_Response>;
  /** update data of the table: "attachments" */
  update_attachments?: Maybe<Attachments_Mutation_Response>;
  /** update single row of the table: "attachments" */
  update_attachments_by_pk?: Maybe<Attachments>;
  /** update multiples rows of table: "attachments" */
  update_attachments_many?: Maybe<Array<Maybe<Attachments_Mutation_Response>>>;
  /** update data of the table: "audit_log" */
  update_audit_log?: Maybe<Audit_Log_Mutation_Response>;
  /** update single row of the table: "audit_log" */
  update_audit_log_by_pk?: Maybe<Audit_Log>;
  /** update multiples rows of table: "audit_log" */
  update_audit_log_many?: Maybe<Array<Maybe<Audit_Log_Mutation_Response>>>;
  /** update multiples rows of table: "auth.provider_requests" */
  update_authProviderRequests_many?: Maybe<Array<Maybe<AuthProviderRequests_Mutation_Response>>>;
  /** update multiples rows of table: "auth.providers" */
  update_authProviders_many?: Maybe<Array<Maybe<AuthProviders_Mutation_Response>>>;
  /** update multiples rows of table: "auth.refresh_token_types" */
  update_authRefreshTokenTypes_many?: Maybe<Array<Maybe<AuthRefreshTokenTypes_Mutation_Response>>>;
  /** update multiples rows of table: "auth.refresh_tokens" */
  update_authRefreshTokens_many?: Maybe<Array<Maybe<AuthRefreshTokens_Mutation_Response>>>;
  /** update multiples rows of table: "auth.roles" */
  update_authRoles_many?: Maybe<Array<Maybe<AuthRoles_Mutation_Response>>>;
  /** update multiples rows of table: "auth.user_providers" */
  update_authUserProviders_many?: Maybe<Array<Maybe<AuthUserProviders_Mutation_Response>>>;
  /** update multiples rows of table: "auth.user_roles" */
  update_authUserRoles_many?: Maybe<Array<Maybe<AuthUserRoles_Mutation_Response>>>;
  /** update multiples rows of table: "auth.user_security_keys" */
  update_authUserSecurityKeys_many?: Maybe<Array<Maybe<AuthUserSecurityKeys_Mutation_Response>>>;
  /** update multiples rows of table: "storage.buckets" */
  update_buckets_many?: Maybe<Array<Maybe<Buckets_Mutation_Response>>>;
  /** update data of the table: "building_variable_definitions" */
  update_building_variable_definitions?: Maybe<Building_Variable_Definitions_Mutation_Response>;
  /** update single row of the table: "building_variable_definitions" */
  update_building_variable_definitions_by_pk?: Maybe<Building_Variable_Definitions>;
  /** update multiples rows of table: "building_variable_definitions" */
  update_building_variable_definitions_many?: Maybe<Array<Maybe<Building_Variable_Definitions_Mutation_Response>>>;
  /** update data of the table: "building_variables" */
  update_building_variables?: Maybe<Building_Variables_Mutation_Response>;
  /** update single row of the table: "building_variables" */
  update_building_variables_by_pk?: Maybe<Building_Variables>;
  /** update multiples rows of table: "building_variables" */
  update_building_variables_many?: Maybe<Array<Maybe<Building_Variables_Mutation_Response>>>;
  /** update data of the table: "buildings" */
  update_buildings?: Maybe<Buildings_Mutation_Response>;
  /** update single row of the table: "buildings" */
  update_buildings_by_pk?: Maybe<Buildings>;
  /** update multiples rows of table: "buildings" */
  update_buildings_many?: Maybe<Array<Maybe<Buildings_Mutation_Response>>>;
  /** update data of the table: "document_templates" */
  update_document_templates?: Maybe<Document_Templates_Mutation_Response>;
  /** update single row of the table: "document_templates" */
  update_document_templates_by_pk?: Maybe<Document_Templates>;
  /** update multiples rows of table: "document_templates" */
  update_document_templates_many?: Maybe<Array<Maybe<Document_Templates_Mutation_Response>>>;
  /** update data of the table: "email_templates" */
  update_email_templates?: Maybe<Email_Templates_Mutation_Response>;
  /** update single row of the table: "email_templates" */
  update_email_templates_by_pk?: Maybe<Email_Templates>;
  /** update multiples rows of table: "email_templates" */
  update_email_templates_many?: Maybe<Array<Maybe<Email_Templates_Mutation_Response>>>;
  /** update multiples rows of table: "storage.files" */
  update_files_many?: Maybe<Array<Maybe<Files_Mutation_Response>>>;
  /** update data of the table: "global_variables" */
  update_global_variables?: Maybe<Global_Variables_Mutation_Response>;
  /** update single row of the table: "global_variables" */
  update_global_variables_by_pk?: Maybe<Global_Variables>;
  /** update multiples rows of table: "global_variables" */
  update_global_variables_many?: Maybe<Array<Maybe<Global_Variables_Mutation_Response>>>;
  /** update data of the table: "manual_vote_attachments" */
  update_manual_vote_attachments?: Maybe<Manual_Vote_Attachments_Mutation_Response>;
  /** update single row of the table: "manual_vote_attachments" */
  update_manual_vote_attachments_by_pk?: Maybe<Manual_Vote_Attachments>;
  /** update multiples rows of table: "manual_vote_attachments" */
  update_manual_vote_attachments_many?: Maybe<Array<Maybe<Manual_Vote_Attachments_Mutation_Response>>>;
  /** update data of the table: "manual_vote_notes" */
  update_manual_vote_notes?: Maybe<Manual_Vote_Notes_Mutation_Response>;
  /** update single row of the table: "manual_vote_notes" */
  update_manual_vote_notes_by_pk?: Maybe<Manual_Vote_Notes>;
  /** update multiples rows of table: "manual_vote_notes" */
  update_manual_vote_notes_many?: Maybe<Array<Maybe<Manual_Vote_Notes_Mutation_Response>>>;
  /** update data of the table: "member_votes" */
  update_member_votes?: Maybe<Member_Votes_Mutation_Response>;
  /** update single row of the table: "member_votes" */
  update_member_votes_by_pk?: Maybe<Member_Votes>;
  /** update multiples rows of table: "member_votes" */
  update_member_votes_many?: Maybe<Array<Maybe<Member_Votes_Mutation_Response>>>;
  /** update data of the table: "members" */
  update_members?: Maybe<Members_Mutation_Response>;
  /** update single row of the table: "members" */
  update_members_by_pk?: Maybe<Members>;
  /** update multiples rows of table: "members" */
  update_members_many?: Maybe<Array<Maybe<Members_Mutation_Response>>>;
  /** update data of the table: "notifications" */
  update_notifications?: Maybe<Notifications_Mutation_Response>;
  /** update single row of the table: "notifications" */
  update_notifications_by_pk?: Maybe<Notifications>;
  /** update multiples rows of table: "notifications" */
  update_notifications_many?: Maybe<Array<Maybe<Notifications_Mutation_Response>>>;
  /** update data of the table: "observers" */
  update_observers?: Maybe<Observers_Mutation_Response>;
  /** update single row of the table: "observers" */
  update_observers_by_pk?: Maybe<Observers>;
  /** update multiples rows of table: "observers" */
  update_observers_many?: Maybe<Array<Maybe<Observers_Mutation_Response>>>;
  /** update data of the table: "proxy_votes" */
  update_proxy_votes?: Maybe<Proxy_Votes_Mutation_Response>;
  /** update single row of the table: "proxy_votes" */
  update_proxy_votes_by_pk?: Maybe<Proxy_Votes>;
  /** update multiples rows of table: "proxy_votes" */
  update_proxy_votes_many?: Maybe<Array<Maybe<Proxy_Votes_Mutation_Response>>>;
  /** update data of the table: "question_responses" */
  update_question_responses?: Maybe<Question_Responses_Mutation_Response>;
  /** update single row of the table: "question_responses" */
  update_question_responses_by_pk?: Maybe<Question_Responses>;
  /** update multiples rows of table: "question_responses" */
  update_question_responses_many?: Maybe<Array<Maybe<Question_Responses_Mutation_Response>>>;
  /** update data of the table: "questions" */
  update_questions?: Maybe<Questions_Mutation_Response>;
  /** update single row of the table: "questions" */
  update_questions_by_pk?: Maybe<Questions>;
  /** update multiples rows of table: "questions" */
  update_questions_many?: Maybe<Array<Maybe<Questions_Mutation_Response>>>;
  /** update data of the table: "reports" */
  update_reports?: Maybe<Reports_Mutation_Response>;
  /** update single row of the table: "reports" */
  update_reports_by_pk?: Maybe<Reports>;
  /** update multiples rows of table: "reports" */
  update_reports_many?: Maybe<Array<Maybe<Reports_Mutation_Response>>>;
  /** update data of the table: "sms_verifications" */
  update_sms_verifications?: Maybe<Sms_Verifications_Mutation_Response>;
  /** update single row of the table: "sms_verifications" */
  update_sms_verifications_by_pk?: Maybe<Sms_Verifications>;
  /** update multiples rows of table: "sms_verifications" */
  update_sms_verifications_many?: Maybe<Array<Maybe<Sms_Verifications_Mutation_Response>>>;
  /** update multiples rows of table: "auth.users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update multiples rows of table: "storage.virus" */
  update_virus_many?: Maybe<Array<Maybe<Virus_Mutation_Response>>>;
  /** update data of the table: "vote_analytics" */
  update_vote_analytics?: Maybe<Vote_Analytics_Mutation_Response>;
  /** update single row of the table: "vote_analytics" */
  update_vote_analytics_by_pk?: Maybe<Vote_Analytics>;
  /** update multiples rows of table: "vote_analytics" */
  update_vote_analytics_many?: Maybe<Array<Maybe<Vote_Analytics_Mutation_Response>>>;
  /** update data of the table: "vote_delegations" */
  update_vote_delegations?: Maybe<Vote_Delegations_Mutation_Response>;
  /** update single row of the table: "vote_delegations" */
  update_vote_delegations_by_pk?: Maybe<Vote_Delegations>;
  /** update multiples rows of table: "vote_delegations" */
  update_vote_delegations_many?: Maybe<Array<Maybe<Vote_Delegations_Mutation_Response>>>;
  /** update data of the table: "votes" */
  update_votes?: Maybe<Votes_Mutation_Response>;
  /** update single row of the table: "votes" */
  update_votes_by_pk?: Maybe<Votes>;
  /** update multiples rows of table: "votes" */
  update_votes_many?: Maybe<Array<Maybe<Votes_Mutation_Response>>>;
  /** update data of the table: "voting_tokens" */
  update_voting_tokens?: Maybe<Voting_Tokens_Mutation_Response>;
  /** update single row of the table: "voting_tokens" */
  update_voting_tokens_by_pk?: Maybe<Voting_Tokens>;
  /** update multiples rows of table: "voting_tokens" */
  update_voting_tokens_many?: Maybe<Array<Maybe<Voting_Tokens_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderRequestArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderRequestsArgs = {
  where: AuthProviderRequests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthProvidersArgs = {
  where: AuthProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokenArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokenTypeArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokenTypesArgs = {
  where: AuthRefreshTokenTypes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokensArgs = {
  where: AuthRefreshTokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRoleArgs = {
  role: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRolesArgs = {
  where: AuthRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserProviderArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserProvidersArgs = {
  where: AuthUserProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserRoleArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserRolesArgs = {
  where: AuthUserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserSecurityKeyArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserSecurityKeysArgs = {
  where: AuthUserSecurityKeys_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteBucketArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBucketsArgs = {
  where: Buckets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteFileArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteFilesArgs = {
  where: Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteUserArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteVirusArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteVirusesArgs = {
  where: Virus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_AttachmentsArgs = {
  where: Attachments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Attachments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Audit_LogArgs = {
  where: Audit_Log_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Audit_Log_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Building_Variable_DefinitionsArgs = {
  where: Building_Variable_Definitions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Building_Variable_Definitions_By_PkArgs = {
  name: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Building_VariablesArgs = {
  where: Building_Variables_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Building_Variables_By_PkArgs = {
  building_id: Scalars['uuid']['input'];
  name: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_BuildingsArgs = {
  where: Buildings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Buildings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Document_TemplatesArgs = {
  where: Document_Templates_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Document_Templates_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Email_TemplatesArgs = {
  where: Email_Templates_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Email_Templates_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Global_VariablesArgs = {
  where: Global_Variables_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Global_Variables_By_PkArgs = {
  name: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Manual_Vote_AttachmentsArgs = {
  where: Manual_Vote_Attachments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Manual_Vote_Attachments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Manual_Vote_NotesArgs = {
  where: Manual_Vote_Notes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Manual_Vote_Notes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Member_VotesArgs = {
  where: Member_Votes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Member_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_MembersArgs = {
  where: Members_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Members_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_NotificationsArgs = {
  where: Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Notifications_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ObserversArgs = {
  where: Observers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Observers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Proxy_VotesArgs = {
  where: Proxy_Votes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Proxy_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Question_ResponsesArgs = {
  where: Question_Responses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Question_Responses_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_QuestionsArgs = {
  where: Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Questions_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ReportsArgs = {
  where: Reports_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Reports_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Sms_VerificationsArgs = {
  where: Sms_Verifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sms_Verifications_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vote_AnalyticsArgs = {
  where: Vote_Analytics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vote_Analytics_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Vote_DelegationsArgs = {
  where: Vote_Delegations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vote_Delegations_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_VotesArgs = {
  where: Votes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Voting_TokensArgs = {
  where: Voting_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Voting_Tokens_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsertAuthProviderArgs = {
  object: AuthProviders_Insert_Input;
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderRequestArgs = {
  object: AuthProviderRequests_Insert_Input;
  on_conflict?: InputMaybe<AuthProviderRequests_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderRequestsArgs = {
  objects: Array<AuthProviderRequests_Insert_Input>;
  on_conflict?: InputMaybe<AuthProviderRequests_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProvidersArgs = {
  objects: Array<AuthProviders_Insert_Input>;
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokenArgs = {
  object: AuthRefreshTokens_Insert_Input;
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokenTypeArgs = {
  object: AuthRefreshTokenTypes_Insert_Input;
  on_conflict?: InputMaybe<AuthRefreshTokenTypes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokenTypesArgs = {
  objects: Array<AuthRefreshTokenTypes_Insert_Input>;
  on_conflict?: InputMaybe<AuthRefreshTokenTypes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokensArgs = {
  objects: Array<AuthRefreshTokens_Insert_Input>;
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRoleArgs = {
  object: AuthRoles_Insert_Input;
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRolesArgs = {
  objects: Array<AuthRoles_Insert_Input>;
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserProviderArgs = {
  object: AuthUserProviders_Insert_Input;
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserProvidersArgs = {
  objects: Array<AuthUserProviders_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserRoleArgs = {
  object: AuthUserRoles_Insert_Input;
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserRolesArgs = {
  objects: Array<AuthUserRoles_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserSecurityKeyArgs = {
  object: AuthUserSecurityKeys_Insert_Input;
  on_conflict?: InputMaybe<AuthUserSecurityKeys_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserSecurityKeysArgs = {
  objects: Array<AuthUserSecurityKeys_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserSecurityKeys_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertBucketArgs = {
  object: Buckets_Insert_Input;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertBucketsArgs = {
  objects: Array<Buckets_Insert_Input>;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertFileArgs = {
  object: Files_Insert_Input;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertFilesArgs = {
  objects: Array<Files_Insert_Input>;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUserArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertVirusArgs = {
  object: Virus_Insert_Input;
  on_conflict?: InputMaybe<Virus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertVirusesArgs = {
  objects: Array<Virus_Insert_Input>;
  on_conflict?: InputMaybe<Virus_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_AttachmentsArgs = {
  objects: Array<Attachments_Insert_Input>;
  on_conflict?: InputMaybe<Attachments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attachments_OneArgs = {
  object: Attachments_Insert_Input;
  on_conflict?: InputMaybe<Attachments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Audit_LogArgs = {
  objects: Array<Audit_Log_Insert_Input>;
  on_conflict?: InputMaybe<Audit_Log_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Audit_Log_OneArgs = {
  object: Audit_Log_Insert_Input;
  on_conflict?: InputMaybe<Audit_Log_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Building_Variable_DefinitionsArgs = {
  objects: Array<Building_Variable_Definitions_Insert_Input>;
  on_conflict?: InputMaybe<Building_Variable_Definitions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Building_Variable_Definitions_OneArgs = {
  object: Building_Variable_Definitions_Insert_Input;
  on_conflict?: InputMaybe<Building_Variable_Definitions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Building_VariablesArgs = {
  objects: Array<Building_Variables_Insert_Input>;
  on_conflict?: InputMaybe<Building_Variables_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Building_Variables_OneArgs = {
  object: Building_Variables_Insert_Input;
  on_conflict?: InputMaybe<Building_Variables_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BuildingsArgs = {
  objects: Array<Buildings_Insert_Input>;
  on_conflict?: InputMaybe<Buildings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Buildings_OneArgs = {
  object: Buildings_Insert_Input;
  on_conflict?: InputMaybe<Buildings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Document_TemplatesArgs = {
  objects: Array<Document_Templates_Insert_Input>;
  on_conflict?: InputMaybe<Document_Templates_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Document_Templates_OneArgs = {
  object: Document_Templates_Insert_Input;
  on_conflict?: InputMaybe<Document_Templates_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Email_TemplatesArgs = {
  objects: Array<Email_Templates_Insert_Input>;
  on_conflict?: InputMaybe<Email_Templates_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Email_Templates_OneArgs = {
  object: Email_Templates_Insert_Input;
  on_conflict?: InputMaybe<Email_Templates_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Global_VariablesArgs = {
  objects: Array<Global_Variables_Insert_Input>;
  on_conflict?: InputMaybe<Global_Variables_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Global_Variables_OneArgs = {
  object: Global_Variables_Insert_Input;
  on_conflict?: InputMaybe<Global_Variables_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Manual_Vote_AttachmentsArgs = {
  objects: Array<Manual_Vote_Attachments_Insert_Input>;
  on_conflict?: InputMaybe<Manual_Vote_Attachments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Manual_Vote_Attachments_OneArgs = {
  object: Manual_Vote_Attachments_Insert_Input;
  on_conflict?: InputMaybe<Manual_Vote_Attachments_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Manual_Vote_NotesArgs = {
  objects: Array<Manual_Vote_Notes_Insert_Input>;
  on_conflict?: InputMaybe<Manual_Vote_Notes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Manual_Vote_Notes_OneArgs = {
  object: Manual_Vote_Notes_Insert_Input;
  on_conflict?: InputMaybe<Manual_Vote_Notes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Member_VotesArgs = {
  objects: Array<Member_Votes_Insert_Input>;
  on_conflict?: InputMaybe<Member_Votes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Member_Votes_OneArgs = {
  object: Member_Votes_Insert_Input;
  on_conflict?: InputMaybe<Member_Votes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MembersArgs = {
  objects: Array<Members_Insert_Input>;
  on_conflict?: InputMaybe<Members_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Members_OneArgs = {
  object: Members_Insert_Input;
  on_conflict?: InputMaybe<Members_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_NotificationsArgs = {
  objects: Array<Notifications_Insert_Input>;
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Notifications_OneArgs = {
  object: Notifications_Insert_Input;
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ObserversArgs = {
  objects: Array<Observers_Insert_Input>;
  on_conflict?: InputMaybe<Observers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Observers_OneArgs = {
  object: Observers_Insert_Input;
  on_conflict?: InputMaybe<Observers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Proxy_VotesArgs = {
  objects: Array<Proxy_Votes_Insert_Input>;
  on_conflict?: InputMaybe<Proxy_Votes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Proxy_Votes_OneArgs = {
  object: Proxy_Votes_Insert_Input;
  on_conflict?: InputMaybe<Proxy_Votes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Question_ResponsesArgs = {
  objects: Array<Question_Responses_Insert_Input>;
  on_conflict?: InputMaybe<Question_Responses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Question_Responses_OneArgs = {
  object: Question_Responses_Insert_Input;
  on_conflict?: InputMaybe<Question_Responses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QuestionsArgs = {
  objects: Array<Questions_Insert_Input>;
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Questions_OneArgs = {
  object: Questions_Insert_Input;
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ReportsArgs = {
  objects: Array<Reports_Insert_Input>;
  on_conflict?: InputMaybe<Reports_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reports_OneArgs = {
  object: Reports_Insert_Input;
  on_conflict?: InputMaybe<Reports_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sms_VerificationsArgs = {
  objects: Array<Sms_Verifications_Insert_Input>;
  on_conflict?: InputMaybe<Sms_Verifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sms_Verifications_OneArgs = {
  object: Sms_Verifications_Insert_Input;
  on_conflict?: InputMaybe<Sms_Verifications_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vote_AnalyticsArgs = {
  objects: Array<Vote_Analytics_Insert_Input>;
  on_conflict?: InputMaybe<Vote_Analytics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vote_Analytics_OneArgs = {
  object: Vote_Analytics_Insert_Input;
  on_conflict?: InputMaybe<Vote_Analytics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vote_DelegationsArgs = {
  objects: Array<Vote_Delegations_Insert_Input>;
  on_conflict?: InputMaybe<Vote_Delegations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vote_Delegations_OneArgs = {
  object: Vote_Delegations_Insert_Input;
  on_conflict?: InputMaybe<Vote_Delegations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_VotesArgs = {
  objects: Array<Votes_Insert_Input>;
  on_conflict?: InputMaybe<Votes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Votes_OneArgs = {
  object: Votes_Insert_Input;
  on_conflict?: InputMaybe<Votes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Voting_TokensArgs = {
  objects: Array<Voting_Tokens_Insert_Input>;
  on_conflict?: InputMaybe<Voting_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Voting_Tokens_OneArgs = {
  object: Voting_Tokens_Insert_Input;
  on_conflict?: InputMaybe<Voting_Tokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderArgs = {
  _set?: InputMaybe<AuthProviders_Set_Input>;
  pk_columns: AuthProviders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderRequestArgs = {
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  pk_columns: AuthProviderRequests_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderRequestsArgs = {
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  where: AuthProviderRequests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthProvidersArgs = {
  _set?: InputMaybe<AuthProviders_Set_Input>;
  where: AuthProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokenArgs = {
  _append?: InputMaybe<AuthRefreshTokens_Append_Input>;
  _delete_at_path?: InputMaybe<AuthRefreshTokens_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthRefreshTokens_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthRefreshTokens_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthRefreshTokens_Prepend_Input>;
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  pk_columns: AuthRefreshTokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokenTypeArgs = {
  _set?: InputMaybe<AuthRefreshTokenTypes_Set_Input>;
  pk_columns: AuthRefreshTokenTypes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokenTypesArgs = {
  _set?: InputMaybe<AuthRefreshTokenTypes_Set_Input>;
  where: AuthRefreshTokenTypes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokensArgs = {
  _append?: InputMaybe<AuthRefreshTokens_Append_Input>;
  _delete_at_path?: InputMaybe<AuthRefreshTokens_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthRefreshTokens_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthRefreshTokens_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthRefreshTokens_Prepend_Input>;
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  where: AuthRefreshTokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRoleArgs = {
  _set?: InputMaybe<AuthRoles_Set_Input>;
  pk_columns: AuthRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRolesArgs = {
  _set?: InputMaybe<AuthRoles_Set_Input>;
  where: AuthRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserProviderArgs = {
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  pk_columns: AuthUserProviders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserProvidersArgs = {
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  where: AuthUserProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserRoleArgs = {
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  pk_columns: AuthUserRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserRolesArgs = {
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  where: AuthUserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserSecurityKeyArgs = {
  _inc?: InputMaybe<AuthUserSecurityKeys_Inc_Input>;
  _set?: InputMaybe<AuthUserSecurityKeys_Set_Input>;
  pk_columns: AuthUserSecurityKeys_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserSecurityKeysArgs = {
  _inc?: InputMaybe<AuthUserSecurityKeys_Inc_Input>;
  _set?: InputMaybe<AuthUserSecurityKeys_Set_Input>;
  where: AuthUserSecurityKeys_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateBucketArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  pk_columns: Buckets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateBucketsArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  where: Buckets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateFileArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  pk_columns: Files_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateFilesArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  where: Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateUserArgs = {
  _append?: InputMaybe<Users_Append_Input>;
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  _prepend?: InputMaybe<Users_Prepend_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateUsersArgs = {
  _append?: InputMaybe<Users_Append_Input>;
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  _prepend?: InputMaybe<Users_Prepend_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateVirusArgs = {
  _append?: InputMaybe<Virus_Append_Input>;
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  _set?: InputMaybe<Virus_Set_Input>;
  pk_columns: Virus_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateVirusesArgs = {
  _append?: InputMaybe<Virus_Append_Input>;
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  _set?: InputMaybe<Virus_Set_Input>;
  where: Virus_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_AttachmentsArgs = {
  _append?: InputMaybe<Attachments_Append_Input>;
  _delete_at_path?: InputMaybe<Attachments_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Attachments_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Attachments_Delete_Key_Input>;
  _inc?: InputMaybe<Attachments_Inc_Input>;
  _prepend?: InputMaybe<Attachments_Prepend_Input>;
  _set?: InputMaybe<Attachments_Set_Input>;
  where: Attachments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Attachments_By_PkArgs = {
  _append?: InputMaybe<Attachments_Append_Input>;
  _delete_at_path?: InputMaybe<Attachments_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Attachments_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Attachments_Delete_Key_Input>;
  _inc?: InputMaybe<Attachments_Inc_Input>;
  _prepend?: InputMaybe<Attachments_Prepend_Input>;
  _set?: InputMaybe<Attachments_Set_Input>;
  pk_columns: Attachments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Attachments_ManyArgs = {
  updates: Array<Attachments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Audit_LogArgs = {
  _append?: InputMaybe<Audit_Log_Append_Input>;
  _delete_at_path?: InputMaybe<Audit_Log_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Audit_Log_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Audit_Log_Delete_Key_Input>;
  _prepend?: InputMaybe<Audit_Log_Prepend_Input>;
  _set?: InputMaybe<Audit_Log_Set_Input>;
  where: Audit_Log_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Audit_Log_By_PkArgs = {
  _append?: InputMaybe<Audit_Log_Append_Input>;
  _delete_at_path?: InputMaybe<Audit_Log_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Audit_Log_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Audit_Log_Delete_Key_Input>;
  _prepend?: InputMaybe<Audit_Log_Prepend_Input>;
  _set?: InputMaybe<Audit_Log_Set_Input>;
  pk_columns: Audit_Log_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Audit_Log_ManyArgs = {
  updates: Array<Audit_Log_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthProviderRequests_ManyArgs = {
  updates: Array<AuthProviderRequests_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthProviders_ManyArgs = {
  updates: Array<AuthProviders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthRefreshTokenTypes_ManyArgs = {
  updates: Array<AuthRefreshTokenTypes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthRefreshTokens_ManyArgs = {
  updates: Array<AuthRefreshTokens_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthRoles_ManyArgs = {
  updates: Array<AuthRoles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthUserProviders_ManyArgs = {
  updates: Array<AuthUserProviders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthUserRoles_ManyArgs = {
  updates: Array<AuthUserRoles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthUserSecurityKeys_ManyArgs = {
  updates: Array<AuthUserSecurityKeys_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Buckets_ManyArgs = {
  updates: Array<Buckets_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Building_Variable_DefinitionsArgs = {
  _set?: InputMaybe<Building_Variable_Definitions_Set_Input>;
  where: Building_Variable_Definitions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Building_Variable_Definitions_By_PkArgs = {
  _set?: InputMaybe<Building_Variable_Definitions_Set_Input>;
  pk_columns: Building_Variable_Definitions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Building_Variable_Definitions_ManyArgs = {
  updates: Array<Building_Variable_Definitions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Building_VariablesArgs = {
  _set?: InputMaybe<Building_Variables_Set_Input>;
  where: Building_Variables_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Building_Variables_By_PkArgs = {
  _set?: InputMaybe<Building_Variables_Set_Input>;
  pk_columns: Building_Variables_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Building_Variables_ManyArgs = {
  updates: Array<Building_Variables_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_BuildingsArgs = {
  _append?: InputMaybe<Buildings_Append_Input>;
  _delete_at_path?: InputMaybe<Buildings_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Buildings_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Buildings_Delete_Key_Input>;
  _inc?: InputMaybe<Buildings_Inc_Input>;
  _prepend?: InputMaybe<Buildings_Prepend_Input>;
  _set?: InputMaybe<Buildings_Set_Input>;
  where: Buildings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Buildings_By_PkArgs = {
  _append?: InputMaybe<Buildings_Append_Input>;
  _delete_at_path?: InputMaybe<Buildings_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Buildings_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Buildings_Delete_Key_Input>;
  _inc?: InputMaybe<Buildings_Inc_Input>;
  _prepend?: InputMaybe<Buildings_Prepend_Input>;
  _set?: InputMaybe<Buildings_Set_Input>;
  pk_columns: Buildings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Buildings_ManyArgs = {
  updates: Array<Buildings_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Document_TemplatesArgs = {
  _set?: InputMaybe<Document_Templates_Set_Input>;
  where: Document_Templates_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Document_Templates_By_PkArgs = {
  _set?: InputMaybe<Document_Templates_Set_Input>;
  pk_columns: Document_Templates_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Document_Templates_ManyArgs = {
  updates: Array<Document_Templates_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Email_TemplatesArgs = {
  _append?: InputMaybe<Email_Templates_Append_Input>;
  _delete_at_path?: InputMaybe<Email_Templates_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Email_Templates_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Email_Templates_Delete_Key_Input>;
  _prepend?: InputMaybe<Email_Templates_Prepend_Input>;
  _set?: InputMaybe<Email_Templates_Set_Input>;
  where: Email_Templates_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Email_Templates_By_PkArgs = {
  _append?: InputMaybe<Email_Templates_Append_Input>;
  _delete_at_path?: InputMaybe<Email_Templates_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Email_Templates_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Email_Templates_Delete_Key_Input>;
  _prepend?: InputMaybe<Email_Templates_Prepend_Input>;
  _set?: InputMaybe<Email_Templates_Set_Input>;
  pk_columns: Email_Templates_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Email_Templates_ManyArgs = {
  updates: Array<Email_Templates_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Files_ManyArgs = {
  updates: Array<Files_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Global_VariablesArgs = {
  _set?: InputMaybe<Global_Variables_Set_Input>;
  where: Global_Variables_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Global_Variables_By_PkArgs = {
  _set?: InputMaybe<Global_Variables_Set_Input>;
  pk_columns: Global_Variables_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Global_Variables_ManyArgs = {
  updates: Array<Global_Variables_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Manual_Vote_AttachmentsArgs = {
  _set?: InputMaybe<Manual_Vote_Attachments_Set_Input>;
  where: Manual_Vote_Attachments_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Manual_Vote_Attachments_By_PkArgs = {
  _set?: InputMaybe<Manual_Vote_Attachments_Set_Input>;
  pk_columns: Manual_Vote_Attachments_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Manual_Vote_Attachments_ManyArgs = {
  updates: Array<Manual_Vote_Attachments_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Manual_Vote_NotesArgs = {
  _set?: InputMaybe<Manual_Vote_Notes_Set_Input>;
  where: Manual_Vote_Notes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Manual_Vote_Notes_By_PkArgs = {
  _set?: InputMaybe<Manual_Vote_Notes_Set_Input>;
  pk_columns: Manual_Vote_Notes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Manual_Vote_Notes_ManyArgs = {
  updates: Array<Manual_Vote_Notes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Member_VotesArgs = {
  _append?: InputMaybe<Member_Votes_Append_Input>;
  _delete_at_path?: InputMaybe<Member_Votes_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Member_Votes_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Member_Votes_Delete_Key_Input>;
  _inc?: InputMaybe<Member_Votes_Inc_Input>;
  _prepend?: InputMaybe<Member_Votes_Prepend_Input>;
  _set?: InputMaybe<Member_Votes_Set_Input>;
  where: Member_Votes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Member_Votes_By_PkArgs = {
  _append?: InputMaybe<Member_Votes_Append_Input>;
  _delete_at_path?: InputMaybe<Member_Votes_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Member_Votes_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Member_Votes_Delete_Key_Input>;
  _inc?: InputMaybe<Member_Votes_Inc_Input>;
  _prepend?: InputMaybe<Member_Votes_Prepend_Input>;
  _set?: InputMaybe<Member_Votes_Set_Input>;
  pk_columns: Member_Votes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Member_Votes_ManyArgs = {
  updates: Array<Member_Votes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_MembersArgs = {
  _inc?: InputMaybe<Members_Inc_Input>;
  _set?: InputMaybe<Members_Set_Input>;
  where: Members_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Members_By_PkArgs = {
  _inc?: InputMaybe<Members_Inc_Input>;
  _set?: InputMaybe<Members_Set_Input>;
  pk_columns: Members_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Members_ManyArgs = {
  updates: Array<Members_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_NotificationsArgs = {
  _append?: InputMaybe<Notifications_Append_Input>;
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  _set?: InputMaybe<Notifications_Set_Input>;
  where: Notifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Notifications_By_PkArgs = {
  _append?: InputMaybe<Notifications_Append_Input>;
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  _set?: InputMaybe<Notifications_Set_Input>;
  pk_columns: Notifications_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Notifications_ManyArgs = {
  updates: Array<Notifications_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ObserversArgs = {
  _set?: InputMaybe<Observers_Set_Input>;
  where: Observers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Observers_By_PkArgs = {
  _set?: InputMaybe<Observers_Set_Input>;
  pk_columns: Observers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Observers_ManyArgs = {
  updates: Array<Observers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Proxy_VotesArgs = {
  _set?: InputMaybe<Proxy_Votes_Set_Input>;
  where: Proxy_Votes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Proxy_Votes_By_PkArgs = {
  _set?: InputMaybe<Proxy_Votes_Set_Input>;
  pk_columns: Proxy_Votes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Proxy_Votes_ManyArgs = {
  updates: Array<Proxy_Votes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Question_ResponsesArgs = {
  _append?: InputMaybe<Question_Responses_Append_Input>;
  _delete_at_path?: InputMaybe<Question_Responses_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Question_Responses_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Question_Responses_Delete_Key_Input>;
  _inc?: InputMaybe<Question_Responses_Inc_Input>;
  _prepend?: InputMaybe<Question_Responses_Prepend_Input>;
  _set?: InputMaybe<Question_Responses_Set_Input>;
  where: Question_Responses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Question_Responses_By_PkArgs = {
  _append?: InputMaybe<Question_Responses_Append_Input>;
  _delete_at_path?: InputMaybe<Question_Responses_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Question_Responses_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Question_Responses_Delete_Key_Input>;
  _inc?: InputMaybe<Question_Responses_Inc_Input>;
  _prepend?: InputMaybe<Question_Responses_Prepend_Input>;
  _set?: InputMaybe<Question_Responses_Set_Input>;
  pk_columns: Question_Responses_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Question_Responses_ManyArgs = {
  updates: Array<Question_Responses_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_QuestionsArgs = {
  _append?: InputMaybe<Questions_Append_Input>;
  _delete_at_path?: InputMaybe<Questions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Questions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Questions_Delete_Key_Input>;
  _inc?: InputMaybe<Questions_Inc_Input>;
  _prepend?: InputMaybe<Questions_Prepend_Input>;
  _set?: InputMaybe<Questions_Set_Input>;
  where: Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Questions_By_PkArgs = {
  _append?: InputMaybe<Questions_Append_Input>;
  _delete_at_path?: InputMaybe<Questions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Questions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Questions_Delete_Key_Input>;
  _inc?: InputMaybe<Questions_Inc_Input>;
  _prepend?: InputMaybe<Questions_Prepend_Input>;
  _set?: InputMaybe<Questions_Set_Input>;
  pk_columns: Questions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Questions_ManyArgs = {
  updates: Array<Questions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ReportsArgs = {
  _append?: InputMaybe<Reports_Append_Input>;
  _delete_at_path?: InputMaybe<Reports_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Reports_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Reports_Delete_Key_Input>;
  _inc?: InputMaybe<Reports_Inc_Input>;
  _prepend?: InputMaybe<Reports_Prepend_Input>;
  _set?: InputMaybe<Reports_Set_Input>;
  where: Reports_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Reports_By_PkArgs = {
  _append?: InputMaybe<Reports_Append_Input>;
  _delete_at_path?: InputMaybe<Reports_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Reports_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Reports_Delete_Key_Input>;
  _inc?: InputMaybe<Reports_Inc_Input>;
  _prepend?: InputMaybe<Reports_Prepend_Input>;
  _set?: InputMaybe<Reports_Set_Input>;
  pk_columns: Reports_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Reports_ManyArgs = {
  updates: Array<Reports_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Sms_VerificationsArgs = {
  _inc?: InputMaybe<Sms_Verifications_Inc_Input>;
  _set?: InputMaybe<Sms_Verifications_Set_Input>;
  where: Sms_Verifications_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sms_Verifications_By_PkArgs = {
  _inc?: InputMaybe<Sms_Verifications_Inc_Input>;
  _set?: InputMaybe<Sms_Verifications_Set_Input>;
  pk_columns: Sms_Verifications_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sms_Verifications_ManyArgs = {
  updates: Array<Sms_Verifications_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Virus_ManyArgs = {
  updates: Array<Virus_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vote_AnalyticsArgs = {
  _append?: InputMaybe<Vote_Analytics_Append_Input>;
  _delete_at_path?: InputMaybe<Vote_Analytics_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Vote_Analytics_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Vote_Analytics_Delete_Key_Input>;
  _inc?: InputMaybe<Vote_Analytics_Inc_Input>;
  _prepend?: InputMaybe<Vote_Analytics_Prepend_Input>;
  _set?: InputMaybe<Vote_Analytics_Set_Input>;
  where: Vote_Analytics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vote_Analytics_By_PkArgs = {
  _append?: InputMaybe<Vote_Analytics_Append_Input>;
  _delete_at_path?: InputMaybe<Vote_Analytics_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Vote_Analytics_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Vote_Analytics_Delete_Key_Input>;
  _inc?: InputMaybe<Vote_Analytics_Inc_Input>;
  _prepend?: InputMaybe<Vote_Analytics_Prepend_Input>;
  _set?: InputMaybe<Vote_Analytics_Set_Input>;
  pk_columns: Vote_Analytics_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vote_Analytics_ManyArgs = {
  updates: Array<Vote_Analytics_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Vote_DelegationsArgs = {
  _set?: InputMaybe<Vote_Delegations_Set_Input>;
  where: Vote_Delegations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vote_Delegations_By_PkArgs = {
  _set?: InputMaybe<Vote_Delegations_Set_Input>;
  pk_columns: Vote_Delegations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vote_Delegations_ManyArgs = {
  updates: Array<Vote_Delegations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_VotesArgs = {
  _append?: InputMaybe<Votes_Append_Input>;
  _delete_at_path?: InputMaybe<Votes_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Votes_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Votes_Delete_Key_Input>;
  _prepend?: InputMaybe<Votes_Prepend_Input>;
  _set?: InputMaybe<Votes_Set_Input>;
  where: Votes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Votes_By_PkArgs = {
  _append?: InputMaybe<Votes_Append_Input>;
  _delete_at_path?: InputMaybe<Votes_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Votes_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Votes_Delete_Key_Input>;
  _prepend?: InputMaybe<Votes_Prepend_Input>;
  _set?: InputMaybe<Votes_Set_Input>;
  pk_columns: Votes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Votes_ManyArgs = {
  updates: Array<Votes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Voting_TokensArgs = {
  _append?: InputMaybe<Voting_Tokens_Append_Input>;
  _delete_at_path?: InputMaybe<Voting_Tokens_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Voting_Tokens_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Voting_Tokens_Delete_Key_Input>;
  _inc?: InputMaybe<Voting_Tokens_Inc_Input>;
  _prepend?: InputMaybe<Voting_Tokens_Prepend_Input>;
  _set?: InputMaybe<Voting_Tokens_Set_Input>;
  where: Voting_Tokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Voting_Tokens_By_PkArgs = {
  _append?: InputMaybe<Voting_Tokens_Append_Input>;
  _delete_at_path?: InputMaybe<Voting_Tokens_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Voting_Tokens_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Voting_Tokens_Delete_Key_Input>;
  _inc?: InputMaybe<Voting_Tokens_Inc_Input>;
  _prepend?: InputMaybe<Voting_Tokens_Prepend_Input>;
  _set?: InputMaybe<Voting_Tokens_Set_Input>;
  pk_columns: Voting_Tokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Voting_Tokens_ManyArgs = {
  updates: Array<Voting_Tokens_Updates>;
};

/** columns and relationships of "notifications" */
export type Notifications = {
  building_id: Scalars['uuid']['output'];
  channels?: Maybe<Array<Scalars['String']['output']>>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  data?: Maybe<Scalars['jsonb']['output']>;
  id: Scalars['uuid']['output'];
  is_read?: Maybe<Scalars['Boolean']['output']>;
  is_sent?: Maybe<Scalars['Boolean']['output']>;
  message: Scalars['String']['output'];
  priority?: Maybe<Scalars['String']['output']>;
  read_at?: Maybe<Scalars['timestamptz']['output']>;
  recipient_id: Scalars['uuid']['output'];
  sent_at?: Maybe<Scalars['timestamptz']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  vote_id?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "notifications" */
export type NotificationsDataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "notifications" */
export type Notifications_Aggregate = {
  aggregate?: Maybe<Notifications_Aggregate_Fields>;
  nodes: Array<Notifications>;
};

/** aggregate fields of "notifications" */
export type Notifications_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Notifications_Max_Fields>;
  min?: Maybe<Notifications_Min_Fields>;
};


/** aggregate fields of "notifications" */
export type Notifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notifications_Append_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "notifications". All fields are combined with a logical 'AND'. */
export type Notifications_Bool_Exp = {
  _and?: InputMaybe<Array<Notifications_Bool_Exp>>;
  _not?: InputMaybe<Notifications_Bool_Exp>;
  _or?: InputMaybe<Array<Notifications_Bool_Exp>>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  channels?: InputMaybe<String_Array_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_read?: InputMaybe<Boolean_Comparison_Exp>;
  is_sent?: InputMaybe<Boolean_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  priority?: InputMaybe<String_Comparison_Exp>;
  read_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  recipient_id?: InputMaybe<Uuid_Comparison_Exp>;
  sent_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notifications" */
export enum Notifications_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationsPkey = 'notifications_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notifications_Delete_At_Path_Input = {
  data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notifications_Delete_Elem_Input = {
  data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notifications_Delete_Key_Input = {
  data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "notifications" */
export type Notifications_Insert_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  channels?: InputMaybe<Array<Scalars['String']['input']>>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_read?: InputMaybe<Scalars['Boolean']['input']>;
  is_sent?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  read_at?: InputMaybe<Scalars['timestamptz']['input']>;
  recipient_id?: InputMaybe<Scalars['uuid']['input']>;
  sent_at?: InputMaybe<Scalars['timestamptz']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Notifications_Max_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  channels?: Maybe<Array<Scalars['String']['output']>>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  read_at?: Maybe<Scalars['timestamptz']['output']>;
  recipient_id?: Maybe<Scalars['uuid']['output']>;
  sent_at?: Maybe<Scalars['timestamptz']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Notifications_Min_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  channels?: Maybe<Array<Scalars['String']['output']>>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  read_at?: Maybe<Scalars['timestamptz']['output']>;
  recipient_id?: Maybe<Scalars['uuid']['output']>;
  sent_at?: Maybe<Scalars['timestamptz']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "notifications" */
export type Notifications_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Notifications>;
};

/** on_conflict condition type for table "notifications" */
export type Notifications_On_Conflict = {
  constraint: Notifications_Constraint;
  update_columns?: Array<Notifications_Update_Column>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** Ordering options when selecting data from "notifications". */
export type Notifications_Order_By = {
  building_id?: InputMaybe<Order_By>;
  channels?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_read?: InputMaybe<Order_By>;
  is_sent?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  priority?: InputMaybe<Order_By>;
  read_at?: InputMaybe<Order_By>;
  recipient_id?: InputMaybe<Order_By>;
  sent_at?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notifications */
export type Notifications_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notifications_Prepend_Input = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "notifications" */
export enum Notifications_Select_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  Channels = 'channels',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  IsRead = 'is_read',
  /** column name */
  IsSent = 'is_sent',
  /** column name */
  Message = 'message',
  /** column name */
  Priority = 'priority',
  /** column name */
  ReadAt = 'read_at',
  /** column name */
  RecipientId = 'recipient_id',
  /** column name */
  SentAt = 'sent_at',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "notifications" */
export type Notifications_Set_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  channels?: InputMaybe<Array<Scalars['String']['input']>>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_read?: InputMaybe<Scalars['Boolean']['input']>;
  is_sent?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  read_at?: InputMaybe<Scalars['timestamptz']['input']>;
  recipient_id?: InputMaybe<Scalars['uuid']['input']>;
  sent_at?: InputMaybe<Scalars['timestamptz']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "notifications" */
export type Notifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notifications_Stream_Cursor_Value_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  channels?: InputMaybe<Array<Scalars['String']['input']>>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_read?: InputMaybe<Scalars['Boolean']['input']>;
  is_sent?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  read_at?: InputMaybe<Scalars['timestamptz']['input']>;
  recipient_id?: InputMaybe<Scalars['uuid']['input']>;
  sent_at?: InputMaybe<Scalars['timestamptz']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "notifications" */
export enum Notifications_Update_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  Channels = 'channels',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  IsRead = 'is_read',
  /** column name */
  IsSent = 'is_sent',
  /** column name */
  Message = 'message',
  /** column name */
  Priority = 'priority',
  /** column name */
  ReadAt = 'read_at',
  /** column name */
  RecipientId = 'recipient_id',
  /** column name */
  SentAt = 'sent_at',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  VoteId = 'vote_id'
}

export type Notifications_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notifications_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notifications_Bool_Exp;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** columns and relationships of "observers" */
export type Observers = {
  building_id: Scalars['uuid']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "observers" */
export type Observers_Aggregate = {
  aggregate?: Maybe<Observers_Aggregate_Fields>;
  nodes: Array<Observers>;
};

/** aggregate fields of "observers" */
export type Observers_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Observers_Max_Fields>;
  min?: Maybe<Observers_Min_Fields>;
};


/** aggregate fields of "observers" */
export type Observers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Observers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "observers". All fields are combined with a logical 'AND'. */
export type Observers_Bool_Exp = {
  _and?: InputMaybe<Array<Observers_Bool_Exp>>;
  _not?: InputMaybe<Observers_Bool_Exp>;
  _or?: InputMaybe<Array<Observers_Bool_Exp>>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "observers" */
export enum Observers_Constraint {
  /** unique or primary key constraint on columns "id" */
  ObserversPkey = 'observers_pkey'
}

/** input type for inserting data into table "observers" */
export type Observers_Insert_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Observers_Max_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Observers_Min_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "observers" */
export type Observers_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Observers>;
};

/** on_conflict condition type for table "observers" */
export type Observers_On_Conflict = {
  constraint: Observers_Constraint;
  update_columns?: Array<Observers_Update_Column>;
  where?: InputMaybe<Observers_Bool_Exp>;
};

/** Ordering options when selecting data from "observers". */
export type Observers_Order_By = {
  building_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: observers */
export type Observers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "observers" */
export enum Observers_Select_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Phone = 'phone',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "observers" */
export type Observers_Set_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "observers" */
export type Observers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Observers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Observers_Stream_Cursor_Value_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "observers" */
export enum Observers_Update_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Phone = 'phone',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Observers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Observers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Observers_Bool_Exp;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "proxy_votes" */
export type Proxy_Votes = {
  authorization_document?: Maybe<Scalars['String']['output']>;
  authorization_expires?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  is_valid?: Maybe<Scalars['Boolean']['output']>;
  proxy_holder_id: Scalars['uuid']['output'];
  represented_member_id: Scalars['uuid']['output'];
  vote_id: Scalars['uuid']['output'];
};

/** aggregated selection of "proxy_votes" */
export type Proxy_Votes_Aggregate = {
  aggregate?: Maybe<Proxy_Votes_Aggregate_Fields>;
  nodes: Array<Proxy_Votes>;
};

/** aggregate fields of "proxy_votes" */
export type Proxy_Votes_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Proxy_Votes_Max_Fields>;
  min?: Maybe<Proxy_Votes_Min_Fields>;
};


/** aggregate fields of "proxy_votes" */
export type Proxy_Votes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Proxy_Votes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "proxy_votes". All fields are combined with a logical 'AND'. */
export type Proxy_Votes_Bool_Exp = {
  _and?: InputMaybe<Array<Proxy_Votes_Bool_Exp>>;
  _not?: InputMaybe<Proxy_Votes_Bool_Exp>;
  _or?: InputMaybe<Array<Proxy_Votes_Bool_Exp>>;
  authorization_document?: InputMaybe<String_Comparison_Exp>;
  authorization_expires?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_valid?: InputMaybe<Boolean_Comparison_Exp>;
  proxy_holder_id?: InputMaybe<Uuid_Comparison_Exp>;
  represented_member_id?: InputMaybe<Uuid_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "proxy_votes" */
export enum Proxy_Votes_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProxyVotesPkey = 'proxy_votes_pkey',
  /** unique or primary key constraint on columns "vote_id", "represented_member_id" */
  ProxyVotesVoteIdRepresentedMemberIdKey = 'proxy_votes_vote_id_represented_member_id_key'
}

/** input type for inserting data into table "proxy_votes" */
export type Proxy_Votes_Insert_Input = {
  authorization_document?: InputMaybe<Scalars['String']['input']>;
  authorization_expires?: InputMaybe<Scalars['timestamptz']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_valid?: InputMaybe<Scalars['Boolean']['input']>;
  proxy_holder_id?: InputMaybe<Scalars['uuid']['input']>;
  represented_member_id?: InputMaybe<Scalars['uuid']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Proxy_Votes_Max_Fields = {
  authorization_document?: Maybe<Scalars['String']['output']>;
  authorization_expires?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  proxy_holder_id?: Maybe<Scalars['uuid']['output']>;
  represented_member_id?: Maybe<Scalars['uuid']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Proxy_Votes_Min_Fields = {
  authorization_document?: Maybe<Scalars['String']['output']>;
  authorization_expires?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  proxy_holder_id?: Maybe<Scalars['uuid']['output']>;
  represented_member_id?: Maybe<Scalars['uuid']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "proxy_votes" */
export type Proxy_Votes_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Proxy_Votes>;
};

/** on_conflict condition type for table "proxy_votes" */
export type Proxy_Votes_On_Conflict = {
  constraint: Proxy_Votes_Constraint;
  update_columns?: Array<Proxy_Votes_Update_Column>;
  where?: InputMaybe<Proxy_Votes_Bool_Exp>;
};

/** Ordering options when selecting data from "proxy_votes". */
export type Proxy_Votes_Order_By = {
  authorization_document?: InputMaybe<Order_By>;
  authorization_expires?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_valid?: InputMaybe<Order_By>;
  proxy_holder_id?: InputMaybe<Order_By>;
  represented_member_id?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: proxy_votes */
export type Proxy_Votes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "proxy_votes" */
export enum Proxy_Votes_Select_Column {
  /** column name */
  AuthorizationDocument = 'authorization_document',
  /** column name */
  AuthorizationExpires = 'authorization_expires',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsValid = 'is_valid',
  /** column name */
  ProxyHolderId = 'proxy_holder_id',
  /** column name */
  RepresentedMemberId = 'represented_member_id',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "proxy_votes" */
export type Proxy_Votes_Set_Input = {
  authorization_document?: InputMaybe<Scalars['String']['input']>;
  authorization_expires?: InputMaybe<Scalars['timestamptz']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_valid?: InputMaybe<Scalars['Boolean']['input']>;
  proxy_holder_id?: InputMaybe<Scalars['uuid']['input']>;
  represented_member_id?: InputMaybe<Scalars['uuid']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "proxy_votes" */
export type Proxy_Votes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Proxy_Votes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Proxy_Votes_Stream_Cursor_Value_Input = {
  authorization_document?: InputMaybe<Scalars['String']['input']>;
  authorization_expires?: InputMaybe<Scalars['timestamptz']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_valid?: InputMaybe<Scalars['Boolean']['input']>;
  proxy_holder_id?: InputMaybe<Scalars['uuid']['input']>;
  represented_member_id?: InputMaybe<Scalars['uuid']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "proxy_votes" */
export enum Proxy_Votes_Update_Column {
  /** column name */
  AuthorizationDocument = 'authorization_document',
  /** column name */
  AuthorizationExpires = 'authorization_expires',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsValid = 'is_valid',
  /** column name */
  ProxyHolderId = 'proxy_holder_id',
  /** column name */
  RepresentedMemberId = 'represented_member_id',
  /** column name */
  VoteId = 'vote_id'
}

export type Proxy_Votes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Proxy_Votes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Proxy_Votes_Bool_Exp;
};

export type Query_Root = {
  /** fetch data from the table: "attachments" */
  attachments: Array<Attachments>;
  /** fetch aggregated fields from the table: "attachments" */
  attachments_aggregate: Attachments_Aggregate;
  /** fetch data from the table: "attachments" using primary key columns */
  attachments_by_pk?: Maybe<Attachments>;
  /** fetch data from the table: "audit_log" */
  audit_log: Array<Audit_Log>;
  /** fetch aggregated fields from the table: "audit_log" */
  audit_log_aggregate: Audit_Log_Aggregate;
  /** fetch data from the table: "audit_log" using primary key columns */
  audit_log_by_pk?: Maybe<Audit_Log>;
  /** fetch data from the table: "auth.providers" using primary key columns */
  authProvider?: Maybe<AuthProviders>;
  /** fetch data from the table: "auth.provider_requests" using primary key columns */
  authProviderRequest?: Maybe<AuthProviderRequests>;
  /** fetch data from the table: "auth.provider_requests" */
  authProviderRequests: Array<AuthProviderRequests>;
  /** fetch aggregated fields from the table: "auth.provider_requests" */
  authProviderRequestsAggregate: AuthProviderRequests_Aggregate;
  /** fetch data from the table: "auth.providers" */
  authProviders: Array<AuthProviders>;
  /** fetch aggregated fields from the table: "auth.providers" */
  authProvidersAggregate: AuthProviders_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  authRefreshToken?: Maybe<AuthRefreshTokens>;
  /** fetch data from the table: "auth.refresh_token_types" using primary key columns */
  authRefreshTokenType?: Maybe<AuthRefreshTokenTypes>;
  /** fetch data from the table: "auth.refresh_token_types" */
  authRefreshTokenTypes: Array<AuthRefreshTokenTypes>;
  /** fetch aggregated fields from the table: "auth.refresh_token_types" */
  authRefreshTokenTypesAggregate: AuthRefreshTokenTypes_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" */
  authRefreshTokens: Array<AuthRefreshTokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  authRefreshTokensAggregate: AuthRefreshTokens_Aggregate;
  /** fetch data from the table: "auth.roles" using primary key columns */
  authRole?: Maybe<AuthRoles>;
  /** fetch data from the table: "auth.roles" */
  authRoles: Array<AuthRoles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  authRolesAggregate: AuthRoles_Aggregate;
  /** fetch data from the table: "auth.user_providers" using primary key columns */
  authUserProvider?: Maybe<AuthUserProviders>;
  /** fetch data from the table: "auth.user_providers" */
  authUserProviders: Array<AuthUserProviders>;
  /** fetch aggregated fields from the table: "auth.user_providers" */
  authUserProvidersAggregate: AuthUserProviders_Aggregate;
  /** fetch data from the table: "auth.user_roles" using primary key columns */
  authUserRole?: Maybe<AuthUserRoles>;
  /** fetch data from the table: "auth.user_roles" */
  authUserRoles: Array<AuthUserRoles>;
  /** fetch aggregated fields from the table: "auth.user_roles" */
  authUserRolesAggregate: AuthUserRoles_Aggregate;
  /** fetch data from the table: "auth.user_security_keys" using primary key columns */
  authUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** fetch data from the table: "auth.user_security_keys" */
  authUserSecurityKeys: Array<AuthUserSecurityKeys>;
  /** fetch aggregated fields from the table: "auth.user_security_keys" */
  authUserSecurityKeysAggregate: AuthUserSecurityKeys_Aggregate;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** fetch data from the table: "building_variable_definitions" */
  building_variable_definitions: Array<Building_Variable_Definitions>;
  /** fetch aggregated fields from the table: "building_variable_definitions" */
  building_variable_definitions_aggregate: Building_Variable_Definitions_Aggregate;
  /** fetch data from the table: "building_variable_definitions" using primary key columns */
  building_variable_definitions_by_pk?: Maybe<Building_Variable_Definitions>;
  /** fetch data from the table: "building_variables" */
  building_variables: Array<Building_Variables>;
  /** fetch aggregated fields from the table: "building_variables" */
  building_variables_aggregate: Building_Variables_Aggregate;
  /** fetch data from the table: "building_variables" using primary key columns */
  building_variables_by_pk?: Maybe<Building_Variables>;
  /** fetch data from the table: "buildings" */
  buildings: Array<Buildings>;
  /** fetch aggregated fields from the table: "buildings" */
  buildings_aggregate: Buildings_Aggregate;
  /** fetch data from the table: "buildings" using primary key columns */
  buildings_by_pk?: Maybe<Buildings>;
  /** fetch data from the table: "document_templates" */
  document_templates: Array<Document_Templates>;
  /** fetch aggregated fields from the table: "document_templates" */
  document_templates_aggregate: Document_Templates_Aggregate;
  /** fetch data from the table: "document_templates" using primary key columns */
  document_templates_by_pk?: Maybe<Document_Templates>;
  /** fetch data from the table: "email_templates" */
  email_templates: Array<Email_Templates>;
  /** fetch aggregated fields from the table: "email_templates" */
  email_templates_aggregate: Email_Templates_Aggregate;
  /** fetch data from the table: "email_templates" using primary key columns */
  email_templates_by_pk?: Maybe<Email_Templates>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table: "global_variables" */
  global_variables: Array<Global_Variables>;
  /** fetch aggregated fields from the table: "global_variables" */
  global_variables_aggregate: Global_Variables_Aggregate;
  /** fetch data from the table: "global_variables" using primary key columns */
  global_variables_by_pk?: Maybe<Global_Variables>;
  /** fetch data from the table: "manual_vote_attachments" */
  manual_vote_attachments: Array<Manual_Vote_Attachments>;
  /** fetch aggregated fields from the table: "manual_vote_attachments" */
  manual_vote_attachments_aggregate: Manual_Vote_Attachments_Aggregate;
  /** fetch data from the table: "manual_vote_attachments" using primary key columns */
  manual_vote_attachments_by_pk?: Maybe<Manual_Vote_Attachments>;
  /** fetch data from the table: "manual_vote_notes" */
  manual_vote_notes: Array<Manual_Vote_Notes>;
  /** fetch aggregated fields from the table: "manual_vote_notes" */
  manual_vote_notes_aggregate: Manual_Vote_Notes_Aggregate;
  /** fetch data from the table: "manual_vote_notes" using primary key columns */
  manual_vote_notes_by_pk?: Maybe<Manual_Vote_Notes>;
  /** fetch data from the table: "member_votes" */
  member_votes: Array<Member_Votes>;
  /** fetch aggregated fields from the table: "member_votes" */
  member_votes_aggregate: Member_Votes_Aggregate;
  /** fetch data from the table: "member_votes" using primary key columns */
  member_votes_by_pk?: Maybe<Member_Votes>;
  /** fetch data from the table: "members" */
  members: Array<Members>;
  /** fetch aggregated fields from the table: "members" */
  members_aggregate: Members_Aggregate;
  /** fetch data from the table: "members" using primary key columns */
  members_by_pk?: Maybe<Members>;
  /** fetch data from the table: "notifications" */
  notifications: Array<Notifications>;
  /** fetch aggregated fields from the table: "notifications" */
  notifications_aggregate: Notifications_Aggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table: "observers" */
  observers: Array<Observers>;
  /** fetch aggregated fields from the table: "observers" */
  observers_aggregate: Observers_Aggregate;
  /** fetch data from the table: "observers" using primary key columns */
  observers_by_pk?: Maybe<Observers>;
  /** fetch data from the table: "proxy_votes" */
  proxy_votes: Array<Proxy_Votes>;
  /** fetch aggregated fields from the table: "proxy_votes" */
  proxy_votes_aggregate: Proxy_Votes_Aggregate;
  /** fetch data from the table: "proxy_votes" using primary key columns */
  proxy_votes_by_pk?: Maybe<Proxy_Votes>;
  /** fetch data from the table: "question_responses" */
  question_responses: Array<Question_Responses>;
  /** fetch aggregated fields from the table: "question_responses" */
  question_responses_aggregate: Question_Responses_Aggregate;
  /** fetch data from the table: "question_responses" using primary key columns */
  question_responses_by_pk?: Maybe<Question_Responses>;
  /** fetch data from the table: "questions" */
  questions: Array<Questions>;
  /** fetch aggregated fields from the table: "questions" */
  questions_aggregate: Questions_Aggregate;
  /** fetch data from the table: "questions" using primary key columns */
  questions_by_pk?: Maybe<Questions>;
  /** fetch data from the table: "reports" */
  reports: Array<Reports>;
  /** fetch aggregated fields from the table: "reports" */
  reports_aggregate: Reports_Aggregate;
  /** fetch data from the table: "reports" using primary key columns */
  reports_by_pk?: Maybe<Reports>;
  /** fetch data from the table: "sms_verifications" */
  sms_verifications: Array<Sms_Verifications>;
  /** fetch aggregated fields from the table: "sms_verifications" */
  sms_verifications_aggregate: Sms_Verifications_Aggregate;
  /** fetch data from the table: "sms_verifications" using primary key columns */
  sms_verifications_by_pk?: Maybe<Sms_Verifications>;
  /** fetch data from the table: "auth.users" using primary key columns */
  user?: Maybe<Users>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "auth.users" */
  usersAggregate: Users_Aggregate;
  /** fetch data from the table: "storage.virus" using primary key columns */
  virus?: Maybe<Virus>;
  /** fetch data from the table: "storage.virus" */
  viruses: Array<Virus>;
  /** fetch aggregated fields from the table: "storage.virus" */
  virusesAggregate: Virus_Aggregate;
  /** fetch data from the table: "vote_analytics" */
  vote_analytics: Array<Vote_Analytics>;
  /** fetch aggregated fields from the table: "vote_analytics" */
  vote_analytics_aggregate: Vote_Analytics_Aggregate;
  /** fetch data from the table: "vote_analytics" using primary key columns */
  vote_analytics_by_pk?: Maybe<Vote_Analytics>;
  /** fetch data from the table: "vote_delegations" */
  vote_delegations: Array<Vote_Delegations>;
  /** fetch aggregated fields from the table: "vote_delegations" */
  vote_delegations_aggregate: Vote_Delegations_Aggregate;
  /** fetch data from the table: "vote_delegations" using primary key columns */
  vote_delegations_by_pk?: Maybe<Vote_Delegations>;
  /** fetch data from the table: "votes" */
  votes: Array<Votes>;
  /** fetch aggregated fields from the table: "votes" */
  votes_aggregate: Votes_Aggregate;
  /** fetch data from the table: "votes" using primary key columns */
  votes_by_pk?: Maybe<Votes>;
  /** fetch data from the table: "voting_tokens" */
  voting_tokens: Array<Voting_Tokens>;
  /** fetch aggregated fields from the table: "voting_tokens" */
  voting_tokens_aggregate: Voting_Tokens_Aggregate;
  /** fetch data from the table: "voting_tokens" using primary key columns */
  voting_tokens_by_pk?: Maybe<Voting_Tokens>;
};


export type Query_RootAttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attachments_Order_By>>;
  where?: InputMaybe<Attachments_Bool_Exp>;
};


export type Query_RootAttachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attachments_Order_By>>;
  where?: InputMaybe<Attachments_Bool_Exp>;
};


export type Query_RootAttachments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAudit_LogArgs = {
  distinct_on?: InputMaybe<Array<Audit_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Log_Order_By>>;
  where?: InputMaybe<Audit_Log_Bool_Exp>;
};


export type Query_RootAudit_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Audit_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Log_Order_By>>;
  where?: InputMaybe<Audit_Log_Bool_Exp>;
};


export type Query_RootAudit_Log_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthProviderArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootAuthProviderRequestArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthProviderRequestsArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Query_RootAuthProviderRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Query_RootAuthProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Query_RootAuthProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Query_RootAuthRefreshTokenArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthRefreshTokenTypeArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootAuthRefreshTokenTypesArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokenTypes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokenTypes_Order_By>>;
  where?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
};


export type Query_RootAuthRefreshTokenTypesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokenTypes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokenTypes_Order_By>>;
  where?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
};


export type Query_RootAuthRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Query_RootAuthRefreshTokensAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Query_RootAuthRoleArgs = {
  role: Scalars['String']['input'];
};


export type Query_RootAuthRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Query_RootAuthRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Query_RootAuthUserProviderArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Query_RootAuthUserProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Query_RootAuthUserRoleArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Query_RootAuthUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Query_RootAuthUserSecurityKeyArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAuthUserSecurityKeysArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Query_RootAuthUserSecurityKeysAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Query_RootBucketArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Query_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Query_RootBuilding_Variable_DefinitionsArgs = {
  distinct_on?: InputMaybe<Array<Building_Variable_Definitions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variable_Definitions_Order_By>>;
  where?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
};


export type Query_RootBuilding_Variable_Definitions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Building_Variable_Definitions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variable_Definitions_Order_By>>;
  where?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
};


export type Query_RootBuilding_Variable_Definitions_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Query_RootBuilding_VariablesArgs = {
  distinct_on?: InputMaybe<Array<Building_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variables_Order_By>>;
  where?: InputMaybe<Building_Variables_Bool_Exp>;
};


export type Query_RootBuilding_Variables_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Building_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variables_Order_By>>;
  where?: InputMaybe<Building_Variables_Bool_Exp>;
};


export type Query_RootBuilding_Variables_By_PkArgs = {
  building_id: Scalars['uuid']['input'];
  name: Scalars['String']['input'];
};


export type Query_RootBuildingsArgs = {
  distinct_on?: InputMaybe<Array<Buildings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buildings_Order_By>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};


export type Query_RootBuildings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Buildings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buildings_Order_By>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};


export type Query_RootBuildings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootDocument_TemplatesArgs = {
  distinct_on?: InputMaybe<Array<Document_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Document_Templates_Order_By>>;
  where?: InputMaybe<Document_Templates_Bool_Exp>;
};


export type Query_RootDocument_Templates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Document_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Document_Templates_Order_By>>;
  where?: InputMaybe<Document_Templates_Bool_Exp>;
};


export type Query_RootDocument_Templates_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootEmail_TemplatesArgs = {
  distinct_on?: InputMaybe<Array<Email_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Templates_Order_By>>;
  where?: InputMaybe<Email_Templates_Bool_Exp>;
};


export type Query_RootEmail_Templates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Templates_Order_By>>;
  where?: InputMaybe<Email_Templates_Bool_Exp>;
};


export type Query_RootEmail_Templates_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFileArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Query_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Query_RootGlobal_VariablesArgs = {
  distinct_on?: InputMaybe<Array<Global_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Global_Variables_Order_By>>;
  where?: InputMaybe<Global_Variables_Bool_Exp>;
};


export type Query_RootGlobal_Variables_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Global_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Global_Variables_Order_By>>;
  where?: InputMaybe<Global_Variables_Bool_Exp>;
};


export type Query_RootGlobal_Variables_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Query_RootManual_Vote_AttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Attachments_Order_By>>;
  where?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
};


export type Query_RootManual_Vote_Attachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Attachments_Order_By>>;
  where?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
};


export type Query_RootManual_Vote_Attachments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootManual_Vote_NotesArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Notes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Notes_Order_By>>;
  where?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
};


export type Query_RootManual_Vote_Notes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Notes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Notes_Order_By>>;
  where?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
};


export type Query_RootManual_Vote_Notes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootMember_VotesArgs = {
  distinct_on?: InputMaybe<Array<Member_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Member_Votes_Order_By>>;
  where?: InputMaybe<Member_Votes_Bool_Exp>;
};


export type Query_RootMember_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Member_Votes_Order_By>>;
  where?: InputMaybe<Member_Votes_Bool_Exp>;
};


export type Query_RootMember_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootMembersArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};


export type Query_RootMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};


export type Query_RootMembers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};


export type Query_RootNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};


export type Query_RootNotifications_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootObserversArgs = {
  distinct_on?: InputMaybe<Array<Observers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Observers_Order_By>>;
  where?: InputMaybe<Observers_Bool_Exp>;
};


export type Query_RootObservers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Observers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Observers_Order_By>>;
  where?: InputMaybe<Observers_Bool_Exp>;
};


export type Query_RootObservers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootProxy_VotesArgs = {
  distinct_on?: InputMaybe<Array<Proxy_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proxy_Votes_Order_By>>;
  where?: InputMaybe<Proxy_Votes_Bool_Exp>;
};


export type Query_RootProxy_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Proxy_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proxy_Votes_Order_By>>;
  where?: InputMaybe<Proxy_Votes_Bool_Exp>;
};


export type Query_RootProxy_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootQuestion_ResponsesArgs = {
  distinct_on?: InputMaybe<Array<Question_Responses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Question_Responses_Order_By>>;
  where?: InputMaybe<Question_Responses_Bool_Exp>;
};


export type Query_RootQuestion_Responses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Question_Responses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Question_Responses_Order_By>>;
  where?: InputMaybe<Question_Responses_Bool_Exp>;
};


export type Query_RootQuestion_Responses_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootQuestionsArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Query_RootQuestions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Query_RootQuestions_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};


export type Query_RootReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};


export type Query_RootReports_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootSms_VerificationsArgs = {
  distinct_on?: InputMaybe<Array<Sms_Verifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Sms_Verifications_Order_By>>;
  where?: InputMaybe<Sms_Verifications_Bool_Exp>;
};


export type Query_RootSms_Verifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sms_Verifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Sms_Verifications_Order_By>>;
  where?: InputMaybe<Sms_Verifications_Bool_Exp>;
};


export type Query_RootSms_Verifications_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUserArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootVirusArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVirusesArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};


export type Query_RootVirusesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};


export type Query_RootVote_AnalyticsArgs = {
  distinct_on?: InputMaybe<Array<Vote_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Analytics_Order_By>>;
  where?: InputMaybe<Vote_Analytics_Bool_Exp>;
};


export type Query_RootVote_Analytics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vote_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Analytics_Order_By>>;
  where?: InputMaybe<Vote_Analytics_Bool_Exp>;
};


export type Query_RootVote_Analytics_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVote_DelegationsArgs = {
  distinct_on?: InputMaybe<Array<Vote_Delegations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Delegations_Order_By>>;
  where?: InputMaybe<Vote_Delegations_Bool_Exp>;
};


export type Query_RootVote_Delegations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vote_Delegations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Delegations_Order_By>>;
  where?: InputMaybe<Vote_Delegations_Bool_Exp>;
};


export type Query_RootVote_Delegations_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVotesArgs = {
  distinct_on?: InputMaybe<Array<Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Votes_Order_By>>;
  where?: InputMaybe<Votes_Bool_Exp>;
};


export type Query_RootVotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Votes_Order_By>>;
  where?: InputMaybe<Votes_Bool_Exp>;
};


export type Query_RootVotes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootVoting_TokensArgs = {
  distinct_on?: InputMaybe<Array<Voting_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Voting_Tokens_Order_By>>;
  where?: InputMaybe<Voting_Tokens_Bool_Exp>;
};


export type Query_RootVoting_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Voting_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Voting_Tokens_Order_By>>;
  where?: InputMaybe<Voting_Tokens_Bool_Exp>;
};


export type Query_RootVoting_Tokens_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "question_responses" */
export type Question_Responses = {
  comment?: Maybe<Scalars['String']['output']>;
  confidence_level?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  member_vote_id: Scalars['uuid']['output'];
  question_id: Scalars['uuid']['output'];
  response_data: Scalars['jsonb']['output'];
  response_type: Scalars['String']['output'];
};


/** columns and relationships of "question_responses" */
export type Question_ResponsesResponse_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "question_responses" */
export type Question_Responses_Aggregate = {
  aggregate?: Maybe<Question_Responses_Aggregate_Fields>;
  nodes: Array<Question_Responses>;
};

/** aggregate fields of "question_responses" */
export type Question_Responses_Aggregate_Fields = {
  avg?: Maybe<Question_Responses_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Question_Responses_Max_Fields>;
  min?: Maybe<Question_Responses_Min_Fields>;
  stddev?: Maybe<Question_Responses_Stddev_Fields>;
  stddev_pop?: Maybe<Question_Responses_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Question_Responses_Stddev_Samp_Fields>;
  sum?: Maybe<Question_Responses_Sum_Fields>;
  var_pop?: Maybe<Question_Responses_Var_Pop_Fields>;
  var_samp?: Maybe<Question_Responses_Var_Samp_Fields>;
  variance?: Maybe<Question_Responses_Variance_Fields>;
};


/** aggregate fields of "question_responses" */
export type Question_Responses_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Question_Responses_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Question_Responses_Append_Input = {
  response_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Question_Responses_Avg_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "question_responses". All fields are combined with a logical 'AND'. */
export type Question_Responses_Bool_Exp = {
  _and?: InputMaybe<Array<Question_Responses_Bool_Exp>>;
  _not?: InputMaybe<Question_Responses_Bool_Exp>;
  _or?: InputMaybe<Array<Question_Responses_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  confidence_level?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member_vote_id?: InputMaybe<Uuid_Comparison_Exp>;
  question_id?: InputMaybe<Uuid_Comparison_Exp>;
  response_data?: InputMaybe<Jsonb_Comparison_Exp>;
  response_type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "question_responses" */
export enum Question_Responses_Constraint {
  /** unique or primary key constraint on columns "id" */
  QuestionResponsesPkey = 'question_responses_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Question_Responses_Delete_At_Path_Input = {
  response_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Question_Responses_Delete_Elem_Input = {
  response_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Question_Responses_Delete_Key_Input = {
  response_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "question_responses" */
export type Question_Responses_Inc_Input = {
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "question_responses" */
export type Question_Responses_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_vote_id?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  response_data?: InputMaybe<Scalars['jsonb']['input']>;
  response_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Question_Responses_Max_Fields = {
  comment?: Maybe<Scalars['String']['output']>;
  confidence_level?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_vote_id?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
  response_type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Question_Responses_Min_Fields = {
  comment?: Maybe<Scalars['String']['output']>;
  confidence_level?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  member_vote_id?: Maybe<Scalars['uuid']['output']>;
  question_id?: Maybe<Scalars['uuid']['output']>;
  response_type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "question_responses" */
export type Question_Responses_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Question_Responses>;
};

/** on_conflict condition type for table "question_responses" */
export type Question_Responses_On_Conflict = {
  constraint: Question_Responses_Constraint;
  update_columns?: Array<Question_Responses_Update_Column>;
  where?: InputMaybe<Question_Responses_Bool_Exp>;
};

/** Ordering options when selecting data from "question_responses". */
export type Question_Responses_Order_By = {
  comment?: InputMaybe<Order_By>;
  confidence_level?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_vote_id?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  response_data?: InputMaybe<Order_By>;
  response_type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: question_responses */
export type Question_Responses_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Question_Responses_Prepend_Input = {
  response_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "question_responses" */
export enum Question_Responses_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  ConfidenceLevel = 'confidence_level',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MemberVoteId = 'member_vote_id',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  ResponseData = 'response_data',
  /** column name */
  ResponseType = 'response_type'
}

/** input type for updating data in table "question_responses" */
export type Question_Responses_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_vote_id?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  response_data?: InputMaybe<Scalars['jsonb']['input']>;
  response_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Question_Responses_Stddev_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Question_Responses_Stddev_Pop_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Question_Responses_Stddev_Samp_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "question_responses" */
export type Question_Responses_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Question_Responses_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Question_Responses_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  confidence_level?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  member_vote_id?: InputMaybe<Scalars['uuid']['input']>;
  question_id?: InputMaybe<Scalars['uuid']['input']>;
  response_data?: InputMaybe<Scalars['jsonb']['input']>;
  response_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Question_Responses_Sum_Fields = {
  confidence_level?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "question_responses" */
export enum Question_Responses_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  ConfidenceLevel = 'confidence_level',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MemberVoteId = 'member_vote_id',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  ResponseData = 'response_data',
  /** column name */
  ResponseType = 'response_type'
}

export type Question_Responses_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Question_Responses_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Question_Responses_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Question_Responses_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Question_Responses_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Question_Responses_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Question_Responses_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Question_Responses_Set_Input>;
  /** filter the rows which have to be updated */
  where: Question_Responses_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Question_Responses_Var_Pop_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Question_Responses_Var_Samp_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Question_Responses_Variance_Fields = {
  confidence_level?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "questions" */
export type Questions = {
  allow_multiple?: Maybe<Scalars['Boolean']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  custom_quorum_denominator?: Maybe<Scalars['Int']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Int']['output']>;
  id: Scalars['uuid']['output'];
  max_value?: Maybe<Scalars['numeric']['output']>;
  min_value?: Maybe<Scalars['numeric']['output']>;
  options?: Maybe<Scalars['jsonb']['output']>;
  order_index?: Maybe<Scalars['Int']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  quorum_type: Scalars['String']['output'];
  required?: Maybe<Scalars['Boolean']['output']>;
  results?: Maybe<Scalars['jsonb']['output']>;
  text: Scalars['String']['output'];
  vote_id: Scalars['uuid']['output'];
};


/** columns and relationships of "questions" */
export type QuestionsOptionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "questions" */
export type QuestionsResultsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "questions" */
export type Questions_Aggregate = {
  aggregate?: Maybe<Questions_Aggregate_Fields>;
  nodes: Array<Questions>;
};

/** aggregate fields of "questions" */
export type Questions_Aggregate_Fields = {
  avg?: Maybe<Questions_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Questions_Max_Fields>;
  min?: Maybe<Questions_Min_Fields>;
  stddev?: Maybe<Questions_Stddev_Fields>;
  stddev_pop?: Maybe<Questions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Questions_Stddev_Samp_Fields>;
  sum?: Maybe<Questions_Sum_Fields>;
  var_pop?: Maybe<Questions_Var_Pop_Fields>;
  var_samp?: Maybe<Questions_Var_Samp_Fields>;
  variance?: Maybe<Questions_Variance_Fields>;
};


/** aggregate fields of "questions" */
export type Questions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Questions_Append_Input = {
  options?: InputMaybe<Scalars['jsonb']['input']>;
  results?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Questions_Avg_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "questions". All fields are combined with a logical 'AND'. */
export type Questions_Bool_Exp = {
  _and?: InputMaybe<Array<Questions_Bool_Exp>>;
  _not?: InputMaybe<Questions_Bool_Exp>;
  _or?: InputMaybe<Array<Questions_Bool_Exp>>;
  allow_multiple?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  custom_quorum_denominator?: InputMaybe<Int_Comparison_Exp>;
  custom_quorum_numerator?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  max_value?: InputMaybe<Numeric_Comparison_Exp>;
  min_value?: InputMaybe<Numeric_Comparison_Exp>;
  options?: InputMaybe<Jsonb_Comparison_Exp>;
  order_index?: InputMaybe<Int_Comparison_Exp>;
  question_type?: InputMaybe<String_Comparison_Exp>;
  quorum_type?: InputMaybe<String_Comparison_Exp>;
  required?: InputMaybe<Boolean_Comparison_Exp>;
  results?: InputMaybe<Jsonb_Comparison_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "questions" */
export enum Questions_Constraint {
  /** unique or primary key constraint on columns "id" */
  QuestionsPkey = 'questions_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Questions_Delete_At_Path_Input = {
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  results?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Questions_Delete_Elem_Input = {
  options?: InputMaybe<Scalars['Int']['input']>;
  results?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Questions_Delete_Key_Input = {
  options?: InputMaybe<Scalars['String']['input']>;
  results?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "questions" */
export type Questions_Inc_Input = {
  custom_quorum_denominator?: InputMaybe<Scalars['Int']['input']>;
  custom_quorum_numerator?: InputMaybe<Scalars['Int']['input']>;
  max_value?: InputMaybe<Scalars['numeric']['input']>;
  min_value?: InputMaybe<Scalars['numeric']['input']>;
  order_index?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "questions" */
export type Questions_Insert_Input = {
  allow_multiple?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  custom_quorum_denominator?: InputMaybe<Scalars['Int']['input']>;
  custom_quorum_numerator?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  max_value?: InputMaybe<Scalars['numeric']['input']>;
  min_value?: InputMaybe<Scalars['numeric']['input']>;
  options?: InputMaybe<Scalars['jsonb']['input']>;
  order_index?: InputMaybe<Scalars['Int']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  quorum_type?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  results?: InputMaybe<Scalars['jsonb']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Questions_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  custom_quorum_denominator?: Maybe<Scalars['Int']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  max_value?: Maybe<Scalars['numeric']['output']>;
  min_value?: Maybe<Scalars['numeric']['output']>;
  order_index?: Maybe<Scalars['Int']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  quorum_type?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Questions_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  custom_quorum_denominator?: Maybe<Scalars['Int']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  max_value?: Maybe<Scalars['numeric']['output']>;
  min_value?: Maybe<Scalars['numeric']['output']>;
  order_index?: Maybe<Scalars['Int']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  quorum_type?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "questions" */
export type Questions_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Questions>;
};

/** on_conflict condition type for table "questions" */
export type Questions_On_Conflict = {
  constraint: Questions_Constraint;
  update_columns?: Array<Questions_Update_Column>;
  where?: InputMaybe<Questions_Bool_Exp>;
};

/** Ordering options when selecting data from "questions". */
export type Questions_Order_By = {
  allow_multiple?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  custom_quorum_denominator?: InputMaybe<Order_By>;
  custom_quorum_numerator?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  max_value?: InputMaybe<Order_By>;
  min_value?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  question_type?: InputMaybe<Order_By>;
  quorum_type?: InputMaybe<Order_By>;
  required?: InputMaybe<Order_By>;
  results?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: questions */
export type Questions_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Questions_Prepend_Input = {
  options?: InputMaybe<Scalars['jsonb']['input']>;
  results?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "questions" */
export enum Questions_Select_Column {
  /** column name */
  AllowMultiple = 'allow_multiple',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomQuorumDenominator = 'custom_quorum_denominator',
  /** column name */
  CustomQuorumNumerator = 'custom_quorum_numerator',
  /** column name */
  Id = 'id',
  /** column name */
  MaxValue = 'max_value',
  /** column name */
  MinValue = 'min_value',
  /** column name */
  Options = 'options',
  /** column name */
  OrderIndex = 'order_index',
  /** column name */
  QuestionType = 'question_type',
  /** column name */
  QuorumType = 'quorum_type',
  /** column name */
  Required = 'required',
  /** column name */
  Results = 'results',
  /** column name */
  Text = 'text',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "questions" */
export type Questions_Set_Input = {
  allow_multiple?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  custom_quorum_denominator?: InputMaybe<Scalars['Int']['input']>;
  custom_quorum_numerator?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  max_value?: InputMaybe<Scalars['numeric']['input']>;
  min_value?: InputMaybe<Scalars['numeric']['input']>;
  options?: InputMaybe<Scalars['jsonb']['input']>;
  order_index?: InputMaybe<Scalars['Int']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  quorum_type?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  results?: InputMaybe<Scalars['jsonb']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Questions_Stddev_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Questions_Stddev_Pop_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Questions_Stddev_Samp_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "questions" */
export type Questions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Questions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Questions_Stream_Cursor_Value_Input = {
  allow_multiple?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  custom_quorum_denominator?: InputMaybe<Scalars['Int']['input']>;
  custom_quorum_numerator?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  max_value?: InputMaybe<Scalars['numeric']['input']>;
  min_value?: InputMaybe<Scalars['numeric']['input']>;
  options?: InputMaybe<Scalars['jsonb']['input']>;
  order_index?: InputMaybe<Scalars['Int']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  quorum_type?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  results?: InputMaybe<Scalars['jsonb']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Questions_Sum_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Int']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Int']['output']>;
  max_value?: Maybe<Scalars['numeric']['output']>;
  min_value?: Maybe<Scalars['numeric']['output']>;
  order_index?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "questions" */
export enum Questions_Update_Column {
  /** column name */
  AllowMultiple = 'allow_multiple',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomQuorumDenominator = 'custom_quorum_denominator',
  /** column name */
  CustomQuorumNumerator = 'custom_quorum_numerator',
  /** column name */
  Id = 'id',
  /** column name */
  MaxValue = 'max_value',
  /** column name */
  MinValue = 'min_value',
  /** column name */
  Options = 'options',
  /** column name */
  OrderIndex = 'order_index',
  /** column name */
  QuestionType = 'question_type',
  /** column name */
  QuorumType = 'quorum_type',
  /** column name */
  Required = 'required',
  /** column name */
  Results = 'results',
  /** column name */
  Text = 'text',
  /** column name */
  VoteId = 'vote_id'
}

export type Questions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Questions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Questions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Questions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Questions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Questions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Questions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Questions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Questions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Questions_Var_Pop_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Questions_Var_Samp_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Questions_Variance_Fields = {
  custom_quorum_denominator?: Maybe<Scalars['Float']['output']>;
  custom_quorum_numerator?: Maybe<Scalars['Float']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  order_index?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "reports" */
export type Reports = {
  access_level?: Maybe<Scalars['String']['output']>;
  building_id: Scalars['uuid']['output'];
  contains_personal_data?: Maybe<Scalars['Boolean']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  file_path?: Maybe<Scalars['String']['output']>;
  file_size?: Maybe<Scalars['Int']['output']>;
  format: Scalars['String']['output'];
  generated_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  is_official?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  report_type: Scalars['String']['output'];
  vote_id: Scalars['uuid']['output'];
};


/** columns and relationships of "reports" */
export type ReportsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "reports" */
export type Reports_Aggregate = {
  aggregate?: Maybe<Reports_Aggregate_Fields>;
  nodes: Array<Reports>;
};

/** aggregate fields of "reports" */
export type Reports_Aggregate_Fields = {
  avg?: Maybe<Reports_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Reports_Max_Fields>;
  min?: Maybe<Reports_Min_Fields>;
  stddev?: Maybe<Reports_Stddev_Fields>;
  stddev_pop?: Maybe<Reports_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Reports_Stddev_Samp_Fields>;
  sum?: Maybe<Reports_Sum_Fields>;
  var_pop?: Maybe<Reports_Var_Pop_Fields>;
  var_samp?: Maybe<Reports_Var_Samp_Fields>;
  variance?: Maybe<Reports_Variance_Fields>;
};


/** aggregate fields of "reports" */
export type Reports_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Reports_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Reports_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Reports_Avg_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "reports". All fields are combined with a logical 'AND'. */
export type Reports_Bool_Exp = {
  _and?: InputMaybe<Array<Reports_Bool_Exp>>;
  _not?: InputMaybe<Reports_Bool_Exp>;
  _or?: InputMaybe<Array<Reports_Bool_Exp>>;
  access_level?: InputMaybe<String_Comparison_Exp>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  contains_personal_data?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  file_path?: InputMaybe<String_Comparison_Exp>;
  file_size?: InputMaybe<Int_Comparison_Exp>;
  format?: InputMaybe<String_Comparison_Exp>;
  generated_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_official?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  report_type?: InputMaybe<String_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "reports" */
export enum Reports_Constraint {
  /** unique or primary key constraint on columns "id" */
  ReportsPkey = 'reports_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Reports_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Reports_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Reports_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "reports" */
export type Reports_Inc_Input = {
  file_size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "reports" */
export type Reports_Insert_Input = {
  access_level?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  contains_personal_data?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  file_path?: InputMaybe<Scalars['String']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  generated_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_official?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  report_type?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Reports_Max_Fields = {
  access_level?: Maybe<Scalars['String']['output']>;
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  file_path?: Maybe<Scalars['String']['output']>;
  file_size?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  generated_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  report_type?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Reports_Min_Fields = {
  access_level?: Maybe<Scalars['String']['output']>;
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  file_path?: Maybe<Scalars['String']['output']>;
  file_size?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  generated_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  report_type?: Maybe<Scalars['String']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "reports" */
export type Reports_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Reports>;
};

/** on_conflict condition type for table "reports" */
export type Reports_On_Conflict = {
  constraint: Reports_Constraint;
  update_columns?: Array<Reports_Update_Column>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** Ordering options when selecting data from "reports". */
export type Reports_Order_By = {
  access_level?: InputMaybe<Order_By>;
  building_id?: InputMaybe<Order_By>;
  contains_personal_data?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  file_path?: InputMaybe<Order_By>;
  file_size?: InputMaybe<Order_By>;
  format?: InputMaybe<Order_By>;
  generated_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_official?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  report_type?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: reports */
export type Reports_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Reports_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "reports" */
export enum Reports_Select_Column {
  /** column name */
  AccessLevel = 'access_level',
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  ContainsPersonalData = 'contains_personal_data',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  FilePath = 'file_path',
  /** column name */
  FileSize = 'file_size',
  /** column name */
  Format = 'format',
  /** column name */
  GeneratedBy = 'generated_by',
  /** column name */
  Id = 'id',
  /** column name */
  IsOfficial = 'is_official',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  ReportType = 'report_type',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "reports" */
export type Reports_Set_Input = {
  access_level?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  contains_personal_data?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  file_path?: InputMaybe<Scalars['String']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  generated_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_official?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  report_type?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Reports_Stddev_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Reports_Stddev_Pop_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Reports_Stddev_Samp_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "reports" */
export type Reports_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Reports_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Reports_Stream_Cursor_Value_Input = {
  access_level?: InputMaybe<Scalars['String']['input']>;
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  contains_personal_data?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  file_path?: InputMaybe<Scalars['String']['input']>;
  file_size?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  generated_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_official?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  report_type?: InputMaybe<Scalars['String']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Reports_Sum_Fields = {
  file_size?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "reports" */
export enum Reports_Update_Column {
  /** column name */
  AccessLevel = 'access_level',
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  ContainsPersonalData = 'contains_personal_data',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  FilePath = 'file_path',
  /** column name */
  FileSize = 'file_size',
  /** column name */
  Format = 'format',
  /** column name */
  GeneratedBy = 'generated_by',
  /** column name */
  Id = 'id',
  /** column name */
  IsOfficial = 'is_official',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  ReportType = 'report_type',
  /** column name */
  VoteId = 'vote_id'
}

export type Reports_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Reports_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Reports_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Reports_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Reports_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Reports_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Reports_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Reports_Set_Input>;
  /** filter the rows which have to be updated */
  where: Reports_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Reports_Var_Pop_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Reports_Var_Samp_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Reports_Variance_Fields = {
  file_size?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "sms_verifications" */
export type Sms_Verifications = {
  attempts?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  ip_address?: Maybe<Scalars['inet']['output']>;
  is_used?: Maybe<Scalars['Boolean']['output']>;
  is_verified?: Maybe<Scalars['Boolean']['output']>;
  max_attempts?: Maybe<Scalars['Int']['output']>;
  member_id: Scalars['uuid']['output'];
  phone_number: Scalars['String']['output'];
  token_hash: Scalars['String']['output'];
  used_at?: Maybe<Scalars['timestamptz']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  verification_code: Scalars['String']['output'];
  verified_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_id: Scalars['uuid']['output'];
};

/** aggregated selection of "sms_verifications" */
export type Sms_Verifications_Aggregate = {
  aggregate?: Maybe<Sms_Verifications_Aggregate_Fields>;
  nodes: Array<Sms_Verifications>;
};

/** aggregate fields of "sms_verifications" */
export type Sms_Verifications_Aggregate_Fields = {
  avg?: Maybe<Sms_Verifications_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Sms_Verifications_Max_Fields>;
  min?: Maybe<Sms_Verifications_Min_Fields>;
  stddev?: Maybe<Sms_Verifications_Stddev_Fields>;
  stddev_pop?: Maybe<Sms_Verifications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Sms_Verifications_Stddev_Samp_Fields>;
  sum?: Maybe<Sms_Verifications_Sum_Fields>;
  var_pop?: Maybe<Sms_Verifications_Var_Pop_Fields>;
  var_samp?: Maybe<Sms_Verifications_Var_Samp_Fields>;
  variance?: Maybe<Sms_Verifications_Variance_Fields>;
};


/** aggregate fields of "sms_verifications" */
export type Sms_Verifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sms_Verifications_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Sms_Verifications_Avg_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "sms_verifications". All fields are combined with a logical 'AND'. */
export type Sms_Verifications_Bool_Exp = {
  _and?: InputMaybe<Array<Sms_Verifications_Bool_Exp>>;
  _not?: InputMaybe<Sms_Verifications_Bool_Exp>;
  _or?: InputMaybe<Array<Sms_Verifications_Bool_Exp>>;
  attempts?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ip_address?: InputMaybe<Inet_Comparison_Exp>;
  is_used?: InputMaybe<Boolean_Comparison_Exp>;
  is_verified?: InputMaybe<Boolean_Comparison_Exp>;
  max_attempts?: InputMaybe<Int_Comparison_Exp>;
  member_id?: InputMaybe<Uuid_Comparison_Exp>;
  phone_number?: InputMaybe<String_Comparison_Exp>;
  token_hash?: InputMaybe<String_Comparison_Exp>;
  used_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_agent?: InputMaybe<String_Comparison_Exp>;
  verification_code?: InputMaybe<String_Comparison_Exp>;
  verified_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "sms_verifications" */
export enum Sms_Verifications_Constraint {
  /** unique or primary key constraint on columns "id" */
  SmsVerificationsPkey = 'sms_verifications_pkey',
  /** unique or primary key constraint on columns "member_id", "vote_id" */
  SmsVerificationsVoteIdMemberIdKey = 'sms_verifications_vote_id_member_id_key'
}

/** input type for incrementing numeric columns in table "sms_verifications" */
export type Sms_Verifications_Inc_Input = {
  attempts?: InputMaybe<Scalars['Int']['input']>;
  max_attempts?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "sms_verifications" */
export type Sms_Verifications_Insert_Input = {
  attempts?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_used?: InputMaybe<Scalars['Boolean']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  max_attempts?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  token_hash?: InputMaybe<Scalars['String']['input']>;
  used_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  verification_code?: InputMaybe<Scalars['String']['input']>;
  verified_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Sms_Verifications_Max_Fields = {
  attempts?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  max_attempts?: Maybe<Scalars['Int']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
  token_hash?: Maybe<Scalars['String']['output']>;
  used_at?: Maybe<Scalars['timestamptz']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  verification_code?: Maybe<Scalars['String']['output']>;
  verified_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Sms_Verifications_Min_Fields = {
  attempts?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  max_attempts?: Maybe<Scalars['Int']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
  token_hash?: Maybe<Scalars['String']['output']>;
  used_at?: Maybe<Scalars['timestamptz']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  verification_code?: Maybe<Scalars['String']['output']>;
  verified_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "sms_verifications" */
export type Sms_Verifications_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Sms_Verifications>;
};

/** on_conflict condition type for table "sms_verifications" */
export type Sms_Verifications_On_Conflict = {
  constraint: Sms_Verifications_Constraint;
  update_columns?: Array<Sms_Verifications_Update_Column>;
  where?: InputMaybe<Sms_Verifications_Bool_Exp>;
};

/** Ordering options when selecting data from "sms_verifications". */
export type Sms_Verifications_Order_By = {
  attempts?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ip_address?: InputMaybe<Order_By>;
  is_used?: InputMaybe<Order_By>;
  is_verified?: InputMaybe<Order_By>;
  max_attempts?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  token_hash?: InputMaybe<Order_By>;
  used_at?: InputMaybe<Order_By>;
  user_agent?: InputMaybe<Order_By>;
  verification_code?: InputMaybe<Order_By>;
  verified_at?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sms_verifications */
export type Sms_Verifications_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "sms_verifications" */
export enum Sms_Verifications_Select_Column {
  /** column name */
  Attempts = 'attempts',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  IsUsed = 'is_used',
  /** column name */
  IsVerified = 'is_verified',
  /** column name */
  MaxAttempts = 'max_attempts',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  TokenHash = 'token_hash',
  /** column name */
  UsedAt = 'used_at',
  /** column name */
  UserAgent = 'user_agent',
  /** column name */
  VerificationCode = 'verification_code',
  /** column name */
  VerifiedAt = 'verified_at',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "sms_verifications" */
export type Sms_Verifications_Set_Input = {
  attempts?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_used?: InputMaybe<Scalars['Boolean']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  max_attempts?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  token_hash?: InputMaybe<Scalars['String']['input']>;
  used_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  verification_code?: InputMaybe<Scalars['String']['input']>;
  verified_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Sms_Verifications_Stddev_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Sms_Verifications_Stddev_Pop_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Sms_Verifications_Stddev_Samp_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "sms_verifications" */
export type Sms_Verifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sms_Verifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sms_Verifications_Stream_Cursor_Value_Input = {
  attempts?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_used?: InputMaybe<Scalars['Boolean']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  max_attempts?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  token_hash?: InputMaybe<Scalars['String']['input']>;
  used_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  verification_code?: InputMaybe<Scalars['String']['input']>;
  verified_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Sms_Verifications_Sum_Fields = {
  attempts?: Maybe<Scalars['Int']['output']>;
  max_attempts?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "sms_verifications" */
export enum Sms_Verifications_Update_Column {
  /** column name */
  Attempts = 'attempts',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  IsUsed = 'is_used',
  /** column name */
  IsVerified = 'is_verified',
  /** column name */
  MaxAttempts = 'max_attempts',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  TokenHash = 'token_hash',
  /** column name */
  UsedAt = 'used_at',
  /** column name */
  UserAgent = 'user_agent',
  /** column name */
  VerificationCode = 'verification_code',
  /** column name */
  VerifiedAt = 'verified_at',
  /** column name */
  VoteId = 'vote_id'
}

export type Sms_Verifications_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Sms_Verifications_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sms_Verifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sms_Verifications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Sms_Verifications_Var_Pop_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Sms_Verifications_Var_Samp_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Sms_Verifications_Variance_Fields = {
  attempts?: Maybe<Scalars['Float']['output']>;
  max_attempts?: Maybe<Scalars['Float']['output']>;
};

export type Subscription_Root = {
  /** fetch data from the table: "attachments" */
  attachments: Array<Attachments>;
  /** fetch aggregated fields from the table: "attachments" */
  attachments_aggregate: Attachments_Aggregate;
  /** fetch data from the table: "attachments" using primary key columns */
  attachments_by_pk?: Maybe<Attachments>;
  /** fetch data from the table in a streaming manner: "attachments" */
  attachments_stream: Array<Attachments>;
  /** fetch data from the table: "audit_log" */
  audit_log: Array<Audit_Log>;
  /** fetch aggregated fields from the table: "audit_log" */
  audit_log_aggregate: Audit_Log_Aggregate;
  /** fetch data from the table: "audit_log" using primary key columns */
  audit_log_by_pk?: Maybe<Audit_Log>;
  /** fetch data from the table in a streaming manner: "audit_log" */
  audit_log_stream: Array<Audit_Log>;
  /** fetch data from the table: "auth.providers" using primary key columns */
  authProvider?: Maybe<AuthProviders>;
  /** fetch data from the table: "auth.provider_requests" using primary key columns */
  authProviderRequest?: Maybe<AuthProviderRequests>;
  /** fetch data from the table: "auth.provider_requests" */
  authProviderRequests: Array<AuthProviderRequests>;
  /** fetch aggregated fields from the table: "auth.provider_requests" */
  authProviderRequestsAggregate: AuthProviderRequests_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.provider_requests" */
  authProviderRequests_stream: Array<AuthProviderRequests>;
  /** fetch data from the table: "auth.providers" */
  authProviders: Array<AuthProviders>;
  /** fetch aggregated fields from the table: "auth.providers" */
  authProvidersAggregate: AuthProviders_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.providers" */
  authProviders_stream: Array<AuthProviders>;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  authRefreshToken?: Maybe<AuthRefreshTokens>;
  /** fetch data from the table: "auth.refresh_token_types" using primary key columns */
  authRefreshTokenType?: Maybe<AuthRefreshTokenTypes>;
  /** fetch data from the table: "auth.refresh_token_types" */
  authRefreshTokenTypes: Array<AuthRefreshTokenTypes>;
  /** fetch aggregated fields from the table: "auth.refresh_token_types" */
  authRefreshTokenTypesAggregate: AuthRefreshTokenTypes_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.refresh_token_types" */
  authRefreshTokenTypes_stream: Array<AuthRefreshTokenTypes>;
  /** fetch data from the table: "auth.refresh_tokens" */
  authRefreshTokens: Array<AuthRefreshTokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  authRefreshTokensAggregate: AuthRefreshTokens_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.refresh_tokens" */
  authRefreshTokens_stream: Array<AuthRefreshTokens>;
  /** fetch data from the table: "auth.roles" using primary key columns */
  authRole?: Maybe<AuthRoles>;
  /** fetch data from the table: "auth.roles" */
  authRoles: Array<AuthRoles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  authRolesAggregate: AuthRoles_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.roles" */
  authRoles_stream: Array<AuthRoles>;
  /** fetch data from the table: "auth.user_providers" using primary key columns */
  authUserProvider?: Maybe<AuthUserProviders>;
  /** fetch data from the table: "auth.user_providers" */
  authUserProviders: Array<AuthUserProviders>;
  /** fetch aggregated fields from the table: "auth.user_providers" */
  authUserProvidersAggregate: AuthUserProviders_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.user_providers" */
  authUserProviders_stream: Array<AuthUserProviders>;
  /** fetch data from the table: "auth.user_roles" using primary key columns */
  authUserRole?: Maybe<AuthUserRoles>;
  /** fetch data from the table: "auth.user_roles" */
  authUserRoles: Array<AuthUserRoles>;
  /** fetch aggregated fields from the table: "auth.user_roles" */
  authUserRolesAggregate: AuthUserRoles_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.user_roles" */
  authUserRoles_stream: Array<AuthUserRoles>;
  /** fetch data from the table: "auth.user_security_keys" using primary key columns */
  authUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** fetch data from the table: "auth.user_security_keys" */
  authUserSecurityKeys: Array<AuthUserSecurityKeys>;
  /** fetch aggregated fields from the table: "auth.user_security_keys" */
  authUserSecurityKeysAggregate: AuthUserSecurityKeys_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.user_security_keys" */
  authUserSecurityKeys_stream: Array<AuthUserSecurityKeys>;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.buckets" */
  buckets_stream: Array<Buckets>;
  /** fetch data from the table: "building_variable_definitions" */
  building_variable_definitions: Array<Building_Variable_Definitions>;
  /** fetch aggregated fields from the table: "building_variable_definitions" */
  building_variable_definitions_aggregate: Building_Variable_Definitions_Aggregate;
  /** fetch data from the table: "building_variable_definitions" using primary key columns */
  building_variable_definitions_by_pk?: Maybe<Building_Variable_Definitions>;
  /** fetch data from the table in a streaming manner: "building_variable_definitions" */
  building_variable_definitions_stream: Array<Building_Variable_Definitions>;
  /** fetch data from the table: "building_variables" */
  building_variables: Array<Building_Variables>;
  /** fetch aggregated fields from the table: "building_variables" */
  building_variables_aggregate: Building_Variables_Aggregate;
  /** fetch data from the table: "building_variables" using primary key columns */
  building_variables_by_pk?: Maybe<Building_Variables>;
  /** fetch data from the table in a streaming manner: "building_variables" */
  building_variables_stream: Array<Building_Variables>;
  /** fetch data from the table: "buildings" */
  buildings: Array<Buildings>;
  /** fetch aggregated fields from the table: "buildings" */
  buildings_aggregate: Buildings_Aggregate;
  /** fetch data from the table: "buildings" using primary key columns */
  buildings_by_pk?: Maybe<Buildings>;
  /** fetch data from the table in a streaming manner: "buildings" */
  buildings_stream: Array<Buildings>;
  /** fetch data from the table: "document_templates" */
  document_templates: Array<Document_Templates>;
  /** fetch aggregated fields from the table: "document_templates" */
  document_templates_aggregate: Document_Templates_Aggregate;
  /** fetch data from the table: "document_templates" using primary key columns */
  document_templates_by_pk?: Maybe<Document_Templates>;
  /** fetch data from the table in a streaming manner: "document_templates" */
  document_templates_stream: Array<Document_Templates>;
  /** fetch data from the table: "email_templates" */
  email_templates: Array<Email_Templates>;
  /** fetch aggregated fields from the table: "email_templates" */
  email_templates_aggregate: Email_Templates_Aggregate;
  /** fetch data from the table: "email_templates" using primary key columns */
  email_templates_by_pk?: Maybe<Email_Templates>;
  /** fetch data from the table in a streaming manner: "email_templates" */
  email_templates_stream: Array<Email_Templates>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.files" */
  files_stream: Array<Files>;
  /** fetch data from the table: "global_variables" */
  global_variables: Array<Global_Variables>;
  /** fetch aggregated fields from the table: "global_variables" */
  global_variables_aggregate: Global_Variables_Aggregate;
  /** fetch data from the table: "global_variables" using primary key columns */
  global_variables_by_pk?: Maybe<Global_Variables>;
  /** fetch data from the table in a streaming manner: "global_variables" */
  global_variables_stream: Array<Global_Variables>;
  /** fetch data from the table: "manual_vote_attachments" */
  manual_vote_attachments: Array<Manual_Vote_Attachments>;
  /** fetch aggregated fields from the table: "manual_vote_attachments" */
  manual_vote_attachments_aggregate: Manual_Vote_Attachments_Aggregate;
  /** fetch data from the table: "manual_vote_attachments" using primary key columns */
  manual_vote_attachments_by_pk?: Maybe<Manual_Vote_Attachments>;
  /** fetch data from the table in a streaming manner: "manual_vote_attachments" */
  manual_vote_attachments_stream: Array<Manual_Vote_Attachments>;
  /** fetch data from the table: "manual_vote_notes" */
  manual_vote_notes: Array<Manual_Vote_Notes>;
  /** fetch aggregated fields from the table: "manual_vote_notes" */
  manual_vote_notes_aggregate: Manual_Vote_Notes_Aggregate;
  /** fetch data from the table: "manual_vote_notes" using primary key columns */
  manual_vote_notes_by_pk?: Maybe<Manual_Vote_Notes>;
  /** fetch data from the table in a streaming manner: "manual_vote_notes" */
  manual_vote_notes_stream: Array<Manual_Vote_Notes>;
  /** fetch data from the table: "member_votes" */
  member_votes: Array<Member_Votes>;
  /** fetch aggregated fields from the table: "member_votes" */
  member_votes_aggregate: Member_Votes_Aggregate;
  /** fetch data from the table: "member_votes" using primary key columns */
  member_votes_by_pk?: Maybe<Member_Votes>;
  /** fetch data from the table in a streaming manner: "member_votes" */
  member_votes_stream: Array<Member_Votes>;
  /** fetch data from the table: "members" */
  members: Array<Members>;
  /** fetch aggregated fields from the table: "members" */
  members_aggregate: Members_Aggregate;
  /** fetch data from the table: "members" using primary key columns */
  members_by_pk?: Maybe<Members>;
  /** fetch data from the table in a streaming manner: "members" */
  members_stream: Array<Members>;
  /** fetch data from the table: "notifications" */
  notifications: Array<Notifications>;
  /** fetch aggregated fields from the table: "notifications" */
  notifications_aggregate: Notifications_Aggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table in a streaming manner: "notifications" */
  notifications_stream: Array<Notifications>;
  /** fetch data from the table: "observers" */
  observers: Array<Observers>;
  /** fetch aggregated fields from the table: "observers" */
  observers_aggregate: Observers_Aggregate;
  /** fetch data from the table: "observers" using primary key columns */
  observers_by_pk?: Maybe<Observers>;
  /** fetch data from the table in a streaming manner: "observers" */
  observers_stream: Array<Observers>;
  /** fetch data from the table: "proxy_votes" */
  proxy_votes: Array<Proxy_Votes>;
  /** fetch aggregated fields from the table: "proxy_votes" */
  proxy_votes_aggregate: Proxy_Votes_Aggregate;
  /** fetch data from the table: "proxy_votes" using primary key columns */
  proxy_votes_by_pk?: Maybe<Proxy_Votes>;
  /** fetch data from the table in a streaming manner: "proxy_votes" */
  proxy_votes_stream: Array<Proxy_Votes>;
  /** fetch data from the table: "question_responses" */
  question_responses: Array<Question_Responses>;
  /** fetch aggregated fields from the table: "question_responses" */
  question_responses_aggregate: Question_Responses_Aggregate;
  /** fetch data from the table: "question_responses" using primary key columns */
  question_responses_by_pk?: Maybe<Question_Responses>;
  /** fetch data from the table in a streaming manner: "question_responses" */
  question_responses_stream: Array<Question_Responses>;
  /** fetch data from the table: "questions" */
  questions: Array<Questions>;
  /** fetch aggregated fields from the table: "questions" */
  questions_aggregate: Questions_Aggregate;
  /** fetch data from the table: "questions" using primary key columns */
  questions_by_pk?: Maybe<Questions>;
  /** fetch data from the table in a streaming manner: "questions" */
  questions_stream: Array<Questions>;
  /** fetch data from the table: "reports" */
  reports: Array<Reports>;
  /** fetch aggregated fields from the table: "reports" */
  reports_aggregate: Reports_Aggregate;
  /** fetch data from the table: "reports" using primary key columns */
  reports_by_pk?: Maybe<Reports>;
  /** fetch data from the table in a streaming manner: "reports" */
  reports_stream: Array<Reports>;
  /** fetch data from the table: "sms_verifications" */
  sms_verifications: Array<Sms_Verifications>;
  /** fetch aggregated fields from the table: "sms_verifications" */
  sms_verifications_aggregate: Sms_Verifications_Aggregate;
  /** fetch data from the table: "sms_verifications" using primary key columns */
  sms_verifications_by_pk?: Maybe<Sms_Verifications>;
  /** fetch data from the table in a streaming manner: "sms_verifications" */
  sms_verifications_stream: Array<Sms_Verifications>;
  /** fetch data from the table: "auth.users" using primary key columns */
  user?: Maybe<Users>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "auth.users" */
  usersAggregate: Users_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "storage.virus" using primary key columns */
  virus?: Maybe<Virus>;
  /** fetch data from the table in a streaming manner: "storage.virus" */
  virus_stream: Array<Virus>;
  /** fetch data from the table: "storage.virus" */
  viruses: Array<Virus>;
  /** fetch aggregated fields from the table: "storage.virus" */
  virusesAggregate: Virus_Aggregate;
  /** fetch data from the table: "vote_analytics" */
  vote_analytics: Array<Vote_Analytics>;
  /** fetch aggregated fields from the table: "vote_analytics" */
  vote_analytics_aggregate: Vote_Analytics_Aggregate;
  /** fetch data from the table: "vote_analytics" using primary key columns */
  vote_analytics_by_pk?: Maybe<Vote_Analytics>;
  /** fetch data from the table in a streaming manner: "vote_analytics" */
  vote_analytics_stream: Array<Vote_Analytics>;
  /** fetch data from the table: "vote_delegations" */
  vote_delegations: Array<Vote_Delegations>;
  /** fetch aggregated fields from the table: "vote_delegations" */
  vote_delegations_aggregate: Vote_Delegations_Aggregate;
  /** fetch data from the table: "vote_delegations" using primary key columns */
  vote_delegations_by_pk?: Maybe<Vote_Delegations>;
  /** fetch data from the table in a streaming manner: "vote_delegations" */
  vote_delegations_stream: Array<Vote_Delegations>;
  /** fetch data from the table: "votes" */
  votes: Array<Votes>;
  /** fetch aggregated fields from the table: "votes" */
  votes_aggregate: Votes_Aggregate;
  /** fetch data from the table: "votes" using primary key columns */
  votes_by_pk?: Maybe<Votes>;
  /** fetch data from the table in a streaming manner: "votes" */
  votes_stream: Array<Votes>;
  /** fetch data from the table: "voting_tokens" */
  voting_tokens: Array<Voting_Tokens>;
  /** fetch aggregated fields from the table: "voting_tokens" */
  voting_tokens_aggregate: Voting_Tokens_Aggregate;
  /** fetch data from the table: "voting_tokens" using primary key columns */
  voting_tokens_by_pk?: Maybe<Voting_Tokens>;
  /** fetch data from the table in a streaming manner: "voting_tokens" */
  voting_tokens_stream: Array<Voting_Tokens>;
};


export type Subscription_RootAttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attachments_Order_By>>;
  where?: InputMaybe<Attachments_Bool_Exp>;
};


export type Subscription_RootAttachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Attachments_Order_By>>;
  where?: InputMaybe<Attachments_Bool_Exp>;
};


export type Subscription_RootAttachments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAttachments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Attachments_Stream_Cursor_Input>>;
  where?: InputMaybe<Attachments_Bool_Exp>;
};


export type Subscription_RootAudit_LogArgs = {
  distinct_on?: InputMaybe<Array<Audit_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Log_Order_By>>;
  where?: InputMaybe<Audit_Log_Bool_Exp>;
};


export type Subscription_RootAudit_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Audit_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Log_Order_By>>;
  where?: InputMaybe<Audit_Log_Bool_Exp>;
};


export type Subscription_RootAudit_Log_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAudit_Log_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Audit_Log_Stream_Cursor_Input>>;
  where?: InputMaybe<Audit_Log_Bool_Exp>;
};


export type Subscription_RootAuthProviderArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootAuthProviderRequestArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuthProviderRequestsArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProviderRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProviderRequests_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthProviderRequests_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthProviders_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthProviders_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokenArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuthRefreshTokenTypeArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootAuthRefreshTokenTypesArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokenTypes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokenTypes_Order_By>>;
  where?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokenTypesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokenTypes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokenTypes_Order_By>>;
  where?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokenTypes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthRefreshTokenTypes_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthRefreshTokenTypes_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokensAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokens_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthRefreshTokens_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRoleArgs = {
  role: Scalars['String']['input'];
};


export type Subscription_RootAuthRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthRoles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthRoles_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserProviderArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuthUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserProviders_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthUserProviders_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserRoleArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuthUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserRoles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthUserRoles_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserSecurityKeyArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAuthUserSecurityKeysArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Subscription_RootAuthUserSecurityKeysAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Subscription_RootAuthUserSecurityKeys_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AuthUserSecurityKeys_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Subscription_RootBucketArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Subscription_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Subscription_RootBuckets_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Buckets_Stream_Cursor_Input>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Subscription_RootBuilding_Variable_DefinitionsArgs = {
  distinct_on?: InputMaybe<Array<Building_Variable_Definitions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variable_Definitions_Order_By>>;
  where?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
};


export type Subscription_RootBuilding_Variable_Definitions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Building_Variable_Definitions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variable_Definitions_Order_By>>;
  where?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
};


export type Subscription_RootBuilding_Variable_Definitions_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Subscription_RootBuilding_Variable_Definitions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Building_Variable_Definitions_Stream_Cursor_Input>>;
  where?: InputMaybe<Building_Variable_Definitions_Bool_Exp>;
};


export type Subscription_RootBuilding_VariablesArgs = {
  distinct_on?: InputMaybe<Array<Building_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variables_Order_By>>;
  where?: InputMaybe<Building_Variables_Bool_Exp>;
};


export type Subscription_RootBuilding_Variables_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Building_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Building_Variables_Order_By>>;
  where?: InputMaybe<Building_Variables_Bool_Exp>;
};


export type Subscription_RootBuilding_Variables_By_PkArgs = {
  building_id: Scalars['uuid']['input'];
  name: Scalars['String']['input'];
};


export type Subscription_RootBuilding_Variables_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Building_Variables_Stream_Cursor_Input>>;
  where?: InputMaybe<Building_Variables_Bool_Exp>;
};


export type Subscription_RootBuildingsArgs = {
  distinct_on?: InputMaybe<Array<Buildings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buildings_Order_By>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};


export type Subscription_RootBuildings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Buildings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buildings_Order_By>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};


export type Subscription_RootBuildings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBuildings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Buildings_Stream_Cursor_Input>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};


export type Subscription_RootDocument_TemplatesArgs = {
  distinct_on?: InputMaybe<Array<Document_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Document_Templates_Order_By>>;
  where?: InputMaybe<Document_Templates_Bool_Exp>;
};


export type Subscription_RootDocument_Templates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Document_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Document_Templates_Order_By>>;
  where?: InputMaybe<Document_Templates_Bool_Exp>;
};


export type Subscription_RootDocument_Templates_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootDocument_Templates_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Document_Templates_Stream_Cursor_Input>>;
  where?: InputMaybe<Document_Templates_Bool_Exp>;
};


export type Subscription_RootEmail_TemplatesArgs = {
  distinct_on?: InputMaybe<Array<Email_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Templates_Order_By>>;
  where?: InputMaybe<Email_Templates_Bool_Exp>;
};


export type Subscription_RootEmail_Templates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Templates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Templates_Order_By>>;
  where?: InputMaybe<Email_Templates_Bool_Exp>;
};


export type Subscription_RootEmail_Templates_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootEmail_Templates_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Email_Templates_Stream_Cursor_Input>>;
  where?: InputMaybe<Email_Templates_Bool_Exp>;
};


export type Subscription_RootFileArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootFiles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Files_Stream_Cursor_Input>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootGlobal_VariablesArgs = {
  distinct_on?: InputMaybe<Array<Global_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Global_Variables_Order_By>>;
  where?: InputMaybe<Global_Variables_Bool_Exp>;
};


export type Subscription_RootGlobal_Variables_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Global_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Global_Variables_Order_By>>;
  where?: InputMaybe<Global_Variables_Bool_Exp>;
};


export type Subscription_RootGlobal_Variables_By_PkArgs = {
  name: Scalars['String']['input'];
};


export type Subscription_RootGlobal_Variables_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Global_Variables_Stream_Cursor_Input>>;
  where?: InputMaybe<Global_Variables_Bool_Exp>;
};


export type Subscription_RootManual_Vote_AttachmentsArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Attachments_Order_By>>;
  where?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
};


export type Subscription_RootManual_Vote_Attachments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Attachments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Attachments_Order_By>>;
  where?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
};


export type Subscription_RootManual_Vote_Attachments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootManual_Vote_Attachments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Manual_Vote_Attachments_Stream_Cursor_Input>>;
  where?: InputMaybe<Manual_Vote_Attachments_Bool_Exp>;
};


export type Subscription_RootManual_Vote_NotesArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Notes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Notes_Order_By>>;
  where?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
};


export type Subscription_RootManual_Vote_Notes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Manual_Vote_Notes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Manual_Vote_Notes_Order_By>>;
  where?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
};


export type Subscription_RootManual_Vote_Notes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootManual_Vote_Notes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Manual_Vote_Notes_Stream_Cursor_Input>>;
  where?: InputMaybe<Manual_Vote_Notes_Bool_Exp>;
};


export type Subscription_RootMember_VotesArgs = {
  distinct_on?: InputMaybe<Array<Member_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Member_Votes_Order_By>>;
  where?: InputMaybe<Member_Votes_Bool_Exp>;
};


export type Subscription_RootMember_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Member_Votes_Order_By>>;
  where?: InputMaybe<Member_Votes_Bool_Exp>;
};


export type Subscription_RootMember_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootMember_Votes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Member_Votes_Stream_Cursor_Input>>;
  where?: InputMaybe<Member_Votes_Bool_Exp>;
};


export type Subscription_RootMembersArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};


export type Subscription_RootMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};


export type Subscription_RootMembers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootMembers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Members_Stream_Cursor_Input>>;
  where?: InputMaybe<Members_Bool_Exp>;
};


export type Subscription_RootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};


export type Subscription_RootNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};


export type Subscription_RootNotifications_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootNotifications_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Notifications_Stream_Cursor_Input>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};


export type Subscription_RootObserversArgs = {
  distinct_on?: InputMaybe<Array<Observers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Observers_Order_By>>;
  where?: InputMaybe<Observers_Bool_Exp>;
};


export type Subscription_RootObservers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Observers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Observers_Order_By>>;
  where?: InputMaybe<Observers_Bool_Exp>;
};


export type Subscription_RootObservers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootObservers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Observers_Stream_Cursor_Input>>;
  where?: InputMaybe<Observers_Bool_Exp>;
};


export type Subscription_RootProxy_VotesArgs = {
  distinct_on?: InputMaybe<Array<Proxy_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proxy_Votes_Order_By>>;
  where?: InputMaybe<Proxy_Votes_Bool_Exp>;
};


export type Subscription_RootProxy_Votes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Proxy_Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Proxy_Votes_Order_By>>;
  where?: InputMaybe<Proxy_Votes_Bool_Exp>;
};


export type Subscription_RootProxy_Votes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootProxy_Votes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Proxy_Votes_Stream_Cursor_Input>>;
  where?: InputMaybe<Proxy_Votes_Bool_Exp>;
};


export type Subscription_RootQuestion_ResponsesArgs = {
  distinct_on?: InputMaybe<Array<Question_Responses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Question_Responses_Order_By>>;
  where?: InputMaybe<Question_Responses_Bool_Exp>;
};


export type Subscription_RootQuestion_Responses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Question_Responses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Question_Responses_Order_By>>;
  where?: InputMaybe<Question_Responses_Bool_Exp>;
};


export type Subscription_RootQuestion_Responses_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootQuestion_Responses_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Question_Responses_Stream_Cursor_Input>>;
  where?: InputMaybe<Question_Responses_Bool_Exp>;
};


export type Subscription_RootQuestionsArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuestions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuestions_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootQuestions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Questions_Stream_Cursor_Input>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};


export type Subscription_RootReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};


export type Subscription_RootReports_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootReports_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Reports_Stream_Cursor_Input>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};


export type Subscription_RootSms_VerificationsArgs = {
  distinct_on?: InputMaybe<Array<Sms_Verifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Sms_Verifications_Order_By>>;
  where?: InputMaybe<Sms_Verifications_Bool_Exp>;
};


export type Subscription_RootSms_Verifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sms_Verifications_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Sms_Verifications_Order_By>>;
  where?: InputMaybe<Sms_Verifications_Bool_Exp>;
};


export type Subscription_RootSms_Verifications_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootSms_Verifications_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Sms_Verifications_Stream_Cursor_Input>>;
  where?: InputMaybe<Sms_Verifications_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootVirusArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVirus_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Virus_Stream_Cursor_Input>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};


export type Subscription_RootVirusesArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};


export type Subscription_RootVirusesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};


export type Subscription_RootVote_AnalyticsArgs = {
  distinct_on?: InputMaybe<Array<Vote_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Analytics_Order_By>>;
  where?: InputMaybe<Vote_Analytics_Bool_Exp>;
};


export type Subscription_RootVote_Analytics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vote_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Analytics_Order_By>>;
  where?: InputMaybe<Vote_Analytics_Bool_Exp>;
};


export type Subscription_RootVote_Analytics_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVote_Analytics_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vote_Analytics_Stream_Cursor_Input>>;
  where?: InputMaybe<Vote_Analytics_Bool_Exp>;
};


export type Subscription_RootVote_DelegationsArgs = {
  distinct_on?: InputMaybe<Array<Vote_Delegations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Delegations_Order_By>>;
  where?: InputMaybe<Vote_Delegations_Bool_Exp>;
};


export type Subscription_RootVote_Delegations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vote_Delegations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Delegations_Order_By>>;
  where?: InputMaybe<Vote_Delegations_Bool_Exp>;
};


export type Subscription_RootVote_Delegations_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVote_Delegations_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vote_Delegations_Stream_Cursor_Input>>;
  where?: InputMaybe<Vote_Delegations_Bool_Exp>;
};


export type Subscription_RootVotesArgs = {
  distinct_on?: InputMaybe<Array<Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Votes_Order_By>>;
  where?: InputMaybe<Votes_Bool_Exp>;
};


export type Subscription_RootVotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Votes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Votes_Order_By>>;
  where?: InputMaybe<Votes_Bool_Exp>;
};


export type Subscription_RootVotes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVotes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Votes_Stream_Cursor_Input>>;
  where?: InputMaybe<Votes_Bool_Exp>;
};


export type Subscription_RootVoting_TokensArgs = {
  distinct_on?: InputMaybe<Array<Voting_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Voting_Tokens_Order_By>>;
  where?: InputMaybe<Voting_Tokens_Bool_Exp>;
};


export type Subscription_RootVoting_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Voting_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Voting_Tokens_Order_By>>;
  where?: InputMaybe<Voting_Tokens_Bool_Exp>;
};


export type Subscription_RootVoting_Tokens_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVoting_Tokens_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Voting_Tokens_Stream_Cursor_Input>>;
  where?: InputMaybe<Voting_Tokens_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type Users = {
  activeMfaType?: Maybe<Scalars['String']['output']>;
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  currentChallenge?: Maybe<Scalars['String']['output']>;
  defaultRole: Scalars['String']['output'];
  /** An object relationship */
  defaultRoleByRole: AuthRoles;
  disabled: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['citext']['output']>;
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  isAnonymous: Scalars['Boolean']['output'];
  lastSeen?: Maybe<Scalars['timestamptz']['output']>;
  locale: Scalars['String']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  newEmail?: Maybe<Scalars['citext']['output']>;
  otpHash?: Maybe<Scalars['String']['output']>;
  otpHashExpiresAt: Scalars['timestamptz']['output'];
  otpMethodLastUsed?: Maybe<Scalars['String']['output']>;
  passwordHash?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  phoneNumberVerified: Scalars['Boolean']['output'];
  /** An array relationship */
  refreshTokens: Array<AuthRefreshTokens>;
  /** An aggregate relationship */
  refreshTokens_aggregate: AuthRefreshTokens_Aggregate;
  /** An array relationship */
  roles: Array<AuthUserRoles>;
  /** An aggregate relationship */
  roles_aggregate: AuthUserRoles_Aggregate;
  /** An array relationship */
  securityKeys: Array<AuthUserSecurityKeys>;
  /** An aggregate relationship */
  securityKeys_aggregate: AuthUserSecurityKeys_Aggregate;
  ticket?: Maybe<Scalars['String']['output']>;
  ticketExpiresAt: Scalars['timestamptz']['output'];
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['timestamptz']['output'];
  /** An array relationship */
  userProviders: Array<AuthUserProviders>;
  /** An aggregate relationship */
  userProviders_aggregate: AuthUserProviders_Aggregate;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRefreshTokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersSecurityKeysArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersSecurityKeys_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersUserProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** aggregated selection of "auth.users" */
export type Users_Aggregate = {
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

export type Users_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Users_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Users_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Users_Aggregate_Bool_Exp_Count>;
};

export type Users_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.users" */
export type Users_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "auth.users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "auth.users" */
export type Users_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Max_Order_By>;
  min?: InputMaybe<Users_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Users_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "auth.users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  activeMfaType?: InputMaybe<String_Comparison_Exp>;
  avatarUrl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  currentChallenge?: InputMaybe<String_Comparison_Exp>;
  defaultRole?: InputMaybe<String_Comparison_Exp>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Bool_Exp>;
  disabled?: InputMaybe<Boolean_Comparison_Exp>;
  displayName?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<Citext_Comparison_Exp>;
  emailVerified?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isAnonymous?: InputMaybe<Boolean_Comparison_Exp>;
  lastSeen?: InputMaybe<Timestamptz_Comparison_Exp>;
  locale?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  newEmail?: InputMaybe<Citext_Comparison_Exp>;
  otpHash?: InputMaybe<String_Comparison_Exp>;
  otpHashExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  otpMethodLastUsed?: InputMaybe<String_Comparison_Exp>;
  passwordHash?: InputMaybe<String_Comparison_Exp>;
  phoneNumber?: InputMaybe<String_Comparison_Exp>;
  phoneNumberVerified?: InputMaybe<Boolean_Comparison_Exp>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Bool_Exp>;
  roles?: InputMaybe<AuthUserRoles_Bool_Exp>;
  roles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Bool_Exp>;
  securityKeys?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
  securityKeys_aggregate?: InputMaybe<AuthUserSecurityKeys_Aggregate_Bool_Exp>;
  ticket?: InputMaybe<String_Comparison_Exp>;
  ticketExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  totpSecret?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userProviders?: InputMaybe<AuthUserProviders_Bool_Exp>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "phone_number" */
  UsersPhoneNumberKey = 'users_phone_number_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Users_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Users_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Users_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "auth.users" */
export type Users_Insert_Input = {
  activeMfaType?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currentChallenge?: InputMaybe<Scalars['String']['input']>;
  defaultRole?: InputMaybe<Scalars['String']['input']>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Obj_Rel_Insert_Input>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['citext']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newEmail?: InputMaybe<Scalars['citext']['input']>;
  otpHash?: InputMaybe<Scalars['String']['input']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']['input']>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Arr_Rel_Insert_Input>;
  roles?: InputMaybe<AuthUserRoles_Arr_Rel_Insert_Input>;
  securityKeys?: InputMaybe<AuthUserSecurityKeys_Arr_Rel_Insert_Input>;
  ticket?: InputMaybe<Scalars['String']['input']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  totpSecret?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userProviders?: InputMaybe<AuthUserProviders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  activeMfaType?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currentChallenge?: Maybe<Scalars['String']['output']>;
  defaultRole?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['citext']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  lastSeen?: Maybe<Scalars['timestamptz']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  newEmail?: Maybe<Scalars['citext']['output']>;
  otpHash?: Maybe<Scalars['String']['output']>;
  otpHashExpiresAt?: Maybe<Scalars['timestamptz']['output']>;
  otpMethodLastUsed?: Maybe<Scalars['String']['output']>;
  passwordHash?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  ticket?: Maybe<Scalars['String']['output']>;
  ticketExpiresAt?: Maybe<Scalars['timestamptz']['output']>;
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "auth.users" */
export type Users_Max_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currentChallenge?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  activeMfaType?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  currentChallenge?: Maybe<Scalars['String']['output']>;
  defaultRole?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['citext']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  lastSeen?: Maybe<Scalars['timestamptz']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  newEmail?: Maybe<Scalars['citext']['output']>;
  otpHash?: Maybe<Scalars['String']['output']>;
  otpHashExpiresAt?: Maybe<Scalars['timestamptz']['output']>;
  otpMethodLastUsed?: Maybe<Scalars['String']['output']>;
  passwordHash?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  ticket?: Maybe<Scalars['String']['output']>;
  ticketExpiresAt?: Maybe<Scalars['timestamptz']['output']>;
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "auth.users" */
export type Users_Min_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currentChallenge?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.users" */
export type Users_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "auth.users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "auth.users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.users". */
export type Users_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currentChallenge?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Order_By>;
  disabled?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  emailVerified?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isAnonymous?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  phoneNumberVerified?: InputMaybe<Order_By>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Order_By>;
  roles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Order_By>;
  securityKeys_aggregate?: InputMaybe<AuthUserSecurityKeys_Aggregate_Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Order_By>;
};

/** primary key columns input for table: auth.users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Users_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "auth.users" */
export enum Users_Select_Column {
  /** column name */
  ActiveMfaType = 'activeMfaType',
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentChallenge = 'currentChallenge',
  /** column name */
  DefaultRole = 'defaultRole',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  LastSeen = 'lastSeen',
  /** column name */
  Locale = 'locale',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  NewEmail = 'newEmail',
  /** column name */
  OtpHash = 'otpHash',
  /** column name */
  OtpHashExpiresAt = 'otpHashExpiresAt',
  /** column name */
  OtpMethodLastUsed = 'otpMethodLastUsed',
  /** column name */
  PasswordHash = 'passwordHash',
  /** column name */
  PhoneNumber = 'phoneNumber',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified',
  /** column name */
  Ticket = 'ticket',
  /** column name */
  TicketExpiresAt = 'ticketExpiresAt',
  /** column name */
  TotpSecret = 'totpSecret',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** select "users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "auth.users" */
export enum Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Disabled = 'disabled',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified'
}

/** select "users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "auth.users" */
export enum Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Disabled = 'disabled',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified'
}

/** input type for updating data in table "auth.users" */
export type Users_Set_Input = {
  activeMfaType?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currentChallenge?: InputMaybe<Scalars['String']['input']>;
  defaultRole?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['citext']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newEmail?: InputMaybe<Scalars['citext']['input']>;
  otpHash?: InputMaybe<Scalars['String']['input']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']['input']>;
  ticket?: InputMaybe<Scalars['String']['input']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  totpSecret?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  activeMfaType?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  currentChallenge?: InputMaybe<Scalars['String']['input']>;
  defaultRole?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['citext']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  newEmail?: InputMaybe<Scalars['citext']['input']>;
  otpHash?: InputMaybe<Scalars['String']['input']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']['input']>;
  ticket?: InputMaybe<Scalars['String']['input']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']['input']>;
  totpSecret?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "auth.users" */
export enum Users_Update_Column {
  /** column name */
  ActiveMfaType = 'activeMfaType',
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentChallenge = 'currentChallenge',
  /** column name */
  DefaultRole = 'defaultRole',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  LastSeen = 'lastSeen',
  /** column name */
  Locale = 'locale',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  NewEmail = 'newEmail',
  /** column name */
  OtpHash = 'otpHash',
  /** column name */
  OtpHashExpiresAt = 'otpHashExpiresAt',
  /** column name */
  OtpMethodLastUsed = 'otpMethodLastUsed',
  /** column name */
  PasswordHash = 'passwordHash',
  /** column name */
  PhoneNumber = 'phoneNumber',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified',
  /** column name */
  Ticket = 'ticket',
  /** column name */
  TicketExpiresAt = 'ticketExpiresAt',
  /** column name */
  TotpSecret = 'totpSecret',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Users_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Users_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Users_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _eq?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _gt?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _gte?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['uuid']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _lte?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _neq?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['uuid']['input']>>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

/** columns and relationships of "storage.virus" */
export type Virus = {
  createdAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  file: Files;
  fileId: Scalars['uuid']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  userSession: Scalars['jsonb']['output'];
  virus: Scalars['String']['output'];
};


/** columns and relationships of "storage.virus" */
export type VirusUserSessionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "storage.virus" */
export type Virus_Aggregate = {
  aggregate?: Maybe<Virus_Aggregate_Fields>;
  nodes: Array<Virus>;
};

/** aggregate fields of "storage.virus" */
export type Virus_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Virus_Max_Fields>;
  min?: Maybe<Virus_Min_Fields>;
};


/** aggregate fields of "storage.virus" */
export type Virus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Virus_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Virus_Append_Input = {
  userSession?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "storage.virus". All fields are combined with a logical 'AND'. */
export type Virus_Bool_Exp = {
  _and?: InputMaybe<Array<Virus_Bool_Exp>>;
  _not?: InputMaybe<Virus_Bool_Exp>;
  _or?: InputMaybe<Array<Virus_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  file?: InputMaybe<Files_Bool_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  filename?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userSession?: InputMaybe<Jsonb_Comparison_Exp>;
  virus?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.virus" */
export enum Virus_Constraint {
  /** unique or primary key constraint on columns "id" */
  VirusPkey = 'virus_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Virus_Delete_At_Path_Input = {
  userSession?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Virus_Delete_Elem_Input = {
  userSession?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Virus_Delete_Key_Input = {
  userSession?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "storage.virus" */
export type Virus_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  file?: InputMaybe<Files_Obj_Rel_Insert_Input>;
  fileId?: InputMaybe<Scalars['uuid']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userSession?: InputMaybe<Scalars['jsonb']['input']>;
  virus?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Virus_Max_Fields = {
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  fileId?: Maybe<Scalars['uuid']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  virus?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Virus_Min_Fields = {
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  fileId?: Maybe<Scalars['uuid']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  virus?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "storage.virus" */
export type Virus_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Virus>;
};

/** on_conflict condition type for table "storage.virus" */
export type Virus_On_Conflict = {
  constraint: Virus_Constraint;
  update_columns?: Array<Virus_Update_Column>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.virus". */
export type Virus_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  file?: InputMaybe<Files_Order_By>;
  fileId?: InputMaybe<Order_By>;
  filename?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userSession?: InputMaybe<Order_By>;
  virus?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.virus */
export type Virus_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Virus_Prepend_Input = {
  userSession?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "storage.virus" */
export enum Virus_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  FileId = 'fileId',
  /** column name */
  Filename = 'filename',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserSession = 'userSession',
  /** column name */
  Virus = 'virus'
}

/** input type for updating data in table "storage.virus" */
export type Virus_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileId?: InputMaybe<Scalars['uuid']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userSession?: InputMaybe<Scalars['jsonb']['input']>;
  virus?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "virus" */
export type Virus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Virus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Virus_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileId?: InputMaybe<Scalars['uuid']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userSession?: InputMaybe<Scalars['jsonb']['input']>;
  virus?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "storage.virus" */
export enum Virus_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  FileId = 'fileId',
  /** column name */
  Filename = 'filename',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserSession = 'userSession',
  /** column name */
  Virus = 'virus'
}

export type Virus_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Virus_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Virus_Set_Input>;
  /** filter the rows which have to be updated */
  where: Virus_Bool_Exp;
};

/** columns and relationships of "vote_analytics" */
export type Vote_Analytics = {
  building_id: Scalars['uuid']['output'];
  completion_rate?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  demographic_breakdown?: Maybe<Scalars['jsonb']['output']>;
  id: Scalars['uuid']['output'];
  last_updated?: Maybe<Scalars['timestamptz']['output']>;
  participation_rate?: Maybe<Scalars['numeric']['output']>;
  question_results?: Maybe<Scalars['jsonb']['output']>;
  reminders_sent?: Maybe<Scalars['Int']['output']>;
  timeline_data?: Maybe<Scalars['jsonb']['output']>;
  total_delegations?: Maybe<Scalars['Int']['output']>;
  total_eligible_voters: Scalars['Int']['output'];
  total_votes_cast?: Maybe<Scalars['Int']['output']>;
  total_voting_power?: Maybe<Scalars['numeric']['output']>;
  vote_id: Scalars['uuid']['output'];
};


/** columns and relationships of "vote_analytics" */
export type Vote_AnalyticsDemographic_BreakdownArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "vote_analytics" */
export type Vote_AnalyticsQuestion_ResultsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "vote_analytics" */
export type Vote_AnalyticsTimeline_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "vote_analytics" */
export type Vote_Analytics_Aggregate = {
  aggregate?: Maybe<Vote_Analytics_Aggregate_Fields>;
  nodes: Array<Vote_Analytics>;
};

/** aggregate fields of "vote_analytics" */
export type Vote_Analytics_Aggregate_Fields = {
  avg?: Maybe<Vote_Analytics_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Vote_Analytics_Max_Fields>;
  min?: Maybe<Vote_Analytics_Min_Fields>;
  stddev?: Maybe<Vote_Analytics_Stddev_Fields>;
  stddev_pop?: Maybe<Vote_Analytics_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Vote_Analytics_Stddev_Samp_Fields>;
  sum?: Maybe<Vote_Analytics_Sum_Fields>;
  var_pop?: Maybe<Vote_Analytics_Var_Pop_Fields>;
  var_samp?: Maybe<Vote_Analytics_Var_Samp_Fields>;
  variance?: Maybe<Vote_Analytics_Variance_Fields>;
};


/** aggregate fields of "vote_analytics" */
export type Vote_Analytics_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vote_Analytics_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Vote_Analytics_Append_Input = {
  demographic_breakdown?: InputMaybe<Scalars['jsonb']['input']>;
  question_results?: InputMaybe<Scalars['jsonb']['input']>;
  timeline_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Vote_Analytics_Avg_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "vote_analytics". All fields are combined with a logical 'AND'. */
export type Vote_Analytics_Bool_Exp = {
  _and?: InputMaybe<Array<Vote_Analytics_Bool_Exp>>;
  _not?: InputMaybe<Vote_Analytics_Bool_Exp>;
  _or?: InputMaybe<Array<Vote_Analytics_Bool_Exp>>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  completion_rate?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  demographic_breakdown?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_updated?: InputMaybe<Timestamptz_Comparison_Exp>;
  participation_rate?: InputMaybe<Numeric_Comparison_Exp>;
  question_results?: InputMaybe<Jsonb_Comparison_Exp>;
  reminders_sent?: InputMaybe<Int_Comparison_Exp>;
  timeline_data?: InputMaybe<Jsonb_Comparison_Exp>;
  total_delegations?: InputMaybe<Int_Comparison_Exp>;
  total_eligible_voters?: InputMaybe<Int_Comparison_Exp>;
  total_votes_cast?: InputMaybe<Int_Comparison_Exp>;
  total_voting_power?: InputMaybe<Numeric_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "vote_analytics" */
export enum Vote_Analytics_Constraint {
  /** unique or primary key constraint on columns "id" */
  VoteAnalyticsPkey = 'vote_analytics_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Vote_Analytics_Delete_At_Path_Input = {
  demographic_breakdown?: InputMaybe<Array<Scalars['String']['input']>>;
  question_results?: InputMaybe<Array<Scalars['String']['input']>>;
  timeline_data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Vote_Analytics_Delete_Elem_Input = {
  demographic_breakdown?: InputMaybe<Scalars['Int']['input']>;
  question_results?: InputMaybe<Scalars['Int']['input']>;
  timeline_data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Vote_Analytics_Delete_Key_Input = {
  demographic_breakdown?: InputMaybe<Scalars['String']['input']>;
  question_results?: InputMaybe<Scalars['String']['input']>;
  timeline_data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "vote_analytics" */
export type Vote_Analytics_Inc_Input = {
  completion_rate?: InputMaybe<Scalars['numeric']['input']>;
  participation_rate?: InputMaybe<Scalars['numeric']['input']>;
  reminders_sent?: InputMaybe<Scalars['Int']['input']>;
  total_delegations?: InputMaybe<Scalars['Int']['input']>;
  total_eligible_voters?: InputMaybe<Scalars['Int']['input']>;
  total_votes_cast?: InputMaybe<Scalars['Int']['input']>;
  total_voting_power?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "vote_analytics" */
export type Vote_Analytics_Insert_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  completion_rate?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  demographic_breakdown?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  last_updated?: InputMaybe<Scalars['timestamptz']['input']>;
  participation_rate?: InputMaybe<Scalars['numeric']['input']>;
  question_results?: InputMaybe<Scalars['jsonb']['input']>;
  reminders_sent?: InputMaybe<Scalars['Int']['input']>;
  timeline_data?: InputMaybe<Scalars['jsonb']['input']>;
  total_delegations?: InputMaybe<Scalars['Int']['input']>;
  total_eligible_voters?: InputMaybe<Scalars['Int']['input']>;
  total_votes_cast?: InputMaybe<Scalars['Int']['input']>;
  total_voting_power?: InputMaybe<Scalars['numeric']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Vote_Analytics_Max_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  completion_rate?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_updated?: Maybe<Scalars['timestamptz']['output']>;
  participation_rate?: Maybe<Scalars['numeric']['output']>;
  reminders_sent?: Maybe<Scalars['Int']['output']>;
  total_delegations?: Maybe<Scalars['Int']['output']>;
  total_eligible_voters?: Maybe<Scalars['Int']['output']>;
  total_votes_cast?: Maybe<Scalars['Int']['output']>;
  total_voting_power?: Maybe<Scalars['numeric']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Vote_Analytics_Min_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  completion_rate?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_updated?: Maybe<Scalars['timestamptz']['output']>;
  participation_rate?: Maybe<Scalars['numeric']['output']>;
  reminders_sent?: Maybe<Scalars['Int']['output']>;
  total_delegations?: Maybe<Scalars['Int']['output']>;
  total_eligible_voters?: Maybe<Scalars['Int']['output']>;
  total_votes_cast?: Maybe<Scalars['Int']['output']>;
  total_voting_power?: Maybe<Scalars['numeric']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "vote_analytics" */
export type Vote_Analytics_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vote_Analytics>;
};

/** on_conflict condition type for table "vote_analytics" */
export type Vote_Analytics_On_Conflict = {
  constraint: Vote_Analytics_Constraint;
  update_columns?: Array<Vote_Analytics_Update_Column>;
  where?: InputMaybe<Vote_Analytics_Bool_Exp>;
};

/** Ordering options when selecting data from "vote_analytics". */
export type Vote_Analytics_Order_By = {
  building_id?: InputMaybe<Order_By>;
  completion_rate?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  demographic_breakdown?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_updated?: InputMaybe<Order_By>;
  participation_rate?: InputMaybe<Order_By>;
  question_results?: InputMaybe<Order_By>;
  reminders_sent?: InputMaybe<Order_By>;
  timeline_data?: InputMaybe<Order_By>;
  total_delegations?: InputMaybe<Order_By>;
  total_eligible_voters?: InputMaybe<Order_By>;
  total_votes_cast?: InputMaybe<Order_By>;
  total_voting_power?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vote_analytics */
export type Vote_Analytics_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Vote_Analytics_Prepend_Input = {
  demographic_breakdown?: InputMaybe<Scalars['jsonb']['input']>;
  question_results?: InputMaybe<Scalars['jsonb']['input']>;
  timeline_data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "vote_analytics" */
export enum Vote_Analytics_Select_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CompletionRate = 'completion_rate',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DemographicBreakdown = 'demographic_breakdown',
  /** column name */
  Id = 'id',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  ParticipationRate = 'participation_rate',
  /** column name */
  QuestionResults = 'question_results',
  /** column name */
  RemindersSent = 'reminders_sent',
  /** column name */
  TimelineData = 'timeline_data',
  /** column name */
  TotalDelegations = 'total_delegations',
  /** column name */
  TotalEligibleVoters = 'total_eligible_voters',
  /** column name */
  TotalVotesCast = 'total_votes_cast',
  /** column name */
  TotalVotingPower = 'total_voting_power',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "vote_analytics" */
export type Vote_Analytics_Set_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  completion_rate?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  demographic_breakdown?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  last_updated?: InputMaybe<Scalars['timestamptz']['input']>;
  participation_rate?: InputMaybe<Scalars['numeric']['input']>;
  question_results?: InputMaybe<Scalars['jsonb']['input']>;
  reminders_sent?: InputMaybe<Scalars['Int']['input']>;
  timeline_data?: InputMaybe<Scalars['jsonb']['input']>;
  total_delegations?: InputMaybe<Scalars['Int']['input']>;
  total_eligible_voters?: InputMaybe<Scalars['Int']['input']>;
  total_votes_cast?: InputMaybe<Scalars['Int']['input']>;
  total_voting_power?: InputMaybe<Scalars['numeric']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Vote_Analytics_Stddev_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Vote_Analytics_Stddev_Pop_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Vote_Analytics_Stddev_Samp_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "vote_analytics" */
export type Vote_Analytics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vote_Analytics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vote_Analytics_Stream_Cursor_Value_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  completion_rate?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  demographic_breakdown?: InputMaybe<Scalars['jsonb']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  last_updated?: InputMaybe<Scalars['timestamptz']['input']>;
  participation_rate?: InputMaybe<Scalars['numeric']['input']>;
  question_results?: InputMaybe<Scalars['jsonb']['input']>;
  reminders_sent?: InputMaybe<Scalars['Int']['input']>;
  timeline_data?: InputMaybe<Scalars['jsonb']['input']>;
  total_delegations?: InputMaybe<Scalars['Int']['input']>;
  total_eligible_voters?: InputMaybe<Scalars['Int']['input']>;
  total_votes_cast?: InputMaybe<Scalars['Int']['input']>;
  total_voting_power?: InputMaybe<Scalars['numeric']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Vote_Analytics_Sum_Fields = {
  completion_rate?: Maybe<Scalars['numeric']['output']>;
  participation_rate?: Maybe<Scalars['numeric']['output']>;
  reminders_sent?: Maybe<Scalars['Int']['output']>;
  total_delegations?: Maybe<Scalars['Int']['output']>;
  total_eligible_voters?: Maybe<Scalars['Int']['output']>;
  total_votes_cast?: Maybe<Scalars['Int']['output']>;
  total_voting_power?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "vote_analytics" */
export enum Vote_Analytics_Update_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CompletionRate = 'completion_rate',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DemographicBreakdown = 'demographic_breakdown',
  /** column name */
  Id = 'id',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  ParticipationRate = 'participation_rate',
  /** column name */
  QuestionResults = 'question_results',
  /** column name */
  RemindersSent = 'reminders_sent',
  /** column name */
  TimelineData = 'timeline_data',
  /** column name */
  TotalDelegations = 'total_delegations',
  /** column name */
  TotalEligibleVoters = 'total_eligible_voters',
  /** column name */
  TotalVotesCast = 'total_votes_cast',
  /** column name */
  TotalVotingPower = 'total_voting_power',
  /** column name */
  VoteId = 'vote_id'
}

export type Vote_Analytics_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Vote_Analytics_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Vote_Analytics_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Vote_Analytics_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Vote_Analytics_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Vote_Analytics_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Vote_Analytics_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vote_Analytics_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vote_Analytics_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Vote_Analytics_Var_Pop_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Vote_Analytics_Var_Samp_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Vote_Analytics_Variance_Fields = {
  completion_rate?: Maybe<Scalars['Float']['output']>;
  participation_rate?: Maybe<Scalars['Float']['output']>;
  reminders_sent?: Maybe<Scalars['Float']['output']>;
  total_delegations?: Maybe<Scalars['Float']['output']>;
  total_eligible_voters?: Maybe<Scalars['Float']['output']>;
  total_votes_cast?: Maybe<Scalars['Float']['output']>;
  total_voting_power?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "vote_delegations" */
export type Vote_Delegations = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  delegate_id: Scalars['uuid']['output'];
  delegation_type?: Maybe<Scalars['String']['output']>;
  delegator_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  is_active?: Maybe<Scalars['Boolean']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
  specific_questions?: Maybe<Array<Scalars['uuid']['output']>>;
  vote_id: Scalars['uuid']['output'];
};

/** aggregated selection of "vote_delegations" */
export type Vote_Delegations_Aggregate = {
  aggregate?: Maybe<Vote_Delegations_Aggregate_Fields>;
  nodes: Array<Vote_Delegations>;
};

/** aggregate fields of "vote_delegations" */
export type Vote_Delegations_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Vote_Delegations_Max_Fields>;
  min?: Maybe<Vote_Delegations_Min_Fields>;
};


/** aggregate fields of "vote_delegations" */
export type Vote_Delegations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vote_Delegations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vote_delegations". All fields are combined with a logical 'AND'. */
export type Vote_Delegations_Bool_Exp = {
  _and?: InputMaybe<Array<Vote_Delegations_Bool_Exp>>;
  _not?: InputMaybe<Vote_Delegations_Bool_Exp>;
  _or?: InputMaybe<Array<Vote_Delegations_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  delegate_id?: InputMaybe<Uuid_Comparison_Exp>;
  delegation_type?: InputMaybe<String_Comparison_Exp>;
  delegator_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  notes?: InputMaybe<String_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  specific_questions?: InputMaybe<Uuid_Array_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "vote_delegations" */
export enum Vote_Delegations_Constraint {
  /** unique or primary key constraint on columns "id" */
  VoteDelegationsPkey = 'vote_delegations_pkey',
  /** unique or primary key constraint on columns "delegator_id", "vote_id" */
  VoteDelegationsVoteIdDelegatorIdKey = 'vote_delegations_vote_id_delegator_id_key'
}

/** input type for inserting data into table "vote_delegations" */
export type Vote_Delegations_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  delegate_id?: InputMaybe<Scalars['uuid']['input']>;
  delegation_type?: InputMaybe<Scalars['String']['input']>;
  delegator_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  specific_questions?: InputMaybe<Array<Scalars['uuid']['input']>>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Vote_Delegations_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  delegate_id?: Maybe<Scalars['uuid']['output']>;
  delegation_type?: Maybe<Scalars['String']['output']>;
  delegator_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
  specific_questions?: Maybe<Array<Scalars['uuid']['output']>>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Vote_Delegations_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  delegate_id?: Maybe<Scalars['uuid']['output']>;
  delegation_type?: Maybe<Scalars['String']['output']>;
  delegator_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
  specific_questions?: Maybe<Array<Scalars['uuid']['output']>>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "vote_delegations" */
export type Vote_Delegations_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vote_Delegations>;
};

/** on_conflict condition type for table "vote_delegations" */
export type Vote_Delegations_On_Conflict = {
  constraint: Vote_Delegations_Constraint;
  update_columns?: Array<Vote_Delegations_Update_Column>;
  where?: InputMaybe<Vote_Delegations_Bool_Exp>;
};

/** Ordering options when selecting data from "vote_delegations". */
export type Vote_Delegations_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delegate_id?: InputMaybe<Order_By>;
  delegation_type?: InputMaybe<Order_By>;
  delegator_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
  specific_questions?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vote_delegations */
export type Vote_Delegations_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "vote_delegations" */
export enum Vote_Delegations_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DelegateId = 'delegate_id',
  /** column name */
  DelegationType = 'delegation_type',
  /** column name */
  DelegatorId = 'delegator_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  Notes = 'notes',
  /** column name */
  RevokedAt = 'revoked_at',
  /** column name */
  SpecificQuestions = 'specific_questions',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "vote_delegations" */
export type Vote_Delegations_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  delegate_id?: InputMaybe<Scalars['uuid']['input']>;
  delegation_type?: InputMaybe<Scalars['String']['input']>;
  delegator_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  specific_questions?: InputMaybe<Array<Scalars['uuid']['input']>>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "vote_delegations" */
export type Vote_Delegations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vote_Delegations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vote_Delegations_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  delegate_id?: InputMaybe<Scalars['uuid']['input']>;
  delegation_type?: InputMaybe<Scalars['String']['input']>;
  delegator_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  specific_questions?: InputMaybe<Array<Scalars['uuid']['input']>>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "vote_delegations" */
export enum Vote_Delegations_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DelegateId = 'delegate_id',
  /** column name */
  DelegationType = 'delegation_type',
  /** column name */
  DelegatorId = 'delegator_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  Notes = 'notes',
  /** column name */
  RevokedAt = 'revoked_at',
  /** column name */
  SpecificQuestions = 'specific_questions',
  /** column name */
  VoteId = 'vote_id'
}

export type Vote_Delegations_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vote_Delegations_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vote_Delegations_Bool_Exp;
};

/** columns and relationships of "votes" */
export type Votes = {
  building_id: Scalars['uuid']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end_date?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  manual_vote_attachments?: Maybe<Scalars['jsonb']['output']>;
  manual_vote_notes?: Maybe<Scalars['jsonb']['output']>;
  member_votes?: Maybe<Scalars['jsonb']['output']>;
  observers?: Maybe<Array<Scalars['String']['output']>>;
  questions?: Maybe<Scalars['jsonb']['output']>;
  start_date?: Maybe<Scalars['timestamptz']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_statistics?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "votes" */
export type VotesManual_Vote_AttachmentsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "votes" */
export type VotesManual_Vote_NotesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "votes" */
export type VotesMember_VotesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "votes" */
export type VotesQuestionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "votes" */
export type VotesVote_StatisticsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "votes" */
export type Votes_Aggregate = {
  aggregate?: Maybe<Votes_Aggregate_Fields>;
  nodes: Array<Votes>;
};

/** aggregate fields of "votes" */
export type Votes_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Votes_Max_Fields>;
  min?: Maybe<Votes_Min_Fields>;
};


/** aggregate fields of "votes" */
export type Votes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Votes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Votes_Append_Input = {
  manual_vote_attachments?: InputMaybe<Scalars['jsonb']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['jsonb']['input']>;
  member_votes?: InputMaybe<Scalars['jsonb']['input']>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  vote_statistics?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "votes". All fields are combined with a logical 'AND'. */
export type Votes_Bool_Exp = {
  _and?: InputMaybe<Array<Votes_Bool_Exp>>;
  _not?: InputMaybe<Votes_Bool_Exp>;
  _or?: InputMaybe<Array<Votes_Bool_Exp>>;
  building_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  end_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  manual_vote_attachments?: InputMaybe<Jsonb_Comparison_Exp>;
  manual_vote_notes?: InputMaybe<Jsonb_Comparison_Exp>;
  member_votes?: InputMaybe<Jsonb_Comparison_Exp>;
  observers?: InputMaybe<String_Array_Comparison_Exp>;
  questions?: InputMaybe<Jsonb_Comparison_Exp>;
  start_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  vote_statistics?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "votes" */
export enum Votes_Constraint {
  /** unique or primary key constraint on columns "id" */
  VotesPkey = 'votes_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Votes_Delete_At_Path_Input = {
  manual_vote_attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  manual_vote_notes?: InputMaybe<Array<Scalars['String']['input']>>;
  member_votes?: InputMaybe<Array<Scalars['String']['input']>>;
  questions?: InputMaybe<Array<Scalars['String']['input']>>;
  vote_statistics?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Votes_Delete_Elem_Input = {
  manual_vote_attachments?: InputMaybe<Scalars['Int']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['Int']['input']>;
  member_votes?: InputMaybe<Scalars['Int']['input']>;
  questions?: InputMaybe<Scalars['Int']['input']>;
  vote_statistics?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Votes_Delete_Key_Input = {
  manual_vote_attachments?: InputMaybe<Scalars['String']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['String']['input']>;
  member_votes?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Scalars['String']['input']>;
  vote_statistics?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "votes" */
export type Votes_Insert_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  manual_vote_attachments?: InputMaybe<Scalars['jsonb']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['jsonb']['input']>;
  member_votes?: InputMaybe<Scalars['jsonb']['input']>;
  observers?: InputMaybe<Array<Scalars['String']['input']>>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  start_date?: InputMaybe<Scalars['timestamptz']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_statistics?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Votes_Max_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end_date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  observers?: Maybe<Array<Scalars['String']['output']>>;
  start_date?: Maybe<Scalars['timestamptz']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Votes_Min_Fields = {
  building_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end_date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  observers?: Maybe<Array<Scalars['String']['output']>>;
  start_date?: Maybe<Scalars['timestamptz']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "votes" */
export type Votes_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Votes>;
};

/** on_conflict condition type for table "votes" */
export type Votes_On_Conflict = {
  constraint: Votes_Constraint;
  update_columns?: Array<Votes_Update_Column>;
  where?: InputMaybe<Votes_Bool_Exp>;
};

/** Ordering options when selecting data from "votes". */
export type Votes_Order_By = {
  building_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  manual_vote_attachments?: InputMaybe<Order_By>;
  manual_vote_notes?: InputMaybe<Order_By>;
  member_votes?: InputMaybe<Order_By>;
  observers?: InputMaybe<Order_By>;
  questions?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  vote_statistics?: InputMaybe<Order_By>;
};

/** primary key columns input for table: votes */
export type Votes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Votes_Prepend_Input = {
  manual_vote_attachments?: InputMaybe<Scalars['jsonb']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['jsonb']['input']>;
  member_votes?: InputMaybe<Scalars['jsonb']['input']>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  vote_statistics?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "votes" */
export enum Votes_Select_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  EndDate = 'end_date',
  /** column name */
  Id = 'id',
  /** column name */
  ManualVoteAttachments = 'manual_vote_attachments',
  /** column name */
  ManualVoteNotes = 'manual_vote_notes',
  /** column name */
  MemberVotes = 'member_votes',
  /** column name */
  Observers = 'observers',
  /** column name */
  Questions = 'questions',
  /** column name */
  StartDate = 'start_date',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VoteStatistics = 'vote_statistics'
}

/** input type for updating data in table "votes" */
export type Votes_Set_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  manual_vote_attachments?: InputMaybe<Scalars['jsonb']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['jsonb']['input']>;
  member_votes?: InputMaybe<Scalars['jsonb']['input']>;
  observers?: InputMaybe<Array<Scalars['String']['input']>>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  start_date?: InputMaybe<Scalars['timestamptz']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_statistics?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "votes" */
export type Votes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Votes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Votes_Stream_Cursor_Value_Input = {
  building_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  end_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  manual_vote_attachments?: InputMaybe<Scalars['jsonb']['input']>;
  manual_vote_notes?: InputMaybe<Scalars['jsonb']['input']>;
  member_votes?: InputMaybe<Scalars['jsonb']['input']>;
  observers?: InputMaybe<Array<Scalars['String']['input']>>;
  questions?: InputMaybe<Scalars['jsonb']['input']>;
  start_date?: InputMaybe<Scalars['timestamptz']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_statistics?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "votes" */
export enum Votes_Update_Column {
  /** column name */
  BuildingId = 'building_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  EndDate = 'end_date',
  /** column name */
  Id = 'id',
  /** column name */
  ManualVoteAttachments = 'manual_vote_attachments',
  /** column name */
  ManualVoteNotes = 'manual_vote_notes',
  /** column name */
  MemberVotes = 'member_votes',
  /** column name */
  Observers = 'observers',
  /** column name */
  Questions = 'questions',
  /** column name */
  StartDate = 'start_date',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VoteStatistics = 'vote_statistics'
}

export type Votes_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Votes_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Votes_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Votes_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Votes_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Votes_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Votes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Votes_Bool_Exp;
};

/** columns and relationships of "voting_tokens" */
export type Voting_Tokens = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  ip_address?: Maybe<Scalars['inet']['output']>;
  is_used?: Maybe<Scalars['Boolean']['output']>;
  is_verified?: Maybe<Scalars['Boolean']['output']>;
  max_usage_attempts?: Maybe<Scalars['Int']['output']>;
  max_verification_attempts?: Maybe<Scalars['Int']['output']>;
  member_id: Scalars['uuid']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  token: Scalars['String']['output'];
  token_type?: Maybe<Scalars['String']['output']>;
  usage_attempts?: Maybe<Scalars['Int']['output']>;
  used_at?: Maybe<Scalars['timestamptz']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  verification_attempts?: Maybe<Scalars['Int']['output']>;
  verification_code: Scalars['String']['output'];
  verified_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_id: Scalars['uuid']['output'];
};


/** columns and relationships of "voting_tokens" */
export type Voting_TokensMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "voting_tokens" */
export type Voting_Tokens_Aggregate = {
  aggregate?: Maybe<Voting_Tokens_Aggregate_Fields>;
  nodes: Array<Voting_Tokens>;
};

/** aggregate fields of "voting_tokens" */
export type Voting_Tokens_Aggregate_Fields = {
  avg?: Maybe<Voting_Tokens_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Voting_Tokens_Max_Fields>;
  min?: Maybe<Voting_Tokens_Min_Fields>;
  stddev?: Maybe<Voting_Tokens_Stddev_Fields>;
  stddev_pop?: Maybe<Voting_Tokens_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Voting_Tokens_Stddev_Samp_Fields>;
  sum?: Maybe<Voting_Tokens_Sum_Fields>;
  var_pop?: Maybe<Voting_Tokens_Var_Pop_Fields>;
  var_samp?: Maybe<Voting_Tokens_Var_Samp_Fields>;
  variance?: Maybe<Voting_Tokens_Variance_Fields>;
};


/** aggregate fields of "voting_tokens" */
export type Voting_Tokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Voting_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Voting_Tokens_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Voting_Tokens_Avg_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "voting_tokens". All fields are combined with a logical 'AND'. */
export type Voting_Tokens_Bool_Exp = {
  _and?: InputMaybe<Array<Voting_Tokens_Bool_Exp>>;
  _not?: InputMaybe<Voting_Tokens_Bool_Exp>;
  _or?: InputMaybe<Array<Voting_Tokens_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ip_address?: InputMaybe<Inet_Comparison_Exp>;
  is_used?: InputMaybe<Boolean_Comparison_Exp>;
  is_verified?: InputMaybe<Boolean_Comparison_Exp>;
  max_usage_attempts?: InputMaybe<Int_Comparison_Exp>;
  max_verification_attempts?: InputMaybe<Int_Comparison_Exp>;
  member_id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  token?: InputMaybe<String_Comparison_Exp>;
  token_type?: InputMaybe<String_Comparison_Exp>;
  usage_attempts?: InputMaybe<Int_Comparison_Exp>;
  used_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_agent?: InputMaybe<String_Comparison_Exp>;
  verification_attempts?: InputMaybe<Int_Comparison_Exp>;
  verification_code?: InputMaybe<String_Comparison_Exp>;
  verified_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  vote_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "voting_tokens" */
export enum Voting_Tokens_Constraint {
  /** unique or primary key constraint on columns "id" */
  VotingTokensPkey = 'voting_tokens_pkey',
  /** unique or primary key constraint on columns "token" */
  VotingTokensTokenKey = 'voting_tokens_token_key',
  /** unique or primary key constraint on columns "member_id", "vote_id" */
  VotingTokensVoteIdMemberIdKey = 'voting_tokens_vote_id_member_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Voting_Tokens_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Voting_Tokens_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Voting_Tokens_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "voting_tokens" */
export type Voting_Tokens_Inc_Input = {
  max_usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  max_verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  verification_attempts?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "voting_tokens" */
export type Voting_Tokens_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_used?: InputMaybe<Scalars['Boolean']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  max_usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  max_verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_type?: InputMaybe<Scalars['String']['input']>;
  usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  used_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  verification_code?: InputMaybe<Scalars['String']['input']>;
  verified_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Voting_Tokens_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  max_usage_attempts?: Maybe<Scalars['Int']['output']>;
  max_verification_attempts?: Maybe<Scalars['Int']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  token_type?: Maybe<Scalars['String']['output']>;
  usage_attempts?: Maybe<Scalars['Int']['output']>;
  used_at?: Maybe<Scalars['timestamptz']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  verification_attempts?: Maybe<Scalars['Int']['output']>;
  verification_code?: Maybe<Scalars['String']['output']>;
  verified_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Voting_Tokens_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  max_usage_attempts?: Maybe<Scalars['Int']['output']>;
  max_verification_attempts?: Maybe<Scalars['Int']['output']>;
  member_id?: Maybe<Scalars['uuid']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  token_type?: Maybe<Scalars['String']['output']>;
  usage_attempts?: Maybe<Scalars['Int']['output']>;
  used_at?: Maybe<Scalars['timestamptz']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
  verification_attempts?: Maybe<Scalars['Int']['output']>;
  verification_code?: Maybe<Scalars['String']['output']>;
  verified_at?: Maybe<Scalars['timestamptz']['output']>;
  vote_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "voting_tokens" */
export type Voting_Tokens_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Voting_Tokens>;
};

/** on_conflict condition type for table "voting_tokens" */
export type Voting_Tokens_On_Conflict = {
  constraint: Voting_Tokens_Constraint;
  update_columns?: Array<Voting_Tokens_Update_Column>;
  where?: InputMaybe<Voting_Tokens_Bool_Exp>;
};

/** Ordering options when selecting data from "voting_tokens". */
export type Voting_Tokens_Order_By = {
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ip_address?: InputMaybe<Order_By>;
  is_used?: InputMaybe<Order_By>;
  is_verified?: InputMaybe<Order_By>;
  max_usage_attempts?: InputMaybe<Order_By>;
  max_verification_attempts?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  token_type?: InputMaybe<Order_By>;
  usage_attempts?: InputMaybe<Order_By>;
  used_at?: InputMaybe<Order_By>;
  user_agent?: InputMaybe<Order_By>;
  verification_attempts?: InputMaybe<Order_By>;
  verification_code?: InputMaybe<Order_By>;
  verified_at?: InputMaybe<Order_By>;
  vote_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: voting_tokens */
export type Voting_Tokens_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Voting_Tokens_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "voting_tokens" */
export enum Voting_Tokens_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  IsUsed = 'is_used',
  /** column name */
  IsVerified = 'is_verified',
  /** column name */
  MaxUsageAttempts = 'max_usage_attempts',
  /** column name */
  MaxVerificationAttempts = 'max_verification_attempts',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Token = 'token',
  /** column name */
  TokenType = 'token_type',
  /** column name */
  UsageAttempts = 'usage_attempts',
  /** column name */
  UsedAt = 'used_at',
  /** column name */
  UserAgent = 'user_agent',
  /** column name */
  VerificationAttempts = 'verification_attempts',
  /** column name */
  VerificationCode = 'verification_code',
  /** column name */
  VerifiedAt = 'verified_at',
  /** column name */
  VoteId = 'vote_id'
}

/** input type for updating data in table "voting_tokens" */
export type Voting_Tokens_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_used?: InputMaybe<Scalars['Boolean']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  max_usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  max_verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_type?: InputMaybe<Scalars['String']['input']>;
  usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  used_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  verification_code?: InputMaybe<Scalars['String']['input']>;
  verified_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Voting_Tokens_Stddev_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Voting_Tokens_Stddev_Pop_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Voting_Tokens_Stddev_Samp_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "voting_tokens" */
export type Voting_Tokens_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Voting_Tokens_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Voting_Tokens_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ip_address?: InputMaybe<Scalars['inet']['input']>;
  is_used?: InputMaybe<Scalars['Boolean']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  max_usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  max_verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_type?: InputMaybe<Scalars['String']['input']>;
  usage_attempts?: InputMaybe<Scalars['Int']['input']>;
  used_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
  verification_attempts?: InputMaybe<Scalars['Int']['input']>;
  verification_code?: InputMaybe<Scalars['String']['input']>;
  verified_at?: InputMaybe<Scalars['timestamptz']['input']>;
  vote_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Voting_Tokens_Sum_Fields = {
  max_usage_attempts?: Maybe<Scalars['Int']['output']>;
  max_verification_attempts?: Maybe<Scalars['Int']['output']>;
  usage_attempts?: Maybe<Scalars['Int']['output']>;
  verification_attempts?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "voting_tokens" */
export enum Voting_Tokens_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  Id = 'id',
  /** column name */
  IpAddress = 'ip_address',
  /** column name */
  IsUsed = 'is_used',
  /** column name */
  IsVerified = 'is_verified',
  /** column name */
  MaxUsageAttempts = 'max_usage_attempts',
  /** column name */
  MaxVerificationAttempts = 'max_verification_attempts',
  /** column name */
  MemberId = 'member_id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Token = 'token',
  /** column name */
  TokenType = 'token_type',
  /** column name */
  UsageAttempts = 'usage_attempts',
  /** column name */
  UsedAt = 'used_at',
  /** column name */
  UserAgent = 'user_agent',
  /** column name */
  VerificationAttempts = 'verification_attempts',
  /** column name */
  VerificationCode = 'verification_code',
  /** column name */
  VerifiedAt = 'verified_at',
  /** column name */
  VoteId = 'vote_id'
}

export type Voting_Tokens_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Voting_Tokens_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Voting_Tokens_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Voting_Tokens_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Voting_Tokens_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Voting_Tokens_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Voting_Tokens_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Voting_Tokens_Set_Input>;
  /** filter the rows which have to be updated */
  where: Voting_Tokens_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Voting_Tokens_Var_Pop_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Voting_Tokens_Var_Samp_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Voting_Tokens_Variance_Fields = {
  max_usage_attempts?: Maybe<Scalars['Float']['output']>;
  max_verification_attempts?: Maybe<Scalars['Float']['output']>;
  usage_attempts?: Maybe<Scalars['Float']['output']>;
  verification_attempts?: Maybe<Scalars['Float']['output']>;
};

export type GetBuildingsForManagerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingsForManagerQuery = { buildings: Array<{ id: string, name: string, address: string, total_units: number, variables?: any | null }> };

export type DeleteBuildingMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteBuildingMutation = { delete_buildings_by_pk?: { id: string } | null };

export type StartVoteFromCardMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type StartVoteFromCardMutation = { update_votes_by_pk?: { id: string, status: string, start_date?: string | null } | null };

export type GetVoteDetailsForViewQueryVariables = Exact<{
  voteId: Scalars['uuid']['input'];
}>;


export type GetVoteDetailsForViewQuery = { vote?: { id: string, title: string, description?: string | null, status: string, start_date?: string | null, end_date?: string | null, created_at?: string | null, building_id: string, questions?: any | null, observers?: Array<string> | null } | null };

export type AttachmentFieldsFragment = { id: string, vote_id: string, member_id: string, attachment_name: string, created_at?: string | null };

export type GetVoteAttachmentsQueryVariables = Exact<{
  voteId: Scalars['uuid']['input'];
}>;


export type GetVoteAttachmentsQuery = { manual_vote_attachments: Array<{ member_id: string, id: string, vote_id: string, attachment_name: string, created_at?: string | null }> };

export type AddVoteAttachmentMutationVariables = Exact<{
  attachment: Manual_Vote_Attachments_Insert_Input;
}>;


export type AddVoteAttachmentMutation = { insert_manual_vote_attachments_one?: { id: string, vote_id: string, member_id: string, attachment_name: string, created_at?: string | null } | null };

export type RemoveVoteAttachmentMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type RemoveVoteAttachmentMutation = { delete_manual_vote_attachments_by_pk?: { id: string } | null };

export type BuildingVariableFieldsFragment = { name: string, building_id: string, description: string, value: string, created_at?: string | null, updated_at?: string | null };

export type GetBuildingVariablesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingVariablesQuery = { building_variables: Array<{ name: string, building_id: string, description: string, value: string, created_at?: string | null, updated_at?: string | null }> };

export type AddBuildingVariableMutationVariables = Exact<{
  variable: Building_Variables_Insert_Input;
}>;


export type AddBuildingVariableMutation = { insert_building_variables_one?: { name: string, building_id: string, description: string, value: string, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateBuildingVariableMutationVariables = Exact<{
  name: Scalars['String']['input'];
  building_id: Scalars['uuid']['input'];
  variable: Building_Variables_Set_Input;
}>;


export type UpdateBuildingVariableMutation = { update_building_variables_by_pk?: { name: string, building_id: string, description: string, value: string, created_at?: string | null, updated_at?: string | null } | null };

export type DeleteBuildingVariableMutationVariables = Exact<{
  name: Scalars['String']['input'];
  building_id: Scalars['uuid']['input'];
}>;


export type DeleteBuildingVariableMutation = { delete_building_variables_by_pk?: { name: string, building_id: string } | null };

export type GetBuildingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingsQuery = { buildings: Array<{ id: string, name: string, address: string, created_at?: string | null, updated_at?: string | null }> };

export type CreateBuildingMutationVariables = Exact<{
  name: Scalars['String']['input'];
  address: Scalars['String']['input'];
  total_units: Scalars['Int']['input'];
  variables?: InputMaybe<Scalars['jsonb']['input']>;
}>;


export type CreateBuildingMutation = { insert_buildings_one?: { id: string, name: string, address: string, total_units: number, variables?: any | null } | null };

export type UpdateBuildingMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  name: Scalars['String']['input'];
  address: Scalars['String']['input'];
  total_units: Scalars['Int']['input'];
  variables?: InputMaybe<Scalars['jsonb']['input']>;
}>;


export type UpdateBuildingMutation = { update_buildings_by_pk?: { id: string, name: string, address: string, total_units: number, variables?: any | null } | null };

export type DocumentTemplateFieldsFragment = { id: string, name: string, body: string, help_text?: string | null, is_global: boolean, building_id?: string | null, created_at: string, updated_at: string };

export type GetDocumentTemplatesQueryVariables = Exact<{
  buildingId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type GetDocumentTemplatesQuery = { document_templates: Array<{ id: string, name: string, body: string, help_text?: string | null, is_global: boolean, building_id?: string | null, created_at: string, updated_at: string }> };

export type AddDocumentTemplateMutationVariables = Exact<{
  template: Document_Templates_Insert_Input;
}>;


export type AddDocumentTemplateMutation = { insert_document_templates_one?: { id: string, name: string, body: string, help_text?: string | null, is_global: boolean, building_id?: string | null, created_at: string, updated_at: string } | null };

export type UpdateDocumentTemplateMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  template: Document_Templates_Set_Input;
}>;


export type UpdateDocumentTemplateMutation = { update_document_templates_by_pk?: { id: string, name: string, body: string, help_text?: string | null, is_global: boolean, building_id?: string | null, created_at: string, updated_at: string } | null };

export type DeleteDocumentTemplateMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteDocumentTemplateMutation = { delete_document_templates_by_pk?: { id: string } | null };

export type VoteFieldsFragment = { id: string, title: string, description?: string | null, status: string, start_date?: string | null, end_date?: string | null, created_at?: string | null, building_id: string, questions?: any | null, observers?: Array<string> | null };

export type GlobalVariableFieldsV2Fragment = { name: string, value: string, description: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null };

export type GetGlobalVariablesV2QueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalVariablesV2Query = { global_variables: Array<{ name: string, value: string, description: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null }> };

export type GetAllGlobalVariablesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGlobalVariablesQuery = { global_variables: Array<{ name: string, value: string, description: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null }> };

export type AddGlobalVariableMutationVariables = Exact<{
  variable: Global_Variables_Insert_Input;
}>;


export type AddGlobalVariableMutation = { insert_global_variables_one?: { name: string, value: string, description: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateGlobalVariableV2MutationVariables = Exact<{
  name: Scalars['String']['input'];
  variable: Global_Variables_Set_Input;
}>;


export type UpdateGlobalVariableV2Mutation = { update_global_variables_by_pk?: { name: string, value: string, description: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateGlobalVariablesMutationVariables = Exact<{
  updates: Array<Global_Variables_Insert_Input> | Global_Variables_Insert_Input;
}>;


export type UpdateGlobalVariablesMutation = { insert_global_variables?: { affected_rows: number, returning: Array<{ name: string, value: string, description: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null }> } | null };

export type DeleteGlobalVariableMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type DeleteGlobalVariableMutation = { delete_global_variables_by_pk?: { name: string } | null };

export type GlobalVariableFieldsFragment = { name: string, description: string, value: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null };

export type GetGlobalVariablesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalVariablesQuery = { global_variables: Array<{ name: string, description: string, value: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null }> };

export type UpdateGlobalVariableMutationVariables = Exact<{
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;


export type UpdateGlobalVariableMutation = { update_global_variables_by_pk?: { name: string, description: string, value: string, is_editable?: boolean | null, created_at?: string | null, updated_at?: string | null } | null };

export type GetMembersQueryVariables = Exact<{
  buildingId: Scalars['uuid']['input'];
}>;


export type GetMembersQuery = { members: Array<{ id: string, name: string, email: string, phone?: string | null, unit: string, vote_weight?: any | null, representative_id?: string | null, created_at?: string | null, updated_at?: string | null }> };

export type AddMemberMutationVariables = Exact<{
  member: Members_Insert_Input;
}>;


export type AddMemberMutation = { insert_members_one?: { id: string } | null };

export type UpdateMemberMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  changes: Members_Set_Input;
}>;


export type UpdateMemberMutation = { update_members_by_pk?: { id: string } | null };

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteMemberMutation = { delete_members_by_pk?: { id: string } | null };

export type AddManualVoteMutationVariables = Exact<{
  vote_id: Scalars['uuid']['input'];
  member_id: Scalars['uuid']['input'];
  answer: Scalars['String']['input'];
}>;


export type AddManualVoteMutation = { insert_member_votes_one?: { id: string } | null };

export type SetVoteRepresentativeMutationVariables = Exact<{
  vote_id: Scalars['uuid']['input'];
  representative_id?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type SetVoteRepresentativeMutation = { update_members_by_pk?: { id: string, representative_id?: string | null } | null };

export type StartVoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type StartVoteMutation = { update_votes_by_pk?: { id: string, status: string } | null };

export type AddObserverToVoteMutationVariables = Exact<{
  vote_id: Scalars['uuid']['input'];
  observers: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddObserverToVoteMutation = { update_votes_by_pk?: { id: string, observers?: Array<string> | null } | null };

export type RemoveObserverFromVoteMutationVariables = Exact<{
  vote_id: Scalars['uuid']['input'];
  observers: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RemoveObserverFromVoteMutation = { update_votes_by_pk?: { id: string, observers?: Array<string> | null } | null };

export type CreateObserverMutationVariables = Exact<{
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  building_id: Scalars['uuid']['input'];
}>;


export type CreateObserverMutation = { insert_observers_one?: { id: string, name: string, email: string } | null };

export type DeleteObserverMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteObserverMutation = { delete_observers_by_pk?: { id: string } | null };

export type GetBuildingsFromQueriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingsFromQueriesQuery = { buildings: Array<{ id: string, name: string, address: string, total_units: number, created_at?: string | null, updated_at?: string | null }> };

export type GetVoteDetailsQueryVariables = Exact<{
  voteId: Scalars['uuid']['input'];
  buildingId: Scalars['uuid']['input'];
}>;


export type GetVoteDetailsQuery = { votes_by_pk?: { id: string, title: string, description?: string | null, start_date?: string | null, end_date?: string | null, status: string, created_at?: string | null, building_id: string, questions?: any | null, observers?: Array<string> | null } | null, member_votes_aggregate: { aggregate?: { count: number } | null, nodes: Array<{ id: string, member_id: string, answer?: string | null, vote_id: string }> }, members: Array<{ id: string, name: string, email: string, phone?: string | null, unit: string, vote_weight?: any | null, representative_id?: string | null }> };

export type GetBuildingsForTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildingsForTemplatesQuery = { buildings: Array<{ id: string, name: string }> };

export type GetDataForInvitationModalQueryVariables = Exact<{
  buildingId: Scalars['uuid']['input'];
}>;


export type GetDataForInvitationModalQuery = { building?: { id: string, name: string, address: string } | null, members: Array<{ id: string, name: string, email: string, vote_weight?: any | null }>, email_templates: Array<{ id: string, name: string, subject: string, body: string, is_global?: boolean | null }>, global_variables: Array<{ name: string, value: string, description: string, is_editable?: boolean | null }> };

export type GetMembersByBuildingIdQueryVariables = Exact<{
  buildingId: Scalars['uuid']['input'];
}>;


export type GetMembersByBuildingIdQuery = { members: Array<{ id: string, name: string, email: string, phone?: string | null, unit: string, vote_weight?: any | null, representative_id?: string | null }> };

export type GetObserversByBuildingIdQueryVariables = Exact<{
  buildingId: Scalars['uuid']['input'];
}>;


export type GetObserversByBuildingIdQuery = { observers: Array<{ id: string, name: string, email: string }> };

export type EmailTemplateFieldsFragment = { id: string, name: string, subject: string, body: string, variables?: any | null, is_global?: boolean | null, building_id?: string | null, created_at?: string | null, updated_at?: string | null };

export type GetEmailTemplatesQueryVariables = Exact<{
  buildingId?: InputMaybe<Scalars['uuid']['input']>;
}>;


export type GetEmailTemplatesQuery = { email_templates: Array<{ id: string, name: string, subject: string, body: string, variables?: any | null, is_global?: boolean | null, building_id?: string | null, created_at?: string | null, updated_at?: string | null }> };

export type AddEmailTemplateMutationVariables = Exact<{
  template: Email_Templates_Insert_Input;
}>;


export type AddEmailTemplateMutation = { insert_email_templates_one?: { id: string, name: string, subject: string, body: string, variables?: any | null, is_global?: boolean | null, building_id?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateEmailTemplateMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  template: Email_Templates_Set_Input;
}>;


export type UpdateEmailTemplateMutation = { update_email_templates_by_pk?: { id: string, name: string, subject: string, body: string, variables?: any | null, is_global?: boolean | null, building_id?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type DeleteEmailTemplateMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteEmailTemplateMutation = { delete_email_templates_by_pk?: { id: string } | null };

export type GetVotesQueryVariables = Exact<{
  buildingId: Scalars['uuid']['input'];
}>;


export type GetVotesQuery = { votes: Array<{ id: string, title: string, description?: string | null, status: string, start_date?: string | null, end_date?: string | null, created_at?: string | null, building_id: string }>, members_aggregate: { aggregate?: { count: number } | null } };

export type AddVoteMutationVariables = Exact<{
  vote: Votes_Insert_Input;
}>;


export type AddVoteMutation = { insert_votes_one?: { id: string } | null };

export type UpdateVoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  vote: Votes_Set_Input;
}>;


export type UpdateVoteMutation = { update_votes_by_pk?: { id: string, title: string, description?: string | null, status: string, start_date?: string | null, end_date?: string | null, building_id: string, questions?: any | null } | null };

export type CancelVoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type CancelVoteMutation = { update_votes_by_pk?: { id: string } | null };

export type DeleteVoteMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type DeleteVoteMutation = { delete_votes_by_pk?: { id: string } | null };

export const AttachmentFieldsFragmentDoc = gql`
    fragment AttachmentFields on manual_vote_attachments {
  id
  vote_id
  member_id
  attachment_name
  created_at
}
    `;
export const BuildingVariableFieldsFragmentDoc = gql`
    fragment BuildingVariableFields on building_variables {
  name
  building_id
  description
  value
  created_at
  updated_at
}
    `;
export const DocumentTemplateFieldsFragmentDoc = gql`
    fragment DocumentTemplateFields on document_templates {
  id
  name
  body
  help_text
  is_global
  building_id
  created_at
  updated_at
}
    `;
export const VoteFieldsFragmentDoc = gql`
    fragment VoteFields on votes {
  id
  title
  description
  status
  start_date
  end_date
  created_at
  building_id
  questions
  observers
}
    `;
export const GlobalVariableFieldsV2FragmentDoc = gql`
    fragment GlobalVariableFieldsV2 on global_variables {
  name
  value
  description
  is_editable
  created_at
  updated_at
}
    `;
export const GlobalVariableFieldsFragmentDoc = gql`
    fragment GlobalVariableFields on global_variables {
  name
  description
  value
  is_editable
  created_at
  updated_at
}
    `;
export const EmailTemplateFieldsFragmentDoc = gql`
    fragment EmailTemplateFields on email_templates {
  id
  name
  subject
  body
  variables
  is_global
  building_id
  created_at
  updated_at
}
    `;
export const GetBuildingsForManagerDocument = gql`
    query GetBuildingsForManager {
  buildings {
    id
    name
    address
    total_units
    variables
  }
}
    `;

/**
 * __useGetBuildingsForManagerQuery__
 *
 * To run a query within a React component, call `useGetBuildingsForManagerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingsForManagerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingsForManagerQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBuildingsForManagerQuery(baseOptions?: Apollo.QueryHookOptions<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>(GetBuildingsForManagerDocument, options);
      }
export function useGetBuildingsForManagerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>(GetBuildingsForManagerDocument, options);
        }
export function useGetBuildingsForManagerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>(GetBuildingsForManagerDocument, options);
        }
export type GetBuildingsForManagerQueryHookResult = ReturnType<typeof useGetBuildingsForManagerQuery>;
export type GetBuildingsForManagerLazyQueryHookResult = ReturnType<typeof useGetBuildingsForManagerLazyQuery>;
export type GetBuildingsForManagerSuspenseQueryHookResult = ReturnType<typeof useGetBuildingsForManagerSuspenseQuery>;
export type GetBuildingsForManagerQueryResult = Apollo.QueryResult<GetBuildingsForManagerQuery, GetBuildingsForManagerQueryVariables>;
export const DeleteBuildingDocument = gql`
    mutation DeleteBuilding($id: uuid!) {
  delete_buildings_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteBuildingMutationFn = Apollo.MutationFunction<DeleteBuildingMutation, DeleteBuildingMutationVariables>;

/**
 * __useDeleteBuildingMutation__
 *
 * To run a mutation, you first call `useDeleteBuildingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBuildingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBuildingMutation, { data, loading, error }] = useDeleteBuildingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBuildingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBuildingMutation, DeleteBuildingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBuildingMutation, DeleteBuildingMutationVariables>(DeleteBuildingDocument, options);
      }
export type DeleteBuildingMutationHookResult = ReturnType<typeof useDeleteBuildingMutation>;
export type DeleteBuildingMutationResult = Apollo.MutationResult<DeleteBuildingMutation>;
export type DeleteBuildingMutationOptions = Apollo.BaseMutationOptions<DeleteBuildingMutation, DeleteBuildingMutationVariables>;
export const StartVoteFromCardDocument = gql`
    mutation StartVoteFromCard($id: uuid!) {
  update_votes_by_pk(
    pk_columns: {id: $id}
    _set: {status: "active", start_date: "now()"}
  ) {
    id
    status
    start_date
  }
}
    `;
export type StartVoteFromCardMutationFn = Apollo.MutationFunction<StartVoteFromCardMutation, StartVoteFromCardMutationVariables>;

/**
 * __useStartVoteFromCardMutation__
 *
 * To run a mutation, you first call `useStartVoteFromCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartVoteFromCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startVoteFromCardMutation, { data, loading, error }] = useStartVoteFromCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStartVoteFromCardMutation(baseOptions?: Apollo.MutationHookOptions<StartVoteFromCardMutation, StartVoteFromCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartVoteFromCardMutation, StartVoteFromCardMutationVariables>(StartVoteFromCardDocument, options);
      }
export type StartVoteFromCardMutationHookResult = ReturnType<typeof useStartVoteFromCardMutation>;
export type StartVoteFromCardMutationResult = Apollo.MutationResult<StartVoteFromCardMutation>;
export type StartVoteFromCardMutationOptions = Apollo.BaseMutationOptions<StartVoteFromCardMutation, StartVoteFromCardMutationVariables>;
export const GetVoteDetailsForViewDocument = gql`
    query GetVoteDetailsForView($voteId: uuid!) {
  vote: votes_by_pk(id: $voteId) {
    ...VoteFields
  }
}
    ${VoteFieldsFragmentDoc}`;

/**
 * __useGetVoteDetailsForViewQuery__
 *
 * To run a query within a React component, call `useGetVoteDetailsForViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoteDetailsForViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoteDetailsForViewQuery({
 *   variables: {
 *      voteId: // value for 'voteId'
 *   },
 * });
 */
export function useGetVoteDetailsForViewQuery(baseOptions: Apollo.QueryHookOptions<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables> & ({ variables: GetVoteDetailsForViewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables>(GetVoteDetailsForViewDocument, options);
      }
export function useGetVoteDetailsForViewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables>(GetVoteDetailsForViewDocument, options);
        }
export function useGetVoteDetailsForViewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables>(GetVoteDetailsForViewDocument, options);
        }
export type GetVoteDetailsForViewQueryHookResult = ReturnType<typeof useGetVoteDetailsForViewQuery>;
export type GetVoteDetailsForViewLazyQueryHookResult = ReturnType<typeof useGetVoteDetailsForViewLazyQuery>;
export type GetVoteDetailsForViewSuspenseQueryHookResult = ReturnType<typeof useGetVoteDetailsForViewSuspenseQuery>;
export type GetVoteDetailsForViewQueryResult = Apollo.QueryResult<GetVoteDetailsForViewQuery, GetVoteDetailsForViewQueryVariables>;
export const GetVoteAttachmentsDocument = gql`
    query GetVoteAttachments($voteId: uuid!) {
  manual_vote_attachments(where: {vote_id: {_eq: $voteId}}) {
    ...AttachmentFields
    member_id
  }
}
    ${AttachmentFieldsFragmentDoc}`;

/**
 * __useGetVoteAttachmentsQuery__
 *
 * To run a query within a React component, call `useGetVoteAttachmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoteAttachmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoteAttachmentsQuery({
 *   variables: {
 *      voteId: // value for 'voteId'
 *   },
 * });
 */
export function useGetVoteAttachmentsQuery(baseOptions: Apollo.QueryHookOptions<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables> & ({ variables: GetVoteAttachmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables>(GetVoteAttachmentsDocument, options);
      }
export function useGetVoteAttachmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables>(GetVoteAttachmentsDocument, options);
        }
export function useGetVoteAttachmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables>(GetVoteAttachmentsDocument, options);
        }
export type GetVoteAttachmentsQueryHookResult = ReturnType<typeof useGetVoteAttachmentsQuery>;
export type GetVoteAttachmentsLazyQueryHookResult = ReturnType<typeof useGetVoteAttachmentsLazyQuery>;
export type GetVoteAttachmentsSuspenseQueryHookResult = ReturnType<typeof useGetVoteAttachmentsSuspenseQuery>;
export type GetVoteAttachmentsQueryResult = Apollo.QueryResult<GetVoteAttachmentsQuery, GetVoteAttachmentsQueryVariables>;
export const AddVoteAttachmentDocument = gql`
    mutation AddVoteAttachment($attachment: manual_vote_attachments_insert_input!) {
  insert_manual_vote_attachments_one(object: $attachment) {
    ...AttachmentFields
  }
}
    ${AttachmentFieldsFragmentDoc}`;
export type AddVoteAttachmentMutationFn = Apollo.MutationFunction<AddVoteAttachmentMutation, AddVoteAttachmentMutationVariables>;

/**
 * __useAddVoteAttachmentMutation__
 *
 * To run a mutation, you first call `useAddVoteAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddVoteAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addVoteAttachmentMutation, { data, loading, error }] = useAddVoteAttachmentMutation({
 *   variables: {
 *      attachment: // value for 'attachment'
 *   },
 * });
 */
export function useAddVoteAttachmentMutation(baseOptions?: Apollo.MutationHookOptions<AddVoteAttachmentMutation, AddVoteAttachmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddVoteAttachmentMutation, AddVoteAttachmentMutationVariables>(AddVoteAttachmentDocument, options);
      }
export type AddVoteAttachmentMutationHookResult = ReturnType<typeof useAddVoteAttachmentMutation>;
export type AddVoteAttachmentMutationResult = Apollo.MutationResult<AddVoteAttachmentMutation>;
export type AddVoteAttachmentMutationOptions = Apollo.BaseMutationOptions<AddVoteAttachmentMutation, AddVoteAttachmentMutationVariables>;
export const RemoveVoteAttachmentDocument = gql`
    mutation RemoveVoteAttachment($id: uuid!) {
  delete_manual_vote_attachments_by_pk(id: $id) {
    id
  }
}
    `;
export type RemoveVoteAttachmentMutationFn = Apollo.MutationFunction<RemoveVoteAttachmentMutation, RemoveVoteAttachmentMutationVariables>;

/**
 * __useRemoveVoteAttachmentMutation__
 *
 * To run a mutation, you first call `useRemoveVoteAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveVoteAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeVoteAttachmentMutation, { data, loading, error }] = useRemoveVoteAttachmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveVoteAttachmentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveVoteAttachmentMutation, RemoveVoteAttachmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveVoteAttachmentMutation, RemoveVoteAttachmentMutationVariables>(RemoveVoteAttachmentDocument, options);
      }
export type RemoveVoteAttachmentMutationHookResult = ReturnType<typeof useRemoveVoteAttachmentMutation>;
export type RemoveVoteAttachmentMutationResult = Apollo.MutationResult<RemoveVoteAttachmentMutation>;
export type RemoveVoteAttachmentMutationOptions = Apollo.BaseMutationOptions<RemoveVoteAttachmentMutation, RemoveVoteAttachmentMutationVariables>;
export const GetBuildingVariablesDocument = gql`
    query GetBuildingVariables {
  building_variables(order_by: {description: asc}) {
    ...BuildingVariableFields
  }
}
    ${BuildingVariableFieldsFragmentDoc}`;

/**
 * __useGetBuildingVariablesQuery__
 *
 * To run a query within a React component, call `useGetBuildingVariablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingVariablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingVariablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBuildingVariablesQuery(baseOptions?: Apollo.QueryHookOptions<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>(GetBuildingVariablesDocument, options);
      }
export function useGetBuildingVariablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>(GetBuildingVariablesDocument, options);
        }
export function useGetBuildingVariablesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>(GetBuildingVariablesDocument, options);
        }
export type GetBuildingVariablesQueryHookResult = ReturnType<typeof useGetBuildingVariablesQuery>;
export type GetBuildingVariablesLazyQueryHookResult = ReturnType<typeof useGetBuildingVariablesLazyQuery>;
export type GetBuildingVariablesSuspenseQueryHookResult = ReturnType<typeof useGetBuildingVariablesSuspenseQuery>;
export type GetBuildingVariablesQueryResult = Apollo.QueryResult<GetBuildingVariablesQuery, GetBuildingVariablesQueryVariables>;
export const AddBuildingVariableDocument = gql`
    mutation AddBuildingVariable($variable: building_variables_insert_input!) {
  insert_building_variables_one(object: $variable) {
    ...BuildingVariableFields
  }
}
    ${BuildingVariableFieldsFragmentDoc}`;
export type AddBuildingVariableMutationFn = Apollo.MutationFunction<AddBuildingVariableMutation, AddBuildingVariableMutationVariables>;

/**
 * __useAddBuildingVariableMutation__
 *
 * To run a mutation, you first call `useAddBuildingVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBuildingVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBuildingVariableMutation, { data, loading, error }] = useAddBuildingVariableMutation({
 *   variables: {
 *      variable: // value for 'variable'
 *   },
 * });
 */
export function useAddBuildingVariableMutation(baseOptions?: Apollo.MutationHookOptions<AddBuildingVariableMutation, AddBuildingVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBuildingVariableMutation, AddBuildingVariableMutationVariables>(AddBuildingVariableDocument, options);
      }
export type AddBuildingVariableMutationHookResult = ReturnType<typeof useAddBuildingVariableMutation>;
export type AddBuildingVariableMutationResult = Apollo.MutationResult<AddBuildingVariableMutation>;
export type AddBuildingVariableMutationOptions = Apollo.BaseMutationOptions<AddBuildingVariableMutation, AddBuildingVariableMutationVariables>;
export const UpdateBuildingVariableDocument = gql`
    mutation UpdateBuildingVariable($name: String!, $building_id: uuid!, $variable: building_variables_set_input!) {
  update_building_variables_by_pk(
    pk_columns: {name: $name, building_id: $building_id}
    _set: $variable
  ) {
    ...BuildingVariableFields
  }
}
    ${BuildingVariableFieldsFragmentDoc}`;
export type UpdateBuildingVariableMutationFn = Apollo.MutationFunction<UpdateBuildingVariableMutation, UpdateBuildingVariableMutationVariables>;

/**
 * __useUpdateBuildingVariableMutation__
 *
 * To run a mutation, you first call `useUpdateBuildingVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBuildingVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBuildingVariableMutation, { data, loading, error }] = useUpdateBuildingVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *      building_id: // value for 'building_id'
 *      variable: // value for 'variable'
 *   },
 * });
 */
export function useUpdateBuildingVariableMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBuildingVariableMutation, UpdateBuildingVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBuildingVariableMutation, UpdateBuildingVariableMutationVariables>(UpdateBuildingVariableDocument, options);
      }
export type UpdateBuildingVariableMutationHookResult = ReturnType<typeof useUpdateBuildingVariableMutation>;
export type UpdateBuildingVariableMutationResult = Apollo.MutationResult<UpdateBuildingVariableMutation>;
export type UpdateBuildingVariableMutationOptions = Apollo.BaseMutationOptions<UpdateBuildingVariableMutation, UpdateBuildingVariableMutationVariables>;
export const DeleteBuildingVariableDocument = gql`
    mutation DeleteBuildingVariable($name: String!, $building_id: uuid!) {
  delete_building_variables_by_pk(name: $name, building_id: $building_id) {
    name
    building_id
  }
}
    `;
export type DeleteBuildingVariableMutationFn = Apollo.MutationFunction<DeleteBuildingVariableMutation, DeleteBuildingVariableMutationVariables>;

/**
 * __useDeleteBuildingVariableMutation__
 *
 * To run a mutation, you first call `useDeleteBuildingVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBuildingVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBuildingVariableMutation, { data, loading, error }] = useDeleteBuildingVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *      building_id: // value for 'building_id'
 *   },
 * });
 */
export function useDeleteBuildingVariableMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBuildingVariableMutation, DeleteBuildingVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBuildingVariableMutation, DeleteBuildingVariableMutationVariables>(DeleteBuildingVariableDocument, options);
      }
export type DeleteBuildingVariableMutationHookResult = ReturnType<typeof useDeleteBuildingVariableMutation>;
export type DeleteBuildingVariableMutationResult = Apollo.MutationResult<DeleteBuildingVariableMutation>;
export type DeleteBuildingVariableMutationOptions = Apollo.BaseMutationOptions<DeleteBuildingVariableMutation, DeleteBuildingVariableMutationVariables>;
export const GetBuildingsDocument = gql`
    query GetBuildings {
  buildings(order_by: {name: asc}) {
    id
    name
    address
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetBuildingsQuery__
 *
 * To run a query within a React component, call `useGetBuildingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBuildingsQuery(baseOptions?: Apollo.QueryHookOptions<GetBuildingsQuery, GetBuildingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBuildingsQuery, GetBuildingsQueryVariables>(GetBuildingsDocument, options);
      }
export function useGetBuildingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBuildingsQuery, GetBuildingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBuildingsQuery, GetBuildingsQueryVariables>(GetBuildingsDocument, options);
        }
export function useGetBuildingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBuildingsQuery, GetBuildingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBuildingsQuery, GetBuildingsQueryVariables>(GetBuildingsDocument, options);
        }
export type GetBuildingsQueryHookResult = ReturnType<typeof useGetBuildingsQuery>;
export type GetBuildingsLazyQueryHookResult = ReturnType<typeof useGetBuildingsLazyQuery>;
export type GetBuildingsSuspenseQueryHookResult = ReturnType<typeof useGetBuildingsSuspenseQuery>;
export type GetBuildingsQueryResult = Apollo.QueryResult<GetBuildingsQuery, GetBuildingsQueryVariables>;
export const CreateBuildingDocument = gql`
    mutation CreateBuilding($name: String!, $address: String!, $total_units: Int!, $variables: jsonb) {
  insert_buildings_one(
    object: {name: $name, address: $address, total_units: $total_units, variables: $variables}
  ) {
    id
    name
    address
    total_units
    variables
  }
}
    `;
export type CreateBuildingMutationFn = Apollo.MutationFunction<CreateBuildingMutation, CreateBuildingMutationVariables>;

/**
 * __useCreateBuildingMutation__
 *
 * To run a mutation, you first call `useCreateBuildingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBuildingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBuildingMutation, { data, loading, error }] = useCreateBuildingMutation({
 *   variables: {
 *      name: // value for 'name'
 *      address: // value for 'address'
 *      total_units: // value for 'total_units'
 *      variables: // value for 'variables'
 *   },
 * });
 */
export function useCreateBuildingMutation(baseOptions?: Apollo.MutationHookOptions<CreateBuildingMutation, CreateBuildingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBuildingMutation, CreateBuildingMutationVariables>(CreateBuildingDocument, options);
      }
export type CreateBuildingMutationHookResult = ReturnType<typeof useCreateBuildingMutation>;
export type CreateBuildingMutationResult = Apollo.MutationResult<CreateBuildingMutation>;
export type CreateBuildingMutationOptions = Apollo.BaseMutationOptions<CreateBuildingMutation, CreateBuildingMutationVariables>;
export const UpdateBuildingDocument = gql`
    mutation UpdateBuilding($id: uuid!, $name: String!, $address: String!, $total_units: Int!, $variables: jsonb) {
  update_buildings_by_pk(
    pk_columns: {id: $id}
    _set: {name: $name, address: $address, total_units: $total_units, variables: $variables}
  ) {
    id
    name
    address
    total_units
    variables
  }
}
    `;
export type UpdateBuildingMutationFn = Apollo.MutationFunction<UpdateBuildingMutation, UpdateBuildingMutationVariables>;

/**
 * __useUpdateBuildingMutation__
 *
 * To run a mutation, you first call `useUpdateBuildingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBuildingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBuildingMutation, { data, loading, error }] = useUpdateBuildingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      address: // value for 'address'
 *      total_units: // value for 'total_units'
 *      variables: // value for 'variables'
 *   },
 * });
 */
export function useUpdateBuildingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBuildingMutation, UpdateBuildingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBuildingMutation, UpdateBuildingMutationVariables>(UpdateBuildingDocument, options);
      }
export type UpdateBuildingMutationHookResult = ReturnType<typeof useUpdateBuildingMutation>;
export type UpdateBuildingMutationResult = Apollo.MutationResult<UpdateBuildingMutation>;
export type UpdateBuildingMutationOptions = Apollo.BaseMutationOptions<UpdateBuildingMutation, UpdateBuildingMutationVariables>;
export const GetDocumentTemplatesDocument = gql`
    query GetDocumentTemplates($buildingId: uuid) {
  document_templates(
    where: {_or: [{building_id: {_eq: $buildingId}}, {is_global: {_eq: true}}]}
    order_by: {name: asc}
  ) {
    ...DocumentTemplateFields
  }
}
    ${DocumentTemplateFieldsFragmentDoc}`;

/**
 * __useGetDocumentTemplatesQuery__
 *
 * To run a query within a React component, call `useGetDocumentTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentTemplatesQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetDocumentTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>(GetDocumentTemplatesDocument, options);
      }
export function useGetDocumentTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>(GetDocumentTemplatesDocument, options);
        }
export function useGetDocumentTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>(GetDocumentTemplatesDocument, options);
        }
export type GetDocumentTemplatesQueryHookResult = ReturnType<typeof useGetDocumentTemplatesQuery>;
export type GetDocumentTemplatesLazyQueryHookResult = ReturnType<typeof useGetDocumentTemplatesLazyQuery>;
export type GetDocumentTemplatesSuspenseQueryHookResult = ReturnType<typeof useGetDocumentTemplatesSuspenseQuery>;
export type GetDocumentTemplatesQueryResult = Apollo.QueryResult<GetDocumentTemplatesQuery, GetDocumentTemplatesQueryVariables>;
export const AddDocumentTemplateDocument = gql`
    mutation AddDocumentTemplate($template: document_templates_insert_input!) {
  insert_document_templates_one(object: $template) {
    ...DocumentTemplateFields
  }
}
    ${DocumentTemplateFieldsFragmentDoc}`;
export type AddDocumentTemplateMutationFn = Apollo.MutationFunction<AddDocumentTemplateMutation, AddDocumentTemplateMutationVariables>;

/**
 * __useAddDocumentTemplateMutation__
 *
 * To run a mutation, you first call `useAddDocumentTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddDocumentTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addDocumentTemplateMutation, { data, loading, error }] = useAddDocumentTemplateMutation({
 *   variables: {
 *      template: // value for 'template'
 *   },
 * });
 */
export function useAddDocumentTemplateMutation(baseOptions?: Apollo.MutationHookOptions<AddDocumentTemplateMutation, AddDocumentTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddDocumentTemplateMutation, AddDocumentTemplateMutationVariables>(AddDocumentTemplateDocument, options);
      }
export type AddDocumentTemplateMutationHookResult = ReturnType<typeof useAddDocumentTemplateMutation>;
export type AddDocumentTemplateMutationResult = Apollo.MutationResult<AddDocumentTemplateMutation>;
export type AddDocumentTemplateMutationOptions = Apollo.BaseMutationOptions<AddDocumentTemplateMutation, AddDocumentTemplateMutationVariables>;
export const UpdateDocumentTemplateDocument = gql`
    mutation UpdateDocumentTemplate($id: uuid!, $template: document_templates_set_input!) {
  update_document_templates_by_pk(pk_columns: {id: $id}, _set: $template) {
    ...DocumentTemplateFields
  }
}
    ${DocumentTemplateFieldsFragmentDoc}`;
export type UpdateDocumentTemplateMutationFn = Apollo.MutationFunction<UpdateDocumentTemplateMutation, UpdateDocumentTemplateMutationVariables>;

/**
 * __useUpdateDocumentTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateDocumentTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDocumentTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDocumentTemplateMutation, { data, loading, error }] = useUpdateDocumentTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      template: // value for 'template'
 *   },
 * });
 */
export function useUpdateDocumentTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDocumentTemplateMutation, UpdateDocumentTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDocumentTemplateMutation, UpdateDocumentTemplateMutationVariables>(UpdateDocumentTemplateDocument, options);
      }
export type UpdateDocumentTemplateMutationHookResult = ReturnType<typeof useUpdateDocumentTemplateMutation>;
export type UpdateDocumentTemplateMutationResult = Apollo.MutationResult<UpdateDocumentTemplateMutation>;
export type UpdateDocumentTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateDocumentTemplateMutation, UpdateDocumentTemplateMutationVariables>;
export const DeleteDocumentTemplateDocument = gql`
    mutation DeleteDocumentTemplate($id: uuid!) {
  delete_document_templates_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteDocumentTemplateMutationFn = Apollo.MutationFunction<DeleteDocumentTemplateMutation, DeleteDocumentTemplateMutationVariables>;

/**
 * __useDeleteDocumentTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteDocumentTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDocumentTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDocumentTemplateMutation, { data, loading, error }] = useDeleteDocumentTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteDocumentTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDocumentTemplateMutation, DeleteDocumentTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDocumentTemplateMutation, DeleteDocumentTemplateMutationVariables>(DeleteDocumentTemplateDocument, options);
      }
export type DeleteDocumentTemplateMutationHookResult = ReturnType<typeof useDeleteDocumentTemplateMutation>;
export type DeleteDocumentTemplateMutationResult = Apollo.MutationResult<DeleteDocumentTemplateMutation>;
export type DeleteDocumentTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteDocumentTemplateMutation, DeleteDocumentTemplateMutationVariables>;
export const GetGlobalVariablesV2Document = gql`
    query GetGlobalVariablesV2 {
  global_variables(order_by: {name: asc}) {
    ...GlobalVariableFieldsV2
  }
}
    ${GlobalVariableFieldsV2FragmentDoc}`;

/**
 * __useGetGlobalVariablesV2Query__
 *
 * To run a query within a React component, call `useGetGlobalVariablesV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalVariablesV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalVariablesV2Query({
 *   variables: {
 *   },
 * });
 */
export function useGetGlobalVariablesV2Query(baseOptions?: Apollo.QueryHookOptions<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>(GetGlobalVariablesV2Document, options);
      }
export function useGetGlobalVariablesV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>(GetGlobalVariablesV2Document, options);
        }
export function useGetGlobalVariablesV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>(GetGlobalVariablesV2Document, options);
        }
export type GetGlobalVariablesV2QueryHookResult = ReturnType<typeof useGetGlobalVariablesV2Query>;
export type GetGlobalVariablesV2LazyQueryHookResult = ReturnType<typeof useGetGlobalVariablesV2LazyQuery>;
export type GetGlobalVariablesV2SuspenseQueryHookResult = ReturnType<typeof useGetGlobalVariablesV2SuspenseQuery>;
export type GetGlobalVariablesV2QueryResult = Apollo.QueryResult<GetGlobalVariablesV2Query, GetGlobalVariablesV2QueryVariables>;
export const GetAllGlobalVariablesDocument = gql`
    query GetAllGlobalVariables {
  global_variables(order_by: {name: asc}) {
    ...GlobalVariableFieldsV2
  }
}
    ${GlobalVariableFieldsV2FragmentDoc}`;

/**
 * __useGetAllGlobalVariablesQuery__
 *
 * To run a query within a React component, call `useGetAllGlobalVariablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGlobalVariablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGlobalVariablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllGlobalVariablesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>(GetAllGlobalVariablesDocument, options);
      }
export function useGetAllGlobalVariablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>(GetAllGlobalVariablesDocument, options);
        }
export function useGetAllGlobalVariablesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>(GetAllGlobalVariablesDocument, options);
        }
export type GetAllGlobalVariablesQueryHookResult = ReturnType<typeof useGetAllGlobalVariablesQuery>;
export type GetAllGlobalVariablesLazyQueryHookResult = ReturnType<typeof useGetAllGlobalVariablesLazyQuery>;
export type GetAllGlobalVariablesSuspenseQueryHookResult = ReturnType<typeof useGetAllGlobalVariablesSuspenseQuery>;
export type GetAllGlobalVariablesQueryResult = Apollo.QueryResult<GetAllGlobalVariablesQuery, GetAllGlobalVariablesQueryVariables>;
export const AddGlobalVariableDocument = gql`
    mutation AddGlobalVariable($variable: global_variables_insert_input!) {
  insert_global_variables_one(object: $variable) {
    ...GlobalVariableFieldsV2
  }
}
    ${GlobalVariableFieldsV2FragmentDoc}`;
export type AddGlobalVariableMutationFn = Apollo.MutationFunction<AddGlobalVariableMutation, AddGlobalVariableMutationVariables>;

/**
 * __useAddGlobalVariableMutation__
 *
 * To run a mutation, you first call `useAddGlobalVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddGlobalVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addGlobalVariableMutation, { data, loading, error }] = useAddGlobalVariableMutation({
 *   variables: {
 *      variable: // value for 'variable'
 *   },
 * });
 */
export function useAddGlobalVariableMutation(baseOptions?: Apollo.MutationHookOptions<AddGlobalVariableMutation, AddGlobalVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddGlobalVariableMutation, AddGlobalVariableMutationVariables>(AddGlobalVariableDocument, options);
      }
export type AddGlobalVariableMutationHookResult = ReturnType<typeof useAddGlobalVariableMutation>;
export type AddGlobalVariableMutationResult = Apollo.MutationResult<AddGlobalVariableMutation>;
export type AddGlobalVariableMutationOptions = Apollo.BaseMutationOptions<AddGlobalVariableMutation, AddGlobalVariableMutationVariables>;
export const UpdateGlobalVariableV2Document = gql`
    mutation UpdateGlobalVariableV2($name: String!, $variable: global_variables_set_input!) {
  update_global_variables_by_pk(pk_columns: {name: $name}, _set: $variable) {
    ...GlobalVariableFieldsV2
  }
}
    ${GlobalVariableFieldsV2FragmentDoc}`;
export type UpdateGlobalVariableV2MutationFn = Apollo.MutationFunction<UpdateGlobalVariableV2Mutation, UpdateGlobalVariableV2MutationVariables>;

/**
 * __useUpdateGlobalVariableV2Mutation__
 *
 * To run a mutation, you first call `useUpdateGlobalVariableV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGlobalVariableV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGlobalVariableV2Mutation, { data, loading, error }] = useUpdateGlobalVariableV2Mutation({
 *   variables: {
 *      name: // value for 'name'
 *      variable: // value for 'variable'
 *   },
 * });
 */
export function useUpdateGlobalVariableV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateGlobalVariableV2Mutation, UpdateGlobalVariableV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGlobalVariableV2Mutation, UpdateGlobalVariableV2MutationVariables>(UpdateGlobalVariableV2Document, options);
      }
export type UpdateGlobalVariableV2MutationHookResult = ReturnType<typeof useUpdateGlobalVariableV2Mutation>;
export type UpdateGlobalVariableV2MutationResult = Apollo.MutationResult<UpdateGlobalVariableV2Mutation>;
export type UpdateGlobalVariableV2MutationOptions = Apollo.BaseMutationOptions<UpdateGlobalVariableV2Mutation, UpdateGlobalVariableV2MutationVariables>;
export const UpdateGlobalVariablesDocument = gql`
    mutation UpdateGlobalVariables($updates: [global_variables_insert_input!]!) {
  insert_global_variables(
    objects: $updates
    on_conflict: {constraint: global_variables_pkey, update_columns: [value]}
  ) {
    affected_rows
    returning {
      ...GlobalVariableFieldsV2
    }
  }
}
    ${GlobalVariableFieldsV2FragmentDoc}`;
export type UpdateGlobalVariablesMutationFn = Apollo.MutationFunction<UpdateGlobalVariablesMutation, UpdateGlobalVariablesMutationVariables>;

/**
 * __useUpdateGlobalVariablesMutation__
 *
 * To run a mutation, you first call `useUpdateGlobalVariablesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGlobalVariablesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGlobalVariablesMutation, { data, loading, error }] = useUpdateGlobalVariablesMutation({
 *   variables: {
 *      updates: // value for 'updates'
 *   },
 * });
 */
export function useUpdateGlobalVariablesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGlobalVariablesMutation, UpdateGlobalVariablesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGlobalVariablesMutation, UpdateGlobalVariablesMutationVariables>(UpdateGlobalVariablesDocument, options);
      }
export type UpdateGlobalVariablesMutationHookResult = ReturnType<typeof useUpdateGlobalVariablesMutation>;
export type UpdateGlobalVariablesMutationResult = Apollo.MutationResult<UpdateGlobalVariablesMutation>;
export type UpdateGlobalVariablesMutationOptions = Apollo.BaseMutationOptions<UpdateGlobalVariablesMutation, UpdateGlobalVariablesMutationVariables>;
export const DeleteGlobalVariableDocument = gql`
    mutation DeleteGlobalVariable($name: String!) {
  delete_global_variables_by_pk(name: $name) {
    name
  }
}
    `;
export type DeleteGlobalVariableMutationFn = Apollo.MutationFunction<DeleteGlobalVariableMutation, DeleteGlobalVariableMutationVariables>;

/**
 * __useDeleteGlobalVariableMutation__
 *
 * To run a mutation, you first call `useDeleteGlobalVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGlobalVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGlobalVariableMutation, { data, loading, error }] = useDeleteGlobalVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDeleteGlobalVariableMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGlobalVariableMutation, DeleteGlobalVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGlobalVariableMutation, DeleteGlobalVariableMutationVariables>(DeleteGlobalVariableDocument, options);
      }
export type DeleteGlobalVariableMutationHookResult = ReturnType<typeof useDeleteGlobalVariableMutation>;
export type DeleteGlobalVariableMutationResult = Apollo.MutationResult<DeleteGlobalVariableMutation>;
export type DeleteGlobalVariableMutationOptions = Apollo.BaseMutationOptions<DeleteGlobalVariableMutation, DeleteGlobalVariableMutationVariables>;
export const GetGlobalVariablesDocument = gql`
    query GetGlobalVariables {
  global_variables {
    ...GlobalVariableFields
  }
}
    ${GlobalVariableFieldsFragmentDoc}`;

/**
 * __useGetGlobalVariablesQuery__
 *
 * To run a query within a React component, call `useGetGlobalVariablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalVariablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalVariablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGlobalVariablesQuery(baseOptions?: Apollo.QueryHookOptions<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>(GetGlobalVariablesDocument, options);
      }
export function useGetGlobalVariablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>(GetGlobalVariablesDocument, options);
        }
export function useGetGlobalVariablesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>(GetGlobalVariablesDocument, options);
        }
export type GetGlobalVariablesQueryHookResult = ReturnType<typeof useGetGlobalVariablesQuery>;
export type GetGlobalVariablesLazyQueryHookResult = ReturnType<typeof useGetGlobalVariablesLazyQuery>;
export type GetGlobalVariablesSuspenseQueryHookResult = ReturnType<typeof useGetGlobalVariablesSuspenseQuery>;
export type GetGlobalVariablesQueryResult = Apollo.QueryResult<GetGlobalVariablesQuery, GetGlobalVariablesQueryVariables>;
export const UpdateGlobalVariableDocument = gql`
    mutation UpdateGlobalVariable($name: String!, $value: String!) {
  update_global_variables_by_pk(pk_columns: {name: $name}, _set: {value: $value}) {
    ...GlobalVariableFields
  }
}
    ${GlobalVariableFieldsFragmentDoc}`;
export type UpdateGlobalVariableMutationFn = Apollo.MutationFunction<UpdateGlobalVariableMutation, UpdateGlobalVariableMutationVariables>;

/**
 * __useUpdateGlobalVariableMutation__
 *
 * To run a mutation, you first call `useUpdateGlobalVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGlobalVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGlobalVariableMutation, { data, loading, error }] = useUpdateGlobalVariableMutation({
 *   variables: {
 *      name: // value for 'name'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateGlobalVariableMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGlobalVariableMutation, UpdateGlobalVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGlobalVariableMutation, UpdateGlobalVariableMutationVariables>(UpdateGlobalVariableDocument, options);
      }
export type UpdateGlobalVariableMutationHookResult = ReturnType<typeof useUpdateGlobalVariableMutation>;
export type UpdateGlobalVariableMutationResult = Apollo.MutationResult<UpdateGlobalVariableMutation>;
export type UpdateGlobalVariableMutationOptions = Apollo.BaseMutationOptions<UpdateGlobalVariableMutation, UpdateGlobalVariableMutationVariables>;
export const GetMembersDocument = gql`
    query GetMembers($buildingId: uuid!) {
  members(where: {building_id: {_eq: $buildingId}}, order_by: {name: asc}) {
    id
    name
    email
    phone
    unit
    vote_weight
    representative_id
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetMembersQuery__
 *
 * To run a query within a React component, call `useGetMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetMembersQuery(baseOptions: Apollo.QueryHookOptions<GetMembersQuery, GetMembersQueryVariables> & ({ variables: GetMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
      }
export function useGetMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
        }
export function useGetMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
        }
export type GetMembersQueryHookResult = ReturnType<typeof useGetMembersQuery>;
export type GetMembersLazyQueryHookResult = ReturnType<typeof useGetMembersLazyQuery>;
export type GetMembersSuspenseQueryHookResult = ReturnType<typeof useGetMembersSuspenseQuery>;
export type GetMembersQueryResult = Apollo.QueryResult<GetMembersQuery, GetMembersQueryVariables>;
export const AddMemberDocument = gql`
    mutation AddMember($member: members_insert_input!) {
  insert_members_one(object: $member) {
    id
  }
}
    `;
export type AddMemberMutationFn = Apollo.MutationFunction<AddMemberMutation, AddMemberMutationVariables>;

/**
 * __useAddMemberMutation__
 *
 * To run a mutation, you first call `useAddMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberMutation, { data, loading, error }] = useAddMemberMutation({
 *   variables: {
 *      member: // value for 'member'
 *   },
 * });
 */
export function useAddMemberMutation(baseOptions?: Apollo.MutationHookOptions<AddMemberMutation, AddMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMemberMutation, AddMemberMutationVariables>(AddMemberDocument, options);
      }
export type AddMemberMutationHookResult = ReturnType<typeof useAddMemberMutation>;
export type AddMemberMutationResult = Apollo.MutationResult<AddMemberMutation>;
export type AddMemberMutationOptions = Apollo.BaseMutationOptions<AddMemberMutation, AddMemberMutationVariables>;
export const UpdateMemberDocument = gql`
    mutation UpdateMember($id: uuid!, $changes: members_set_input!) {
  update_members_by_pk(pk_columns: {id: $id}, _set: $changes) {
    id
  }
}
    `;
export type UpdateMemberMutationFn = Apollo.MutationFunction<UpdateMemberMutation, UpdateMemberMutationVariables>;

/**
 * __useUpdateMemberMutation__
 *
 * To run a mutation, you first call `useUpdateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMemberMutation, { data, loading, error }] = useUpdateMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdateMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMemberMutation, UpdateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMemberMutation, UpdateMemberMutationVariables>(UpdateMemberDocument, options);
      }
export type UpdateMemberMutationHookResult = ReturnType<typeof useUpdateMemberMutation>;
export type UpdateMemberMutationResult = Apollo.MutationResult<UpdateMemberMutation>;
export type UpdateMemberMutationOptions = Apollo.BaseMutationOptions<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const DeleteMemberDocument = gql`
    mutation DeleteMember($id: uuid!) {
  delete_members_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteMemberMutationFn = Apollo.MutationFunction<DeleteMemberMutation, DeleteMemberMutationVariables>;

/**
 * __useDeleteMemberMutation__
 *
 * To run a mutation, you first call `useDeleteMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMemberMutation, { data, loading, error }] = useDeleteMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMemberMutation, DeleteMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMemberMutation, DeleteMemberMutationVariables>(DeleteMemberDocument, options);
      }
export type DeleteMemberMutationHookResult = ReturnType<typeof useDeleteMemberMutation>;
export type DeleteMemberMutationResult = Apollo.MutationResult<DeleteMemberMutation>;
export type DeleteMemberMutationOptions = Apollo.BaseMutationOptions<DeleteMemberMutation, DeleteMemberMutationVariables>;
export const AddManualVoteDocument = gql`
    mutation AddManualVote($vote_id: uuid!, $member_id: uuid!, $answer: String!) {
  insert_member_votes_one(
    object: {vote_id: $vote_id, member_id: $member_id, answer: $answer}
    on_conflict: {constraint: member_votes_pkey, update_columns: [answer]}
  ) {
    id
  }
}
    `;
export type AddManualVoteMutationFn = Apollo.MutationFunction<AddManualVoteMutation, AddManualVoteMutationVariables>;

/**
 * __useAddManualVoteMutation__
 *
 * To run a mutation, you first call `useAddManualVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddManualVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addManualVoteMutation, { data, loading, error }] = useAddManualVoteMutation({
 *   variables: {
 *      vote_id: // value for 'vote_id'
 *      member_id: // value for 'member_id'
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useAddManualVoteMutation(baseOptions?: Apollo.MutationHookOptions<AddManualVoteMutation, AddManualVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddManualVoteMutation, AddManualVoteMutationVariables>(AddManualVoteDocument, options);
      }
export type AddManualVoteMutationHookResult = ReturnType<typeof useAddManualVoteMutation>;
export type AddManualVoteMutationResult = Apollo.MutationResult<AddManualVoteMutation>;
export type AddManualVoteMutationOptions = Apollo.BaseMutationOptions<AddManualVoteMutation, AddManualVoteMutationVariables>;
export const SetVoteRepresentativeDocument = gql`
    mutation SetVoteRepresentative($vote_id: uuid!, $representative_id: uuid) {
  update_members_by_pk(
    pk_columns: {id: $vote_id}
    _set: {representative_id: $representative_id}
  ) {
    id
    representative_id
  }
}
    `;
export type SetVoteRepresentativeMutationFn = Apollo.MutationFunction<SetVoteRepresentativeMutation, SetVoteRepresentativeMutationVariables>;

/**
 * __useSetVoteRepresentativeMutation__
 *
 * To run a mutation, you first call `useSetVoteRepresentativeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetVoteRepresentativeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setVoteRepresentativeMutation, { data, loading, error }] = useSetVoteRepresentativeMutation({
 *   variables: {
 *      vote_id: // value for 'vote_id'
 *      representative_id: // value for 'representative_id'
 *   },
 * });
 */
export function useSetVoteRepresentativeMutation(baseOptions?: Apollo.MutationHookOptions<SetVoteRepresentativeMutation, SetVoteRepresentativeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetVoteRepresentativeMutation, SetVoteRepresentativeMutationVariables>(SetVoteRepresentativeDocument, options);
      }
export type SetVoteRepresentativeMutationHookResult = ReturnType<typeof useSetVoteRepresentativeMutation>;
export type SetVoteRepresentativeMutationResult = Apollo.MutationResult<SetVoteRepresentativeMutation>;
export type SetVoteRepresentativeMutationOptions = Apollo.BaseMutationOptions<SetVoteRepresentativeMutation, SetVoteRepresentativeMutationVariables>;
export const StartVoteDocument = gql`
    mutation StartVote($id: uuid!) {
  update_votes_by_pk(pk_columns: {id: $id}, _set: {status: "active"}) {
    id
    status
  }
}
    `;
export type StartVoteMutationFn = Apollo.MutationFunction<StartVoteMutation, StartVoteMutationVariables>;

/**
 * __useStartVoteMutation__
 *
 * To run a mutation, you first call `useStartVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startVoteMutation, { data, loading, error }] = useStartVoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStartVoteMutation(baseOptions?: Apollo.MutationHookOptions<StartVoteMutation, StartVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartVoteMutation, StartVoteMutationVariables>(StartVoteDocument, options);
      }
export type StartVoteMutationHookResult = ReturnType<typeof useStartVoteMutation>;
export type StartVoteMutationResult = Apollo.MutationResult<StartVoteMutation>;
export type StartVoteMutationOptions = Apollo.BaseMutationOptions<StartVoteMutation, StartVoteMutationVariables>;
export const AddObserverToVoteDocument = gql`
    mutation AddObserverToVote($vote_id: uuid!, $observers: [String!]!) {
  update_votes_by_pk(pk_columns: {id: $vote_id}, _set: {observers: $observers}) {
    id
    observers
  }
}
    `;
export type AddObserverToVoteMutationFn = Apollo.MutationFunction<AddObserverToVoteMutation, AddObserverToVoteMutationVariables>;

/**
 * __useAddObserverToVoteMutation__
 *
 * To run a mutation, you first call `useAddObserverToVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddObserverToVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addObserverToVoteMutation, { data, loading, error }] = useAddObserverToVoteMutation({
 *   variables: {
 *      vote_id: // value for 'vote_id'
 *      observers: // value for 'observers'
 *   },
 * });
 */
export function useAddObserverToVoteMutation(baseOptions?: Apollo.MutationHookOptions<AddObserverToVoteMutation, AddObserverToVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddObserverToVoteMutation, AddObserverToVoteMutationVariables>(AddObserverToVoteDocument, options);
      }
export type AddObserverToVoteMutationHookResult = ReturnType<typeof useAddObserverToVoteMutation>;
export type AddObserverToVoteMutationResult = Apollo.MutationResult<AddObserverToVoteMutation>;
export type AddObserverToVoteMutationOptions = Apollo.BaseMutationOptions<AddObserverToVoteMutation, AddObserverToVoteMutationVariables>;
export const RemoveObserverFromVoteDocument = gql`
    mutation RemoveObserverFromVote($vote_id: uuid!, $observers: [String!]!) {
  update_votes_by_pk(pk_columns: {id: $vote_id}, _set: {observers: $observers}) {
    id
    observers
  }
}
    `;
export type RemoveObserverFromVoteMutationFn = Apollo.MutationFunction<RemoveObserverFromVoteMutation, RemoveObserverFromVoteMutationVariables>;

/**
 * __useRemoveObserverFromVoteMutation__
 *
 * To run a mutation, you first call `useRemoveObserverFromVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveObserverFromVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeObserverFromVoteMutation, { data, loading, error }] = useRemoveObserverFromVoteMutation({
 *   variables: {
 *      vote_id: // value for 'vote_id'
 *      observers: // value for 'observers'
 *   },
 * });
 */
export function useRemoveObserverFromVoteMutation(baseOptions?: Apollo.MutationHookOptions<RemoveObserverFromVoteMutation, RemoveObserverFromVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveObserverFromVoteMutation, RemoveObserverFromVoteMutationVariables>(RemoveObserverFromVoteDocument, options);
      }
export type RemoveObserverFromVoteMutationHookResult = ReturnType<typeof useRemoveObserverFromVoteMutation>;
export type RemoveObserverFromVoteMutationResult = Apollo.MutationResult<RemoveObserverFromVoteMutation>;
export type RemoveObserverFromVoteMutationOptions = Apollo.BaseMutationOptions<RemoveObserverFromVoteMutation, RemoveObserverFromVoteMutationVariables>;
export const CreateObserverDocument = gql`
    mutation CreateObserver($name: String!, $email: String!, $building_id: uuid!) {
  insert_observers_one(
    object: {name: $name, email: $email, building_id: $building_id}
  ) {
    id
    name
    email
  }
}
    `;
export type CreateObserverMutationFn = Apollo.MutationFunction<CreateObserverMutation, CreateObserverMutationVariables>;

/**
 * __useCreateObserverMutation__
 *
 * To run a mutation, you first call `useCreateObserverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateObserverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createObserverMutation, { data, loading, error }] = useCreateObserverMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      building_id: // value for 'building_id'
 *   },
 * });
 */
export function useCreateObserverMutation(baseOptions?: Apollo.MutationHookOptions<CreateObserverMutation, CreateObserverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateObserverMutation, CreateObserverMutationVariables>(CreateObserverDocument, options);
      }
export type CreateObserverMutationHookResult = ReturnType<typeof useCreateObserverMutation>;
export type CreateObserverMutationResult = Apollo.MutationResult<CreateObserverMutation>;
export type CreateObserverMutationOptions = Apollo.BaseMutationOptions<CreateObserverMutation, CreateObserverMutationVariables>;
export const DeleteObserverDocument = gql`
    mutation DeleteObserver($id: uuid!) {
  delete_observers_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteObserverMutationFn = Apollo.MutationFunction<DeleteObserverMutation, DeleteObserverMutationVariables>;

/**
 * __useDeleteObserverMutation__
 *
 * To run a mutation, you first call `useDeleteObserverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteObserverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteObserverMutation, { data, loading, error }] = useDeleteObserverMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteObserverMutation(baseOptions?: Apollo.MutationHookOptions<DeleteObserverMutation, DeleteObserverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteObserverMutation, DeleteObserverMutationVariables>(DeleteObserverDocument, options);
      }
export type DeleteObserverMutationHookResult = ReturnType<typeof useDeleteObserverMutation>;
export type DeleteObserverMutationResult = Apollo.MutationResult<DeleteObserverMutation>;
export type DeleteObserverMutationOptions = Apollo.BaseMutationOptions<DeleteObserverMutation, DeleteObserverMutationVariables>;
export const GetBuildingsFromQueriesDocument = gql`
    query GetBuildingsFromQueries {
  buildings {
    id
    name
    address
    total_units
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetBuildingsFromQueriesQuery__
 *
 * To run a query within a React component, call `useGetBuildingsFromQueriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingsFromQueriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingsFromQueriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBuildingsFromQueriesQuery(baseOptions?: Apollo.QueryHookOptions<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>(GetBuildingsFromQueriesDocument, options);
      }
export function useGetBuildingsFromQueriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>(GetBuildingsFromQueriesDocument, options);
        }
export function useGetBuildingsFromQueriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>(GetBuildingsFromQueriesDocument, options);
        }
export type GetBuildingsFromQueriesQueryHookResult = ReturnType<typeof useGetBuildingsFromQueriesQuery>;
export type GetBuildingsFromQueriesLazyQueryHookResult = ReturnType<typeof useGetBuildingsFromQueriesLazyQuery>;
export type GetBuildingsFromQueriesSuspenseQueryHookResult = ReturnType<typeof useGetBuildingsFromQueriesSuspenseQuery>;
export type GetBuildingsFromQueriesQueryResult = Apollo.QueryResult<GetBuildingsFromQueriesQuery, GetBuildingsFromQueriesQueryVariables>;
export const GetVoteDetailsDocument = gql`
    query GetVoteDetails($voteId: uuid!, $buildingId: uuid!) {
  votes_by_pk(id: $voteId) {
    id
    title
    description
    start_date
    end_date
    status
    created_at
    building_id
    questions
    observers
  }
  member_votes_aggregate: member_votes_aggregate(where: {vote_id: {_eq: $voteId}}) {
    aggregate {
      count
    }
    nodes {
      id
      member_id
      answer
      vote_id
    }
  }
  members(where: {building_id: {_eq: $buildingId}}) {
    id
    name
    email
    phone
    unit
    vote_weight
    representative_id
  }
}
    `;

/**
 * __useGetVoteDetailsQuery__
 *
 * To run a query within a React component, call `useGetVoteDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoteDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoteDetailsQuery({
 *   variables: {
 *      voteId: // value for 'voteId'
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetVoteDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetVoteDetailsQuery, GetVoteDetailsQueryVariables> & ({ variables: GetVoteDetailsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVoteDetailsQuery, GetVoteDetailsQueryVariables>(GetVoteDetailsDocument, options);
      }
export function useGetVoteDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVoteDetailsQuery, GetVoteDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVoteDetailsQuery, GetVoteDetailsQueryVariables>(GetVoteDetailsDocument, options);
        }
export function useGetVoteDetailsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVoteDetailsQuery, GetVoteDetailsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVoteDetailsQuery, GetVoteDetailsQueryVariables>(GetVoteDetailsDocument, options);
        }
export type GetVoteDetailsQueryHookResult = ReturnType<typeof useGetVoteDetailsQuery>;
export type GetVoteDetailsLazyQueryHookResult = ReturnType<typeof useGetVoteDetailsLazyQuery>;
export type GetVoteDetailsSuspenseQueryHookResult = ReturnType<typeof useGetVoteDetailsSuspenseQuery>;
export type GetVoteDetailsQueryResult = Apollo.QueryResult<GetVoteDetailsQuery, GetVoteDetailsQueryVariables>;
export const GetBuildingsForTemplatesDocument = gql`
    query GetBuildingsForTemplates {
  buildings {
    id
    name
  }
}
    `;

/**
 * __useGetBuildingsForTemplatesQuery__
 *
 * To run a query within a React component, call `useGetBuildingsForTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBuildingsForTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBuildingsForTemplatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBuildingsForTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>(GetBuildingsForTemplatesDocument, options);
      }
export function useGetBuildingsForTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>(GetBuildingsForTemplatesDocument, options);
        }
export function useGetBuildingsForTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>(GetBuildingsForTemplatesDocument, options);
        }
export type GetBuildingsForTemplatesQueryHookResult = ReturnType<typeof useGetBuildingsForTemplatesQuery>;
export type GetBuildingsForTemplatesLazyQueryHookResult = ReturnType<typeof useGetBuildingsForTemplatesLazyQuery>;
export type GetBuildingsForTemplatesSuspenseQueryHookResult = ReturnType<typeof useGetBuildingsForTemplatesSuspenseQuery>;
export type GetBuildingsForTemplatesQueryResult = Apollo.QueryResult<GetBuildingsForTemplatesQuery, GetBuildingsForTemplatesQueryVariables>;
export const GetDataForInvitationModalDocument = gql`
    query GetDataForInvitationModal($buildingId: uuid!) {
  building: buildings_by_pk(id: $buildingId) {
    id
    name
    address
  }
  members(where: {building_id: {_eq: $buildingId}}, order_by: {name: asc}) {
    id
    name
    email
    vote_weight
  }
  email_templates(
    where: {_or: [{building_id: {_eq: $buildingId}}, {is_global: {_eq: true}}]}
    order_by: {name: asc}
  ) {
    id
    name
    subject
    body
    is_global
  }
  global_variables {
    name
    value
    description
    is_editable
  }
}
    `;

/**
 * __useGetDataForInvitationModalQuery__
 *
 * To run a query within a React component, call `useGetDataForInvitationModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataForInvitationModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataForInvitationModalQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetDataForInvitationModalQuery(baseOptions: Apollo.QueryHookOptions<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables> & ({ variables: GetDataForInvitationModalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables>(GetDataForInvitationModalDocument, options);
      }
export function useGetDataForInvitationModalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables>(GetDataForInvitationModalDocument, options);
        }
export function useGetDataForInvitationModalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables>(GetDataForInvitationModalDocument, options);
        }
export type GetDataForInvitationModalQueryHookResult = ReturnType<typeof useGetDataForInvitationModalQuery>;
export type GetDataForInvitationModalLazyQueryHookResult = ReturnType<typeof useGetDataForInvitationModalLazyQuery>;
export type GetDataForInvitationModalSuspenseQueryHookResult = ReturnType<typeof useGetDataForInvitationModalSuspenseQuery>;
export type GetDataForInvitationModalQueryResult = Apollo.QueryResult<GetDataForInvitationModalQuery, GetDataForInvitationModalQueryVariables>;
export const GetMembersByBuildingIdDocument = gql`
    query GetMembersByBuildingId($buildingId: uuid!) {
  members(where: {building_id: {_eq: $buildingId}}) {
    id
    name
    email
    phone
    unit
    vote_weight
    representative_id
  }
}
    `;

/**
 * __useGetMembersByBuildingIdQuery__
 *
 * To run a query within a React component, call `useGetMembersByBuildingIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersByBuildingIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersByBuildingIdQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetMembersByBuildingIdQuery(baseOptions: Apollo.QueryHookOptions<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables> & ({ variables: GetMembersByBuildingIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables>(GetMembersByBuildingIdDocument, options);
      }
export function useGetMembersByBuildingIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables>(GetMembersByBuildingIdDocument, options);
        }
export function useGetMembersByBuildingIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables>(GetMembersByBuildingIdDocument, options);
        }
export type GetMembersByBuildingIdQueryHookResult = ReturnType<typeof useGetMembersByBuildingIdQuery>;
export type GetMembersByBuildingIdLazyQueryHookResult = ReturnType<typeof useGetMembersByBuildingIdLazyQuery>;
export type GetMembersByBuildingIdSuspenseQueryHookResult = ReturnType<typeof useGetMembersByBuildingIdSuspenseQuery>;
export type GetMembersByBuildingIdQueryResult = Apollo.QueryResult<GetMembersByBuildingIdQuery, GetMembersByBuildingIdQueryVariables>;
export const GetObserversByBuildingIdDocument = gql`
    query GetObserversByBuildingId($buildingId: uuid!) {
  observers(where: {building_id: {_eq: $buildingId}}) {
    id
    name
    email
  }
}
    `;

/**
 * __useGetObserversByBuildingIdQuery__
 *
 * To run a query within a React component, call `useGetObserversByBuildingIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetObserversByBuildingIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetObserversByBuildingIdQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetObserversByBuildingIdQuery(baseOptions: Apollo.QueryHookOptions<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables> & ({ variables: GetObserversByBuildingIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables>(GetObserversByBuildingIdDocument, options);
      }
export function useGetObserversByBuildingIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables>(GetObserversByBuildingIdDocument, options);
        }
export function useGetObserversByBuildingIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables>(GetObserversByBuildingIdDocument, options);
        }
export type GetObserversByBuildingIdQueryHookResult = ReturnType<typeof useGetObserversByBuildingIdQuery>;
export type GetObserversByBuildingIdLazyQueryHookResult = ReturnType<typeof useGetObserversByBuildingIdLazyQuery>;
export type GetObserversByBuildingIdSuspenseQueryHookResult = ReturnType<typeof useGetObserversByBuildingIdSuspenseQuery>;
export type GetObserversByBuildingIdQueryResult = Apollo.QueryResult<GetObserversByBuildingIdQuery, GetObserversByBuildingIdQueryVariables>;
export const GetEmailTemplatesDocument = gql`
    query GetEmailTemplates($buildingId: uuid) {
  email_templates(
    where: {_or: [{building_id: {_eq: $buildingId}}, {is_global: {_eq: true}}]}
  ) {
    ...EmailTemplateFields
  }
}
    ${EmailTemplateFieldsFragmentDoc}`;

/**
 * __useGetEmailTemplatesQuery__
 *
 * To run a query within a React component, call `useGetEmailTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmailTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmailTemplatesQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetEmailTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>(GetEmailTemplatesDocument, options);
      }
export function useGetEmailTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>(GetEmailTemplatesDocument, options);
        }
export function useGetEmailTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>(GetEmailTemplatesDocument, options);
        }
export type GetEmailTemplatesQueryHookResult = ReturnType<typeof useGetEmailTemplatesQuery>;
export type GetEmailTemplatesLazyQueryHookResult = ReturnType<typeof useGetEmailTemplatesLazyQuery>;
export type GetEmailTemplatesSuspenseQueryHookResult = ReturnType<typeof useGetEmailTemplatesSuspenseQuery>;
export type GetEmailTemplatesQueryResult = Apollo.QueryResult<GetEmailTemplatesQuery, GetEmailTemplatesQueryVariables>;
export const AddEmailTemplateDocument = gql`
    mutation AddEmailTemplate($template: email_templates_insert_input!) {
  insert_email_templates_one(object: $template) {
    ...EmailTemplateFields
  }
}
    ${EmailTemplateFieldsFragmentDoc}`;
export type AddEmailTemplateMutationFn = Apollo.MutationFunction<AddEmailTemplateMutation, AddEmailTemplateMutationVariables>;

/**
 * __useAddEmailTemplateMutation__
 *
 * To run a mutation, you first call `useAddEmailTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEmailTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEmailTemplateMutation, { data, loading, error }] = useAddEmailTemplateMutation({
 *   variables: {
 *      template: // value for 'template'
 *   },
 * });
 */
export function useAddEmailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<AddEmailTemplateMutation, AddEmailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEmailTemplateMutation, AddEmailTemplateMutationVariables>(AddEmailTemplateDocument, options);
      }
export type AddEmailTemplateMutationHookResult = ReturnType<typeof useAddEmailTemplateMutation>;
export type AddEmailTemplateMutationResult = Apollo.MutationResult<AddEmailTemplateMutation>;
export type AddEmailTemplateMutationOptions = Apollo.BaseMutationOptions<AddEmailTemplateMutation, AddEmailTemplateMutationVariables>;
export const UpdateEmailTemplateDocument = gql`
    mutation UpdateEmailTemplate($id: uuid!, $template: email_templates_set_input!) {
  update_email_templates_by_pk(pk_columns: {id: $id}, _set: $template) {
    ...EmailTemplateFields
  }
}
    ${EmailTemplateFieldsFragmentDoc}`;
export type UpdateEmailTemplateMutationFn = Apollo.MutationFunction<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>;

/**
 * __useUpdateEmailTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateEmailTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmailTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmailTemplateMutation, { data, loading, error }] = useUpdateEmailTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      template: // value for 'template'
 *   },
 * });
 */
export function useUpdateEmailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>(UpdateEmailTemplateDocument, options);
      }
export type UpdateEmailTemplateMutationHookResult = ReturnType<typeof useUpdateEmailTemplateMutation>;
export type UpdateEmailTemplateMutationResult = Apollo.MutationResult<UpdateEmailTemplateMutation>;
export type UpdateEmailTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateEmailTemplateMutation, UpdateEmailTemplateMutationVariables>;
export const DeleteEmailTemplateDocument = gql`
    mutation DeleteEmailTemplate($id: uuid!) {
  delete_email_templates_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteEmailTemplateMutationFn = Apollo.MutationFunction<DeleteEmailTemplateMutation, DeleteEmailTemplateMutationVariables>;

/**
 * __useDeleteEmailTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteEmailTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmailTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmailTemplateMutation, { data, loading, error }] = useDeleteEmailTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEmailTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmailTemplateMutation, DeleteEmailTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEmailTemplateMutation, DeleteEmailTemplateMutationVariables>(DeleteEmailTemplateDocument, options);
      }
export type DeleteEmailTemplateMutationHookResult = ReturnType<typeof useDeleteEmailTemplateMutation>;
export type DeleteEmailTemplateMutationResult = Apollo.MutationResult<DeleteEmailTemplateMutation>;
export type DeleteEmailTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteEmailTemplateMutation, DeleteEmailTemplateMutationVariables>;
export const GetVotesDocument = gql`
    query GetVotes($buildingId: uuid!) {
  votes(where: {building_id: {_eq: $buildingId}}, order_by: {created_at: desc}) {
    id
    title
    description
    status
    start_date
    end_date
    created_at
    building_id
  }
  members_aggregate(where: {building_id: {_eq: $buildingId}}) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useGetVotesQuery__
 *
 * To run a query within a React component, call `useGetVotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVotesQuery({
 *   variables: {
 *      buildingId: // value for 'buildingId'
 *   },
 * });
 */
export function useGetVotesQuery(baseOptions: Apollo.QueryHookOptions<GetVotesQuery, GetVotesQueryVariables> & ({ variables: GetVotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVotesQuery, GetVotesQueryVariables>(GetVotesDocument, options);
      }
export function useGetVotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVotesQuery, GetVotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVotesQuery, GetVotesQueryVariables>(GetVotesDocument, options);
        }
export function useGetVotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVotesQuery, GetVotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVotesQuery, GetVotesQueryVariables>(GetVotesDocument, options);
        }
export type GetVotesQueryHookResult = ReturnType<typeof useGetVotesQuery>;
export type GetVotesLazyQueryHookResult = ReturnType<typeof useGetVotesLazyQuery>;
export type GetVotesSuspenseQueryHookResult = ReturnType<typeof useGetVotesSuspenseQuery>;
export type GetVotesQueryResult = Apollo.QueryResult<GetVotesQuery, GetVotesQueryVariables>;
export const AddVoteDocument = gql`
    mutation AddVote($vote: votes_insert_input!) {
  insert_votes_one(object: $vote) {
    id
  }
}
    `;
export type AddVoteMutationFn = Apollo.MutationFunction<AddVoteMutation, AddVoteMutationVariables>;

/**
 * __useAddVoteMutation__
 *
 * To run a mutation, you first call `useAddVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addVoteMutation, { data, loading, error }] = useAddVoteMutation({
 *   variables: {
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useAddVoteMutation(baseOptions?: Apollo.MutationHookOptions<AddVoteMutation, AddVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddVoteMutation, AddVoteMutationVariables>(AddVoteDocument, options);
      }
export type AddVoteMutationHookResult = ReturnType<typeof useAddVoteMutation>;
export type AddVoteMutationResult = Apollo.MutationResult<AddVoteMutation>;
export type AddVoteMutationOptions = Apollo.BaseMutationOptions<AddVoteMutation, AddVoteMutationVariables>;
export const UpdateVoteDocument = gql`
    mutation UpdateVote($id: uuid!, $vote: votes_set_input!) {
  update_votes_by_pk(pk_columns: {id: $id}, _set: $vote) {
    id
    title
    description
    status
    start_date
    end_date
    building_id
    questions
  }
}
    `;
export type UpdateVoteMutationFn = Apollo.MutationFunction<UpdateVoteMutation, UpdateVoteMutationVariables>;

/**
 * __useUpdateVoteMutation__
 *
 * To run a mutation, you first call `useUpdateVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVoteMutation, { data, loading, error }] = useUpdateVoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      vote: // value for 'vote'
 *   },
 * });
 */
export function useUpdateVoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVoteMutation, UpdateVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVoteMutation, UpdateVoteMutationVariables>(UpdateVoteDocument, options);
      }
export type UpdateVoteMutationHookResult = ReturnType<typeof useUpdateVoteMutation>;
export type UpdateVoteMutationResult = Apollo.MutationResult<UpdateVoteMutation>;
export type UpdateVoteMutationOptions = Apollo.BaseMutationOptions<UpdateVoteMutation, UpdateVoteMutationVariables>;
export const CancelVoteDocument = gql`
    mutation CancelVote($id: uuid!) {
  update_votes_by_pk(
    pk_columns: {id: $id}
    _set: {status: "cancelled", end_date: "now()"}
  ) {
    id
  }
}
    `;
export type CancelVoteMutationFn = Apollo.MutationFunction<CancelVoteMutation, CancelVoteMutationVariables>;

/**
 * __useCancelVoteMutation__
 *
 * To run a mutation, you first call `useCancelVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelVoteMutation, { data, loading, error }] = useCancelVoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelVoteMutation(baseOptions?: Apollo.MutationHookOptions<CancelVoteMutation, CancelVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelVoteMutation, CancelVoteMutationVariables>(CancelVoteDocument, options);
      }
export type CancelVoteMutationHookResult = ReturnType<typeof useCancelVoteMutation>;
export type CancelVoteMutationResult = Apollo.MutationResult<CancelVoteMutation>;
export type CancelVoteMutationOptions = Apollo.BaseMutationOptions<CancelVoteMutation, CancelVoteMutationVariables>;
export const DeleteVoteDocument = gql`
    mutation DeleteVote($id: uuid!) {
  delete_votes_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteVoteMutationFn = Apollo.MutationFunction<DeleteVoteMutation, DeleteVoteMutationVariables>;

/**
 * __useDeleteVoteMutation__
 *
 * To run a mutation, you first call `useDeleteVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVoteMutation, { data, loading, error }] = useDeleteVoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteVoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVoteMutation, DeleteVoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVoteMutation, DeleteVoteMutationVariables>(DeleteVoteDocument, options);
      }
export type DeleteVoteMutationHookResult = ReturnType<typeof useDeleteVoteMutation>;
export type DeleteVoteMutationResult = Apollo.MutationResult<DeleteVoteMutation>;
export type DeleteVoteMutationOptions = Apollo.BaseMutationOptions<DeleteVoteMutation, DeleteVoteMutationVariables>;