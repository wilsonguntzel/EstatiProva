import { useEffect, useMemo, useRef, useState } from 'react';
import './answerGrid.css';

function normalizeToken(value) {
  const token = value.trim().toUpperCase();
  if (!token) return null;
  if (token === '-' || token === 'X' || token === 'NULL') return null;
  return token;
}

function isValidForQuestion(token, allowed) {
  if (token === null) return true;
  return allowed.includes(token);
}

function parsePaste(raw) {
  const cleaned = raw
    .toUpperCase()
    .replace(/\r/g, '\n')
    .replace(/[;|]/g, ',')
    .replace(/\s+/g, '')
    .trim();

  if (/[\n,]/.test(cleaned)) {
    return cleaned.split(/[\n,]+/).map(normalizeToken);
  }

  return cleaned.split('').map((char) => normalizeToken(char));
}

export default function AnswerGrid({
  prova,
  answers,
  onAnswersChange,
  pageStart = 0,
  pageEnd,
  autoAdvanceToNextPage
}) {
  const total = prova.questoes.length;
  const end = pageEnd ?? total;

  const inputRefs = useRef([]);
  const [errors, setErrors] = useState({});

  const slice = useMemo(() => {
    const out = [];
    for (let i = pageStart; i < end; i += 1) {
      out.push({ idx: i, q: prova.questoes[i] });
    }
    return out;
  }, [end, pageStart, prova.questoes]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, total);
  }, [total]);

  function findNextEnabled(fromIdx) {
    for (let i = fromIdx + 1; i < end; i += 1) {
      if (prova.questoes[i].status !== 'ANULADA') return i;
    }
    return null;
  }

  function findPrevEnabled(fromIdx) {
    for (let i = fromIdx - 1; i >= pageStart; i -= 1) {
      if (prova.questoes[i].status !== 'ANULADA') return i;
    }
    return null;
  }

  function focusIdx(idx) {
    const el = inputRefs.current[idx];
    if (el) {
      el.focus();
      if (el.select) el.select();
    }
  }

  function setAnswer(idx, token, advanceIfValid) {
    const allowed = prova.questoes[idx].respostas ?? [];
    const isValid = isValidForQuestion(token, allowed);

    setErrors((prev) => {
      const next = { ...prev };
      if (!isValid) next[idx] = `Inválido. Esperado: ${allowed.join(', ')}`;
      else delete next[idx];
      return next;
    });

    if (!isValid) return;

    const nextAnswers = answers.slice();
    nextAnswers[idx] = token;
    onAnswersChange(nextAnswers);

    if (!advanceIfValid || token === null) return;

    const nextIdx = findNextEnabled(idx);
    if (nextIdx !== null) {
      focusIdx(nextIdx);
      return;
    }

    if (autoAdvanceToNextPage) autoAdvanceToNextPage();
  }

  function handleInputChange(idx, raw) {
    if (prova.questoes[idx].status === 'ANULADA') return;

    const token = normalizeToken(raw);
    const single = token ? token.slice(0, 1) : null;
    setAnswer(idx, single, true);
  }

  function handleKeyDown(idx, event) {
    if (prova.questoes[idx].status === 'ANULADA') return;

    if (event.key === 'Backspace' && answers[idx] === null) {
      event.preventDefault();
      const prevIdx = findPrevEnabled(idx);
      if (prevIdx !== null) focusIdx(prevIdx);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIdx = findPrevEnabled(idx);
      if (prevIdx !== null) focusIdx(prevIdx);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      const nextIdx = findNextEnabled(idx);
      if (nextIdx !== null) focusIdx(nextIdx);
    }
  }

  function handlePaste(idx, event) {
    if (prova.questoes[idx].status === 'ANULADA') return;

    const text = event.clipboardData.getData('text');
    if (!text) return;

    const tokens = parsePaste(text);
    if (!tokens.length) return;

    event.preventDefault();

    const nextAnswers = answers.slice();
    let cursor = idx;

    for (let k = 0; k < tokens.length && cursor < end; k += 1) {
      while (cursor < end && prova.questoes[cursor].status === 'ANULADA') cursor += 1;
      if (cursor >= end) break;

      const allowed = prova.questoes[cursor].respostas ?? [];
      const token = tokens[k] ? String(tokens[k]).slice(0, 1) : null;

      if (!isValidForQuestion(token, allowed)) {
        setErrors((prev) => ({
          ...prev,
          [cursor]: `Inválido. Esperado: ${allowed.join(', ')}`
        }));
        break;
      }

      nextAnswers[cursor] = token;
      setErrors((prev) => {
        const next = { ...prev };
        delete next[cursor];
        return next;
      });
      cursor += 1;
    }

    onAnswersChange(nextAnswers);

    const nextIdx = findNextEnabled(cursor - 1);
    if (nextIdx !== null) focusIdx(nextIdx);
  }

  return (
    <div className="answer-grid-wrap">
      <div className="answer-grid">
        {slice.map(({ idx, q }) => {
          const value = answers[idx] ?? '';
          const disabled = q.status === 'ANULADA';
          const hasError = Boolean(errors[idx]);

          return (
            <div key={idx} className={`cell ${disabled ? 'cell-disabled' : ''}`}>
              <div className="cell-top">
                <span className="qnum">Q{idx + 1}</span>
                <span className="disc-tag">{q.disciplinaKey}</span>
              </div>

              <input
                value={value}
                disabled={disabled}
                maxLength={1}
                autoComplete="off"
                className={`cell-input ${hasError ? 'cell-input-error' : ''}`}
                onChange={(ev) => handleInputChange(idx, ev.target.value)}
                onKeyDown={(ev) => handleKeyDown(idx, ev)}
                onPaste={(ev) => handlePaste(idx, ev)}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                placeholder={disabled ? '—' : ''}
                title={hasError ? errors[idx] : ''}
              />

              {disabled ? <div className="cell-note">ANULADA</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
