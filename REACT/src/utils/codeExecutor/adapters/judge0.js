// codeExecutor/adapters/judge0.js — Judge0 HTTP client.
//
// Supports two deployment modes:
//   1. Judge0 CE (free, public) — https://ce.judge0.com, no API key required
//   2. Judge0 via RapidAPI (paid) — https://judge0-ce.p.rapidapi.com, needs key
//
// The adapter auto-detects which mode based on VITE_JUDGE0_URL:
//   - If URL contains 'rapidapi.com': uses RapidAPI auth headers + requires key
//   - Otherwise: assumes CE public endpoint or self-hosted, no auth needed
//
// LANGUAGE IDs — Judge0 uses numeric IDs, not names:
//   54 = C++ (GCC 9.2.0)
//   62 = Java (OpenJDK 13.0.1)
//   71 = Python (3.8.1)
//
// SETUP:
//   Judge0 CE (current default, free):
//     VITE_JUDGE0_URL=https://ce.judge0.com
//     No API key needed
//
//   Judge0 RapidAPI (when upgrading for reliability):
//     VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
//     VITE_JUDGE0_KEY=your-rapidapi-key
//
//   Self-hosted (future — Oracle Cloud etc.):
//     VITE_JUDGE0_URL=https://your-judge0-server.example.com
//     No key needed

const JUDGE0_URL_BASE = import.meta.env.VITE_JUDGE0_URL || 'https://ce.judge0.com';
const IS_RAPIDAPI = JUDGE0_URL_BASE.includes('rapidapi.com');

const LANGUAGE_ID_MAP = {
  cpp: 54,
  java: 62,
  python: 71,
};

// Poll interval when waiting for submission to finish
const POLL_INTERVAL_MS = 500;
const MAX_POLL_ATTEMPTS = 20; // 10 seconds max wait

// buildHeaders — RapidAPI needs auth headers; CE + self-hosted don't.
function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (IS_RAPIDAPI) {
    const apiKey = import.meta.env.VITE_JUDGE0_KEY;
    if (!apiKey) {
      throw new Error(
        'Judge0 RapidAPI selected but VITE_JUDGE0_KEY is not set. ' +
        'Either set the key or use VITE_JUDGE0_URL=https://ce.judge0.com (free CE endpoint).'
      );
    }
    headers['X-RapidAPI-Key'] = apiKey;
    headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
  }
  return headers;
}

export const judge0Adapter = {
  name: 'judge0',

  async execute({ language, code, stdin }) {
    const langId = LANGUAGE_ID_MAP[language];
    if (!langId) {
      throw new Error(`Judge0: unsupported language ${language}`);
    }

    const headers = buildHeaders();

    // Step 1: Submit code (using base64 encoding for safety with special chars)
    const submitPayload = {
      source_code: toBase64(code),
      language_id: langId,
      stdin: toBase64(stdin || ''),
      cpu_time_limit: 3,
      memory_limit: 128000, // 128 MB
    };

    const submitUrl = `${JUDGE0_URL_BASE}/submissions?base64_encoded=true&wait=false`;

    let submitResp;
    try {
      submitResp = await fetch(submitUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(submitPayload),
      });
    } catch (networkErr) {
      throw new Error(`Network error contacting Judge0: ${networkErr.message}`);
    }

    if (!submitResp.ok) {
      const text = await submitResp.text().catch(() => '');
      throw new Error(`Judge0 submit failed (${submitResp.status}): ${text.slice(0, 200)}`);
    }

    const { token } = await submitResp.json();
    if (!token) throw new Error('Judge0 did not return submission token');

    // Step 2: Poll for result
    for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      const pollUrl = `${JUDGE0_URL_BASE}/submissions/${token}?base64_encoded=true`;
      let pollResp;
      try {
        pollResp = await fetch(pollUrl, { headers });
      } catch (err) {
        continue; // Transient network error, try again
      }

      if (!pollResp.ok) continue;

      const result = await pollResp.json();

      // Status 1=Queue, 2=Processing — still waiting
      if (result.status?.id === 1 || result.status?.id === 2) continue;

      // Decode base64 fields
      const stdout = result.stdout ? fromBase64(result.stdout) : '';
      const stderr = result.stderr ? fromBase64(result.stderr) : '';
      const compileOutput = result.compile_output ? fromBase64(result.compile_output) : '';

      const statusId = result.status?.id;

      // 6 = Compilation Error
      if (statusId === 6) {
        return {
          stdout: '',
          compileError: compileOutput || 'Compile error',
          runtimeError: null,
          timedOut: false,
          time: 0,
        };
      }

      // 5 = Time Limit Exceeded
      if (statusId === 5) {
        return {
          stdout,
          compileError: null,
          runtimeError: null,
          timedOut: true,
          time: (parseFloat(result.time) || 3) * 1000,
        };
      }

      // 7-12 = Various runtime errors (SIGSEGV, SIGABRT, etc.)
      if (statusId >= 7 && statusId <= 12) {
        return {
          stdout,
          compileError: null,
          runtimeError: stderr || result.status?.description || 'Runtime error',
          timedOut: false,
          time: (parseFloat(result.time) || 0) * 1000,
        };
      }

      // 3 = Accepted (any successful execution)
      return {
        stdout,
        compileError: null,
        runtimeError: null,
        timedOut: false,
        time: (parseFloat(result.time) || 0) * 1000,
      };
    }

    throw new Error('Judge0 polling timed out (> 10s)');
  },
};

// ============================================================
// HELPERS — base64 encoding for Judge0's binary-safe transport
// ============================================================

function toBase64(str) {
  if (!str) return '';
  // btoa doesn't handle UTF-8 directly; convert via encodeURIComponent trick
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return btoa(str);
  }
}

function fromBase64(str) {
  if (!str) return '';
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    try {
      return atob(str);
    } catch {
      return str;
    }
  }
}