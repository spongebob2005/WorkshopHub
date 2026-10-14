import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { PageLoader, PageMessage, btn } from '../components/PageState';

const ease = [0.22, 1, 0.36, 1] as const;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const PASS_MARK = 70;

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

// Sample quiz questions - replace with real quiz data from the workshop when available
const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is React primarily used for?',
    options: ['Database management', 'Building user interfaces', 'Server-side programming', 'Network security'],
    correctAnswer: 1,
    explanation: 'React is a JavaScript library for building user interfaces, particularly for single-page applications.',
  },
  {
    id: 2,
    question: 'Which hook is used for managing state in functional components?',
    options: ['useEffect', 'useContext', 'useState', 'useReducer'],
    correctAnswer: 2,
    explanation: 'useState is the primary hook for managing local state in React functional components.',
  },
  {
    id: 3,
    question: 'What does JSX stand for?',
    options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
    correctAnswer: 0,
    explanation: 'JSX stands for JavaScript XML, a syntax extension that allows you to write HTML-like code in JavaScript.',
  },
  {
    id: 4,
    question: 'What is the virtual DOM in React?',
    options: ['A physical copy of the DOM', 'A lightweight copy of the real DOM kept in memory', 'A browser feature', 'A CSS framework'],
    correctAnswer: 1,
    explanation: 'The virtual DOM is a lightweight representation of the real DOM that React uses to optimize updates.',
  },
  {
    id: 5,
    question: 'Which method is used to update state in a class component?',
    options: ['this.updateState()', 'this.setState()', 'this.changeState()', 'this.modifyState()'],
    correctAnswer: 1,
    explanation: 'this.setState() is the method used to update state in React class components.',
  },
];

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export const QuizPage = () => {
  const { workshopId, quizIndex } = useParams<{ workshopId: string; quizIndex: string }>();
  const { getWorkshopById, getBookingsByWorkshop, loading } = useWorkshops();
  const { user, isAuthenticated } = useAuth();
  const workshop = getWorkshopById(workshopId!);

  const isUserRegistered =
    isAuthenticated &&
    !!workshop &&
    getBookingsByWorkshop(workshop.id).some(b => b.status === 'confirmed' && b.userId === user?.id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const quizTitle = workshop?.learningContent?.mcqs?.[Number(quizIndex)]?.title || 'Workshop quiz';
  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;
  const isLast = currentQuestionIndex === totalQuestions - 1;
  const active = isUserRegistered && !quizCompleted;

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [active]);

  const handleSubmitAnswer = () => {
    if (selectedOption === null || showResult) return;
    setAnswers(prev => [
      ...prev,
      { questionId: currentQuestion.id, selectedAnswer: selectedOption, isCorrect: selectedOption === currentQuestion.correctAnswer },
    ]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (!isLast) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResult(false);
    setQuizCompleted(false);
    setTimeElapsed(0);
  };

  // Keyboard: A-D or 1-4 to pick, Enter to submit / continue
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      const key = e.key.toUpperCase();
      const byLetter = LETTERS.indexOf(key);
      const byNumber = Number(key) - 1;
      const pick = byLetter >= 0 ? byLetter : Number.isInteger(byNumber) && byNumber >= 0 ? byNumber : -1;
      if (!showResult && pick >= 0 && pick < currentQuestion.options.length) {
        setSelectedOption(pick);
      } else if (e.key === 'Enter' && (e.target as HTMLElement)?.tagName !== 'BUTTON') {
        if (showResult) handleNextQuestion();
        else handleSubmitAnswer();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (loading) return <PageLoader />;

  if (!workshop) {
    return (
      <PageMessage
        eyebrow="Quiz"
        title="That workshop doesn't exist."
        body="The quiz link points at a workshop that's no longer in the catalog."
        actions={
          <Link to="/" className={btn.primary}>
            Browse workshops
          </Link>
        }
      />
    );
  }

  if (!isUserRegistered) {
    return (
      <PageMessage
        eyebrow="Members only"
        title="Book a seat to take this quiz."
        body={
          <>
            Quizzes for <span className="text-gray-900">{workshop.title}</span> are part of the course materials, which unlock once you've booked.
          </>
        }
        actions={
          <>
            <Link to={`/workshop/${workshopId}`} className={btn.primary}>
              View workshop
            </Link>
            <Link to="/" className={btn.ghost}>
              All workshops
            </Link>
          </>
        }
      />
    );
  }

  // Results
  if (quizCompleted) {
    const correct = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correct / totalQuestions) * 100);
    const isPassed = percentage >= PASS_MARK;

    return (
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 md:pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <p className="eyebrow text-indigo-700">{quizTitle}</p>
          <h1 className="mt-3 text-4xl tracking-[-0.035em] text-gray-900 sm:text-5xl">
            {isPassed ? 'Passed.' : 'Not quite yet.'}
          </h1>
          <p className="mt-3 max-w-[50ch] text-gray-500">
            {isPassed
              ? 'You cleared the pass mark. Review the explanations below for anything you guessed.'
              : `You need ${PASS_MARK}% to pass. Go over the questions you missed, then try again.`}
          </p>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-10 grid grid-cols-2 gap-y-6 border-y border-gray-200 py-6 sm:grid-cols-4"
        >
          <div>
            <dt className="text-xs text-gray-500">Score</dt>
            <dd className={`mt-1 font-mono text-3xl tabular ${isPassed ? 'text-indigo-700' : 'text-gray-900'}`}>{percentage}%</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Correct</dt>
            <dd className="mt-1 font-mono text-3xl text-gray-900 tabular">{correct}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Missed</dt>
            <dd className="mt-1 font-mono text-3xl text-gray-900 tabular">{totalQuestions - correct}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Time</dt>
            <dd className="mt-1 font-mono text-3xl text-gray-900 tabular">{formatTime(timeElapsed)}</dd>
          </div>
        </motion.dl>

        <section className="mt-10" aria-label="Answer review">
          <h2 className="text-lg text-gray-900">Review</h2>
          <ol className="mt-4 space-y-2">
            {quizData.map((question, index) => {
              const answer = answers[index];
              const right = answer?.isCorrect;
              return (
                <motion.li
                  key={question.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.05, ease }}
                  className="rounded-xl bg-white p-4 ring-1 ring-gray-900/[0.06]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                        right ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                      aria-label={right ? 'Correct' : 'Incorrect'}
                    >
                      {right ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="mr-2 font-mono text-xs text-gray-400 tabular">Q{index + 1}</span>
                        {question.question}
                      </p>
                      <p className="mt-1.5 text-sm text-gray-500">
                        {!right && answer && (
                          <>
                            You said <span className="text-gray-700 line-through decoration-red-300">{question.options[answer.selectedAnswer]}</span>.{' '}
                          </>
                        )}
                        Answer: <span className="text-gray-900">{question.options[question.correctAnswer]}</span>
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button onClick={handleRetryQuiz} className={btn.secondary}>
            <RotateCcw className="size-4" />
            Retake quiz
          </button>
          <Link to={`/workshop/${workshopId}`} className={`${btn.primary} group`}>
            Back to workshop
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    );
  }

  // Question view
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <Link to={`/workshop/${workshopId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900">
        <ArrowLeft className="size-4" />
        {workshop.title}
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-indigo-700">Quiz</p>
          <h1 className="mt-2 text-2xl tracking-[-0.03em] text-gray-900 sm:text-3xl">{quizTitle}</h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm text-gray-500 tabular">
          <span aria-label="Time elapsed">{formatTime(timeElapsed)}</span>
          <span className="h-4 w-px bg-gray-200" />
          <span>
            <span className="text-gray-900">{currentQuestionIndex + 1}</span>/{totalQuestions}
          </span>
        </div>
      </header>

      {/* Segmented progress: one bar per question, coloured by result */}
      <div className="mt-5 flex gap-1.5" aria-hidden>
        {quizData.map((q, i) => {
          const a = answers[i];
          const color = a ? (a.isCorrect ? 'bg-emerald-500' : 'bg-red-400') : i === currentQuestionIndex ? 'bg-gray-900' : 'bg-gray-200';
          return <span key={q.id} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${color}`} />;
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease }}
          className="mt-10"
          aria-live="polite"
        >
          <h2 className="text-xl leading-snug text-gray-900 sm:text-2xl">{currentQuestion.question}</h2>

          <div role="radiogroup" aria-label="Answers" className="mt-6 space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const markCorrect = showResult && isCorrect;
              const markWrong = showResult && isSelected && !isCorrect;

              const tone = markCorrect
                ? 'bg-emerald-50 ring-emerald-500 text-gray-900'
                : markWrong
                  ? 'bg-red-50 ring-red-400 text-gray-900'
                  : isSelected
                    ? 'bg-white ring-2 ring-gray-900 text-gray-900'
                    : showResult
                      ? 'bg-white ring-gray-900/[0.06] text-gray-400'
                      : 'bg-white ring-gray-900/[0.06] text-gray-700 hover:ring-gray-900/20';

              const keyTone = markCorrect
                ? 'bg-emerald-600 text-white'
                : markWrong
                  ? 'bg-red-500 text-white'
                  : isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500';

              return (
                <button
                  key={index}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => !showResult && setSelectedOption(index)}
                  disabled={showResult}
                  className={`press flex w-full items-center gap-4 rounded-xl p-3.5 text-left ring-1 transition-[box-shadow,background-color,color] disabled:cursor-default ${tone}`}
                >
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs transition-colors ${keyTone}`}>
                    {markCorrect ? <Check className="size-3.5" strokeWidth={3} /> : markWrong ? <X className="size-3.5" strokeWidth={3} /> : LETTERS[index]}
                  </span>
                  <span className="text-[0.95rem]">{option}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <div className="mt-6 border-l-2 border-indigo-500 pl-4">
                  <p className="text-sm text-gray-900">
                    {answers[currentQuestionIndex]?.isCorrect ? 'Correct.' : 'Not quite.'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{currentQuestion.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="hidden text-xs text-gray-400 sm:block">
              Press <kbd className="rounded border border-gray-200 bg-white px-1 font-mono">A</kbd>–
              <kbd className="rounded border border-gray-200 bg-white px-1 font-mono">{LETTERS[currentQuestion.options.length - 1]}</kbd> to choose,{' '}
              <kbd className="rounded border border-gray-200 bg-white px-1 font-mono">Enter</kbd> to continue
            </p>
            {!showResult ? (
              <button onClick={handleSubmitAnswer} disabled={selectedOption === null} className={`${btn.primary} ml-auto`}>
                Check answer
              </button>
            ) : (
              <button onClick={handleNextQuestion} className={`${btn.primary} group ml-auto`}>
                {isLast ? 'See results' : 'Next question'}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  );
};
