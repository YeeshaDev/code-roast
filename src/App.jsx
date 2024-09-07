import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Lightbulb, LightbulbOff } from 'lucide-react';
import { analyzeCode } from './utils/analyzeCode';
import './App.css';

const CodeRoast = () => {
  const [code, setCode] = useState('');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light'); 

 
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const generateRoast = async () => {
    if (code.trim().length === 0) {
      setRoast("I can't roast what I can't see. Is this the fabled 'invisible code' I've heard so much about?");
      return;
    }
    
    if (code.length > 1000) {
      setRoast("Whoa there, War and Peace! I'm a roaster, not a library. Try a smaller chunk of your magnum opus.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeCode(code);
      
      if (!result.isValid) {
        setRoast("Nice try, but that doesn't look like valid code. Are you trying to roast the roaster? I admire your moxie, but I'm not that easy to fool!");
        return;
      }

      const { language, issues } = result;
      
      if (issues.length === 0) {
        setRoast(`${language.charAt(0).toUpperCase() + language.slice(1)} code that I can't roast? What sorcery is this? Are you secretly Linus Torvalds in disguise?`);
      } else {
        const roasts = issues.map(issue => {
          switch (issue.type) {
            case 'type':
              return `🧩 Types giving you trouble? "${issue.message}" Don't worry, that's why 'any' exists, right? (Please don't use 'any')`;
            case 'lint':
              return `🧹 Linter's having a field day: "${issue.message}" It's not angry, just disappointed.`;
            case 'length':
              return `📜 ${issue.message} Is this code or the next Game of Thrones book?`;
            case 'brackets':
              return `🎭 ${issue.message} Parentheses party gone wild!`;
            case 'todo':
              return `📅 ${issue.message} I'm sure you'll get to it... eventually.`;
            case 'debugger':
              return `🐛 ${issue.message} Debugging in production is like wearing pajamas to a wedding - bold move!`;
            case 'line-length':
              return `📏 ${issue.message} Have you heard of our lord and savior, the Enter key?`;
            default:
              return `💡 Here's a thought: ${issue.message} Revolutionary, I know.`;
          }
        });
        
        setRoast(`Alright, let's dissect this ${language} masterpiece:\n\n${roasts.join('\n\n')}\n\nDon't worry, even Shakespeare had first drafts. They were probably better than this, though.`);
      }
    } catch (error) {
      console.log(error)
      setRoast("I tried to analyze your code, but it broke me. Congratulations, you've achieved the impossible - you've created code so bad, it defies analysis!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`h-screen w-full pt-20 mx-auto bg-gray-100  transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
    <div className='max-w-2xl mx-auto py-10 px-10 rounded-lg shadow-xl border border-slate-200'>
      <div className="flex justify-between">
        <h1 className={`text-3xl font-bold mb-4 text-center transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Ultimate Code Roast 🔥
        </h1>
        <button
          onClick={toggleTheme}
          className={` px-2 rounded-md transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900 '}`}
        >
          {theme === 'dark' ? <Lightbulb /> : <LightbulbOff />}
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here (we specialize in JavaScript/TypeScript roasting, but we'll try our best with anything!)"
        className={`w-full h-64 p-2 mb-4 border rounded-md transition-colors duration-500 focus:outline-none focus:ring-2 ${
          theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' : 'bg-white text-gray-900 border-gray-300 focus:ring-slate-500'
        }`}
      />
      <button
        onClick={generateRoast}
        className={`w-full py-2 px-4  rounded-md text-white font-semibold mb-4 transition-colors duration-500 ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-900 hover:bg-slate-700'
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Roast My Code!'}
      </button>
      {roast && (
        <div className={`p-4 rounded-md shadow-md mb-4 transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}>
          <h2 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            Code Roast Result
          </h2>
          <p className="whitespace-pre-wrap">{roast}</p>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button className={`flex rounded-lg items-center py-2 px-4 border transition-colors duration-500 ${theme === 'dark' ? 'border-gray-600 text-white hover:bg-gray-600' : 'border-slate-400 text-slate-900 hover:bg-slate-200'}`}>
          <ThumbsUp className="mr-2 h-4 w-4" /> Burn!
        </button>
        <button className="flex items-center py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">
          <ThumbsDown className="mr-2 h-4 w-4" /> Too Harsh
        </button>
      </div>
    </div>
    </main>
  );
};

export default CodeRoast;
