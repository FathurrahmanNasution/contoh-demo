import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, UploadCloud, Copy, CheckCircle2, Download, Zap, FileText, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SummaryMode, SummaryResult } from '../types';

const MOCK_DATA = {
  error: {
    content: `### 🚨 Critical Vulnerability & Exception Detected\n\n**Root Cause Analysis:**\nNullReferenceException at \`AuthService.validateToken\` due to malformed JWT payload coming from the staging environment.\n\n**Isolated Code Line:**\n\`\`\`typescript\n// src/services/AuthService.ts:42\nconst userId = tokenPayload.user.id; // TypeError: Cannot read properties of undefined (reading 'id')\n\`\`\`\n\n**Recommended Fix:**\nAdd payload validation and optional chaining:\n\`\`\`typescript\nconst userId = tokenPayload?.user?.id;\nif (!userId) throw new Error("Invalid Auth Token Structure");\n\`\`\`\n`,
    timeSaved: 'Saved 120 mins of debugging',
  },
  action: {
    content: `### 📋 Meeting Action Items\n\n- [ ] **Frontend Team**: Implement the new drag-and-drop file uploader component by Thursday.\n- [ ] **Sarah**: Review the updated Figma designs for the analytics dashboard and provide feedback.\n- [ ] **DevOps**: Provision a new staging database cluster with increased IOPS.\n- [ ] **Backend Team**: Fix the pagination bug on the \`/api/v2/users\` endpoint before the sprint ends.`,
    timeSaved: 'Saved 45 mins of reading transcripts',
  },
  api: {
    content: `### ⚡ API Documentation Highlights\n\n- **Base URL:** \`https://api.v3.docupulse.io\`\n- **Authentication:** Bearer Token (JWT)\n\n**Key Endpoints:**\n- \`GET /documents\` - Retrieve all user documents.\n- \`POST /documents/parse\` - Submits a document for AI summarization.\n- \`DELETE /documents/{id}\` - Removes a document and its generated pulses.`,
    timeSaved: 'Saved 20 mins of reading docs',
  }
};

export default function DocuPulse() {
  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SummaryMode>('Quick Bullet Points');
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setInputText(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handlePulse = () => {
    if (!inputText.trim()) return;
    
    setIsParsing(true);
    setResult(null);

    setTimeout(() => {
      let scenario = 'action'; // default
      const lowerInput = inputText.toLowerCase();
      
      if (lowerInput.includes('error') || lowerInput.includes('exception') || lowerInput.includes('panic') || lowerInput.includes('fail')) {
        scenario = 'error';
      } else if (lowerInput.includes('api') || lowerInput.includes('endpoint') || lowerInput.includes('get') || lowerInput.includes('post')) {
        scenario = 'api';
      }

      const dummyResult = MOCK_DATA[scenario as keyof typeof MOCK_DATA];

      setResult({
        mode: selectedMode,
        content: dummyResult.content,
        timeSaved: dummyResult.timeSaved,
      });
      setIsParsing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono p-4 md:p-8 flex flex-col items-center">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 right-6 px-4 py-3 bg-zinc-900 border border-cyan-500/50 rounded-md shadow-lg flex items-center gap-3 z-50 text-[10px] font-bold text-white uppercase tracking-widest"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Output Copied to Clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl flex flex-col gap-8 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ opacity: [1, 0.3, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
              />
              <h1 className="text-xl font-bold tracking-tight text-white">DOCU<span className="text-cyan-400">PULSE</span></h1>
            </div>
            <div className="hidden md:block h-4 w-px bg-zinc-800"></div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest hidden md:block">
              Neural summarization engine
            </p>
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">System Status</span>
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Operational</span>
            </div>
            <div className="hidden md:flex w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 items-center justify-center text-[10px] text-cyan-400 font-bold">
              SD
            </div>
          </div>
        </header>

        {/* Main Grid: Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch border-b border-zinc-800">
          
          {/* LEFT: Input Area */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 p-6 border-b lg:border-b-0 lg:border-r border-zinc-800">
            <div className="space-y-2 flex flex-col flex-1">
              <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Source Input</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex-1 min-h-[320px] rounded-md border transition-all duration-300 flex flex-col overflow-hidden ${isDragging ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-zinc-800 bg-zinc-900/50 focus-within:border-cyan-500/50'}`}
              >
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste logs, documentation, or transcripts here..."
                  className="w-full h-full bg-transparent text-zinc-400 p-4 text-xs resize-none focus:outline-none leading-relaxed"
                />
                
                {!inputText && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-zinc-600 opacity-60">
                    <UploadCloud className="w-10 h-10 mb-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">DRAG & DROP OR PASTE</span>
                  </div>
                )}
                
                {inputText && (
                  <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-none">
                    <div className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700 text-[9px] text-zinc-500">{inputText.length} CHARS</div>
                    <div className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700 text-[9px] text-zinc-500">UTF-8</div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Summary Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Quick Bullet Points', label: 'QUICK BULLETS' },
                    { id: 'Technical Deep Dive', label: 'DEEP DIVE' },
                    { id: 'Action Items Only', label: 'ACTION ITEMS' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id as SummaryMode)}
                      className={`px-3 py-2 text-[10px] border transition-all rounded font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis
                        ${selectedMode === mode.id ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400' : 'border-zinc-800 bg-zinc-900 hover:border-cyan-500/50 text-zinc-400'}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handlePulse}
                disabled={isParsing || !inputText.trim()}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm tracking-widest rounded-md shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                <span>{isParsing ? 'PROCESSING...' : 'PULSE & AUTOMATE'}</span>
                {!isParsing && <Zap className="w-4 h-4 ml-1" />}
              </button>
            </div>
            
          </div>

          {/* RIGHT: Output Area */}
          <div className="col-span-1 lg:col-span-7 flex flex-col bg-zinc-900/20">
             
              {/* Output Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/40">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Efficiency Gain</span>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-widest">+84% Saved Time</span>
                  </div>
                  {result && (
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Time Saved</span>
                      <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{result.timeSaved.replace('Saved ', '').toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    disabled={!result}
                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] hover:bg-zinc-700 transition-colors text-zinc-300 disabled:opacity-50 tracking-widest font-bold uppercase"
                  >
                    Export .MD
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    disabled={!result}
                    className="px-3 py-1.5 bg-cyan-600/20 border border-cyan-500/40 rounded text-[10px] hover:bg-cyan-600/30 transition-colors text-cyan-400 disabled:opacity-50 tracking-widest font-bold uppercase flex items-center gap-1"
                  >
                    Sync to Slack
                  </button>
                </div>
              </div>

              {/* Output Content */}
              <div className="flex-1 p-8 overflow-y-auto w-full relative min-h-[500px]">
                 {isParsing && (
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-900">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      />
                    </div>
                 )}

                 {!result && !isParsing && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-60">
                      <FileText className="w-12 h-12 mb-4" />
                      <p className="uppercase text-[10px] font-bold tracking-widest text-center">Output stream empty.<br/>Awaiting system pulse.</p>
                    </div>
                 )}

                 {isParsing && (
                    <div className="h-full flex flex-col items-start justify-start text-cyan-600 font-mono text-xs leading-relaxed space-y-2 mt-4">
                      <motion.div
                        animate={{ opacity: [0, 1] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                      >
                         &gt; Initializing neural summarization...<br/>
                         &gt; Parsing unformatted strings...<br/>
                         &gt; Analyzing context boundaries...<br/>
                         <span className="animate-pulse">_</span>
                      </motion.div>
                    </div>
                 )}

                 {result && !isParsing && (
                   <div 
                     className="markdown-body prose prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-h2:text-white prose-h2:uppercase prose-h2:tracking-widest prose-a:text-cyan-400 max-w-none text-xs cursor-pointer"
                     onClick={copyToClipboard}
                   >
                     <ReactMarkdown>{result.content}</ReactMarkdown>
                   </div>
                 )}
              </div>
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="h-8 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-600 tracking-tighter uppercase font-bold">Prompt_Engine: Active</span>
            <span className="text-[10px] text-zinc-600 tracking-tighter uppercase font-bold">Latency: 124ms</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Node_Synced
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
