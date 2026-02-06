
import React, { useState } from 'react';
import { BookOpen, Sparkles, Rocket } from 'lucide-react';
import { User } from '../types';

interface WelcomeViewProps {
  onStart: (user: User) => void;
  existingUser: User | null;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, existingUser }) => {
  const [name, setName] = useState(existingUser?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({
        name: name.trim(),
        avatarId: existingUser?.avatarId || Math.floor(Math.random() * 5),
        joinedAt: existingUser?.joinedAt || Date.now(),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f0f9ff] z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      {/* Decorative Floating Icons */}
      <div className="absolute top-20 left-10 text-blue-200 animate-float-slow">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-20 right-10 text-yellow-200 animate-float">
        <Rocket size={56} />
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 border-8 border-white relative">
        <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
          <BookOpen className="text-white" size={40} />
        </div>

        <h1 className="text-3xl sm:text-5xl font-fredoka font-bold text-blue-600 mb-2">CamSpell</h1>
        <p className="text-gray-400 mb-8 font-medium">Your magical English adventure begins here!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-4">
              {existingUser ? "Welcome back!" : "What's your name?"}
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={12}
              className="w-full bg-gray-50 border-4 border-gray-100 rounded-2xl py-4 px-6 text-xl font-fredoka focus:border-blue-400 focus:outline-none transition-all text-gray-700"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-fredoka font-bold py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 text-2xl border-b-8 border-blue-800 disabled:border-gray-300"
          >
            {existingUser ? "Let's Continue!" : "Start Journey!"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default WelcomeView;
