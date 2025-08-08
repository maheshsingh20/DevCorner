import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Editor from '@monaco-editor/react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 font-semibold">LearnX</div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

function Home() {
  return <div>Welcome to LearnX</div>;
}

function Dashboard() {
  return <div>Dashboard</div>;
}

function Problems() {
  return <div>Problems list</div>;
}

function ProblemView() {
  const [code, setCode] = useState<string>('// Write your solution');
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="prose max-w-none">
        <h2>Two Sum</h2>
        <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
      </div>
      <div className="h-[60vh] border">
        <Editor height="100%" language="typescript" value={code} onChange={(v) => setCode(v || '')} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
