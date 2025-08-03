import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Vote as VoteIcon, Send } from 'lucide-react';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { votingTokenService, VotingToken } from '../../lib/votingTokenService';
import { smsService } from '../../lib/smsService';

export const VotingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { votes, members, buildings, castVote } = useApp();
  const { showToast } = useToast();
  
  const [votingToken, setVotingToken] = useState<VotingToken | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'abstain'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsRequested, setSmsRequested] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const foundToken = votingTokenService.getTokenByToken(token);
    if (!foundToken) {
      showToast('Neplatný nebo expirovaný odkaz na hlasování', 'error');
      navigate('/');
      return;
    }

    setVotingToken(foundToken);
    setIsVerified(foundToken.isVerified);
    setHasVoted(foundToken.isUsed);
  }, [token, navigate, showToast]);

  const vote = votingToken ? votes.find(v => v.id === votingToken.voteId) : null;
  const member = votingToken ? members.find(m => m.id === votingToken.memberId) : null;
  const building = vote ? buildings.find(b => b.id === vote.building_id) : null;

  const sendSMSCode = async () => {
    if (!votingToken || !member || !member.phone) {
      showToast('Telefon není k dispozici', 'error');
      return;
    }

    setIsSendingSMS(true);
    
    try {
      const smsResult = await smsService.sendVerificationCode(member.phone, votingToken.verificationCode);
      if (smsResult.success) {
        showToast('SMS s ověřovacím kódem byla odeslána', 'success');
        setSmsRequested(true);
      } else {
        showToast(`Chyba při odesílání SMS: ${smsResult.message}`, 'error');
      }
    } catch (error) {
      showToast('Chyba při odesílání SMS', 'error');
    } finally {
      setIsSendingSMS(false);
    }
  };

  const handleVerification = () => {
    if (!votingToken || !verificationCode.trim()) {
      showToast('Zadejte ověřovací kód', 'error');
      return;
    }

    const success = votingTokenService.verifyToken(votingToken.token, verificationCode.trim());
    if (success) {
      setIsVerified(true);
      showToast('Ověření proběhlo úspěšně', 'success');
    } else {
      showToast('Neplatný nebo expirovaný ověřovací kód', 'error');
    }
  };

  const handleAnswerChange = (questionId: string, answer: 'yes' | 'no' | 'abstain') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitVote = async () => {
    if (!vote || !member || !votingToken) return;

    const allAnswered = vote.questions.every(q => answers[q.id]);
    if (!allAnswered) {
      showToast('Odpovězte prosím na všechny otázky', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Cast the vote
      castVote(vote.id, member.id, answers);
      
      // Mark token as used
      votingTokenService.markTokenAsUsed(votingToken.token);
      
      setHasVoted(true);
      showToast('Váš hlas byl úspěšně zaznamenán', 'success');
    } catch (error) {
      showToast('Chyba při odesílání hlasu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!votingToken || !vote || !member || !building) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Hlasování nenalezeno
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Odkaz na hlasování je neplatný nebo expirovaný.
          </p>
          <Button onClick={() => navigate('/')}>
            Zpět na hlavní stránku
          </Button>
        </Card>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Hlasování dokončeno
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Váš hlas byl úspěšně zaznamenán. Děkujeme za účast.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Hlasování: {vote.title}</p>
            <p>Člen: {member.name}</p>
            <p>Budova: {building.name}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              SMS Ověření
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pro bezpečné hlasování potřebujete ověřit svou totožnost pomocí SMS kódu.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p><strong>Hlasování:</strong> {vote.title}</p>
                <p><strong>Člen:</strong> {member.name}</p>
                {member.phone ? (
                  <p><strong>Telefon:</strong> {member.phone}</p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">
                    <strong>⚠️ Telefon není zadán - nelze hlasovat</strong>
                  </p>
                )}
              </div>
            </div>

            {!member.phone ? (
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">
                  Pro hlasování je nutné mít zadané telefonní číslo. 
                  Kontaktujte správce budovy.
                </p>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Zpět na hlavní stránku
                </Button>
              </div>
            ) : !smsRequested ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Klikněte na tlačítko níže pro odeslání SMS s ověřovacím kódem.
                  </p>
                  <Button 
                    onClick={sendSMSCode} 
                    disabled={isSendingSMS}
                    className="w-full"
                  >
                    {isSendingSMS ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Odesílá se SMS...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Odeslat SMS s kódem
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    ✅ SMS s ověřovacím kódem byla odeslána na {member.phone}
                  </p>
                </div>
                
                <Input
                  label="Ověřovací kód z SMS"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Zadejte 6-místný kód"
                  maxLength={6}
                  className="text-gray-900 dark:text-gray-100"
                />

                <div className="flex space-x-2">
                  <Button onClick={handleVerification} className="flex-1">
                    Ověřit a pokračovat
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={sendSMSCode}
                    disabled={isSendingSMS}
                    size="sm"
                  >
                    {isSendingSMS ? '...' : 'Znovu'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <VoteIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {vote.title}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>Budova:</strong> {building.name}</p>
              <p><strong>Člen:</strong> {member.name} (jednotka {member.unit})</p>
              <p><strong>Váha hlasu:</strong> {member.voteWeight}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Popis hlasování
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {vote.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Hlasovací otázky
            </h3>
            
            {vote.questions.map((question, index) => (
              <Card key={question.id} className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                  {index + 1}. {question.text}
                </h4>
                
                <div className="space-y-3">
                  {(['yes', 'no', 'abstain'] as const).map((option) => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {option === 'yes' && '✅ Ano'}
                        {option === 'no' && '❌ Ne'}
                        {option === 'abstain' && '⚪ Zdržuji se'}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Kvórum: {question.quorumType === 'simple' && 'Prostá většina (1/2)'}
                  {question.quorumType === 'qualified' && 'Kvalifikovaná většina (2/3)'}
                  {question.quorumType === 'unanimous' && 'Jednomyslné'}
                  {question.quorumType === 'custom' && question.customQuorum && 
                    `Vlastní (${question.customQuorum.numerator}/${question.customQuorum.denominator})`
                  }
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmitVote}
              disabled={isSubmitting || !vote.questions.every(q => answers[q.id])}
              size="lg"
              className="px-8"
            >
              {isSubmitting ? 'Odesílá se...' : 'Odeslat hlas'}
            </Button>
            
            {!vote.questions.every(q => answers[q.id]) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Odpovězte prosím na všechny otázky
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
