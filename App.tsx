
import React, { useState, useCallback } from 'react';
import { summarizeBook } from './services/geminiService';
import BookInput from './components/BookInput';
import SummaryDisplay from './components/SummaryDisplay';
import { BookOpenIcon } from './components/icons/BookOpenIcon';

const App: React.FC = () => {
  const [bookTitle, setBookTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = useCallback(async () => {
    if (!bookTitle.trim()) {
      setError('Please enter a book title.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const result = await summarizeBook(bookTitle);
      setSummary(result);
    } catch (e) {
      if (e instanceof Error) {
         setError(`Failed to generate summary: ${e.message}. Ensure your API key is set correctly.`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookTitle]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <BookOpenIcon className="h-12 w-12 text-indigo-500" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              5-Minute Book Summarizer
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get the essence of any book in just five minutes. Powered by Gemini AI.
          </p>
        </header>

        <main className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800/60 shadow-2xl rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <BookInput
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              onSubmit={handleSummarize}
              isLoading={isLoading}
            />
            <SummaryDisplay
              summary={summary}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} 5-Minute Book Summarizer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
