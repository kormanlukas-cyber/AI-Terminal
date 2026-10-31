* {
  box-sizing: border-box;
}

:root {
  --bg: #0b1020;
  --panel: #121a2f;
  --panel-alt: #1a2440;
  --line: rgba(255, 255, 255, 0.08);
  --text: #edf3ff;
  --muted: #aab7ce;
  --primary: #7c9cff;
  --primary-dark: #496adf;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, "Segoe UI", sans-serif;
  background: linear-gradient(180deg, #09101b, #11192d 35%, #0a0f1d);
  color: var(--text);
}

.app-shell {
  width: min(960px, calc(100% - 32px));
  margin: 40px auto;
  background: rgba(9, 14, 27, 0.9);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(18, 26, 47, 0.8);
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.8rem;
}

.mode-picker select {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 10px;
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
}

.secondary {
  cursor: pointer;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  padding: 10px 14px;
  transition: 0.2s ease;
}

.secondary:hover {
  background: rgba(255, 255, 255, 0.04);
}

.chat-panel {
  min-height: 420px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 18px 20px;
  background: rgba(18, 26, 47, 0.4);
}

.message {
  max-width: 80%;
  padding: 14px 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--line);
  line-height: 1.5;
  white-space: pre-wrap;
}

.message.bot {
  background: var(--panel-alt);
}

.message.user {
  margin-left: auto;
  background: rgba(124, 156, 255, 0.16);
}

.message strong {
  display: block;
  margin-bottom: 6px;
}

.message p {
  margin: 0;
  color: var(--text);
}

.composer {
  display: flex;
  gap: 12px;
  padding: 18px 20px 20px;
  border-top: 1px solid var(--line);
  background: rgba(18, 26, 47, 0.9);
}

.composer input {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
}

.composer input:focus {
  outline: none;
  border-color: rgba(124, 156, 255, 0.8);
}

.composer button {
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border-radius: 12px;
  padding: 14px 18px;
  min-width: 110px;
  cursor: pointer;
  font-weight: 600;
}

.composer button:hover {
  filter: brightness(1.06);
}

@media (max-width: 640px) {
  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .app-shell {
    width: min(100% - 16px, 100%);
    margin: 16px auto;
  }

  .composer {
    flex-direction: column;
  }

  .message {
    max-width: 100%;
  }
}
