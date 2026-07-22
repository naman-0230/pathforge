// codeExecutor/adapters/piston.js — Piston (emkc.org) HTTP client.
//
// Piston is a free, public code execution service. Used as the zero-cost
// prototype backend. Same request/response contract as Judge0 mostly, but
// implementation details differ.
//
// LIMITS (as of 2024):
//   - Rate limit: ~5 requests/sec per IP
//   - Max execution time: ~3s
//   - Max output: 1 MB
//   - No API key, no signup
//
// RELIABILITY: There is NO SLA. If Piston goes down, executor calls fail.
// Acceptable for prototype scale (< 100 users). Swap to Judge0 when paying
// users need reliability.
//
// LANGUAGE VERSIONS (as of 2024, use * for latest):
//   cpp    — GCC 10.2.0
//   java   — OpenJDK 15.0.2
//   python — Python 3.10.0

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

// Language name mapping — Piston uses specific keys
const LANGUAGE_MAP = {
  cpp: 'cpp',
  java: 'java',
  python: 'python',
};

// File name Piston uses when compiling. Some languages care about
// filename (Java specifically — must be Main.java for `class Main`).
const FILE_NAMES = {
  cpp: 'main.cpp',
  java: 'Main.java',
  python: 'main.py',
};

export const pistonAdapter = {
  name: 'piston',

  // execute — sends a compile+run request to Piston.
  // Returns normalized response shape:
  //   {
  //     stdout,         program output (or empty)
  //     compileError,   compile stage failure (string) or null
  //     runtimeError,   run stage failure (string) or null
  //     timedOut,       true if TLE
  //     time,           execution time in ms
  //   }
  async execute({ language, code, stdin }) {
    const pistonLang = LANGUAGE_MAP[language];
    if (!pistonLang) {
      throw new Error(`Piston: unsupported language ${language}`);
    }

    const payload = {
      language: pistonLang,
      version: '*', // latest version of this language on Piston
      files: [
        {
          name: FILE_NAMES[language],
          content: code,
        },
      ],
      stdin: stdin || '',
      // Piston enforces these limits internally, but we can be explicit
      compile_timeout: 10000, // 10s to compile
      run_timeout: 3000,      // 3s to run
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    let response;
    try {
      response = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      throw new Error(`Network error contacting Piston: ${networkErr.message}`);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Piston returned ${response.status}: ${text.slice(0, 200)}`);
    }

    const data = await response.json();

    // Compile stage failure — only present for compiled languages (C++/Java)
    if (data.compile && data.compile.code !== 0) {
      return {
        stdout: '',
        compileError: data.compile.stderr || data.compile.output || 'Compile failed',
        runtimeError: null,
        timedOut: false,
        time: 0,
      };
    }

    const run = data.run || {};

    // Detect timeout — Piston marks this in signal field
    if (run.signal === 'SIGKILL' || run.signal === 'SIGTERM') {
      return {
        stdout: run.stdout || '',
        compileError: null,
        runtimeError: null,
        timedOut: true,
        time: 3000,
      };
    }

    // Runtime error — non-zero exit code with stderr content
    if (run.code !== 0 && run.stderr) {
      return {
        stdout: run.stdout || '',
        compileError: null,
        runtimeError: run.stderr.slice(0, 500),
        timedOut: false,
        time: run.wall_time || run.cpu_time || 0,
      };
    }

    // Success (or empty stdout — user forgot to print anything)
    return {
      stdout: run.stdout || '',
      compileError: null,
      runtimeError: null,
      timedOut: false,
      time: run.wall_time || run.cpu_time || 0,
    };
  },
};