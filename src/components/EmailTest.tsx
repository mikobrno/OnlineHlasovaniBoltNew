import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_EMAIL_MUTATION } from '../graphql/mutations/sendEmail';
import { Alert, Button, TextField, Box, CircularProgress } from '@mui/material';

export const EmailTest: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [sendEmail, { loading }] = useMutation(SEND_EMAIL_MUTATION, {
    onCompleted: (data) => {
      if (data.sendEmail.ok) {
        setStatus({ message: 'Email byl úspěšně odeslán', type: 'success' });
      } else {
        setStatus({ message: `Chyba: ${data.sendEmail.error}`, type: 'error' });
      }
    },
    onError: (error) => {
      setStatus({ message: `Chyba: ${error.message}`, type: 'error' });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    
    try {
      await sendEmail({
        variables: {
          to,
          subject,
          text
        }
      });
    } catch (error) {
      // Chyby jsou zachyceny v onError výše
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <h2>Test odeslání emailu</h2>
      
      {status && (
        <Alert severity={status.type} sx={{ mb: 2 }}>
          {status.message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Příjemce"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Předmět"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Text zprávy"
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
        required
        multiline
        rows={4}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Odeslat testovací email'}
      </Button>
    </Box>
  );
};
