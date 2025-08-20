import React, { useState } from 'react';
import { useMutation } from '@nhost/react-apollo';
import { gql } from 'graphql-tag';
import { toast } from 'react-toastify';

interface Question {
  text: string;
}

interface Vote {
  id?: string;
  title: string;
  questions: Question[];
}

interface VoteFormViewProps {
  vote?: Vote;
  onBack: () => void;
}

const CREATE_VOTE_MUTATION = gql`
  mutation CreateVote($vote: votes_insert_input!, $questions: [questions_insert_input!]!) {
    insert_votes_one(object: $vote) {
      id
      title
      questions {
        id
        text
      }
    }
  }
`;

const UPDATE_VOTE_MUTATION = gql`
  mutation UpdateVote($id: uuid!, $vote: votes_set_input!, $questions: [questions_insert_input!]!) {
    update_votes_by_pk(pk_columns: { id: $id }, _set: $vote) {
      id
      title
    }
    delete_questions(where: { vote_id: { _eq: $id } }) {
      affected_rows
    }
    insert_questions(objects: $questions) {
      affected_rows
    }
  }
`;

const VoteFormView: React.FC<VoteFormViewProps> = ({ vote, onBack }) => {
  const [formData, setFormData] = useState<Vote>({
    title: vote?.title || '',
    questions: vote?.questions || [],
  });

  const [createVote] = useMutation(CREATE_VOTE_MUTATION);
  const [updateVote] = useMutation(UPDATE_VOTE_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const voteData = {
      title: formData.title,
    };

    const questionsData = formData.questions.map((q: Question) => ({
      text: q.text,
    }));

    try {
      if (vote) {
        // Update existing vote
        await updateVote({
          variables: {
            id: vote.id,
            vote: voteData,
            questions: questionsData,
          },
        });
        toast.success('Hlasování bylo úspěšně aktualizováno.');
      } else {
        // Create new vote
        await createVote({
          variables: {
            vote: voteData,
            questions: questionsData,
          },
        });
        toast.success('Hlasování bylo úspěšně vytvořeno.');
      }
      onBack();
    } catch (error) {
      toast.error('Došlo k chybě při ukládání hlasování.');
      console.error(error);
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].text = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { text: '' }],
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Název hlasování</label>
        <input
          id="title"
          type="text"
          placeholder="Zadejte název hlasování"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <h3>Otázky</h3>
        {formData.questions.map((question, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Otázka ${index + 1}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
            />
            <button type="button" onClick={() => removeQuestion(index)}>
              Odebrat
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Přidat otázku
        </button>
      </div>

      <button type="submit">Uložit</button>
      <button type="button" onClick={onBack}>
        Zpět
      </button>
    </form>
  );
};

export default VoteFormView;
