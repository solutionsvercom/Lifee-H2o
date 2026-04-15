import { execSync, spawn } from 'node:child_process';

const BACKEND_PORT = Number(process.env.BACKEND_PORT || 5000);

function getListeningPidsOnWindows(port) {
  const output = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
  const lines = output.split(/\r?\n/);
  const pids = new Set();

  for (const line of lines) {
    const normalized = line.trim().replace(/\s+/g, ' ');
    if (!normalized.startsWith('TCP ')) continue;
    if (!normalized.includes(`:${port} `)) continue;
    if (!normalized.includes(' LISTENING ')) continue;

    const parts = normalized.split(' ');
    const pid = Number(parts[parts.length - 1]);
    if (Number.isFinite(pid) && pid > 0 && pid !== process.pid) {
      pids.add(pid);
    }
  }

  return [...pids];
}

function killPidWindows(pid) {
  execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
}

if (process.platform === 'win32') {
  const pids = getListeningPidsOnWindows(BACKEND_PORT);
  if (pids.length > 0) {
    console.log(`[start] Found existing process(es) on port ${BACKEND_PORT}: ${pids.join(', ')}`);
    for (const pid of pids) {
      try {
        killPidWindows(pid);
        console.log(`[start] Stopped PID ${pid} on port ${BACKEND_PORT}`);
      } catch {
        console.warn(`[start] Could not stop PID ${pid}; attempting backend start anyway.`);
      }
    }
  }
}

console.log(`[start] Starting backend on port ${BACKEND_PORT}...`);

const child = spawn('node', ['../backend/server.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
