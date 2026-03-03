// Tipos de domínio (JSDoc) para referência no frontend.

/** @typedef {{key: string, abreviacaoDisciplina: string, nomeDisciplina: string, peso: number, penalidade: number}} Discipline */
/** @typedef {{id: string, disciplinaKey: string, tipoQuestao: 'MCQ'|'TF', respostas: string[], status: 'VALIDA'|'ANULADA', politicaAnulacao: 'INCLUIR'|'REMOVER'}} Question */
/** @typedef {{_id: string, orgao: string, banca: string, cargo: string, nomeProva: string, area: string, totalCandidatos: number, vagas2Etapa?: number, vagasFinal?: number, tipoProva: string[], disciplinas: Discipline[], questoes: Question[], keys?: any}} Exam */
/** @typedef {{examId: string, userId: string, bookletType: string, answers: (string|null)[], keyStageApplied: 'CROWD'|'PRELIM'|'FINAL', totalCorrect: number, totalWrong: number, totalBlank: number, totalRemoved: number, totalNet: number, totalNetPct: number, countsByDisc: Record<string, {correct:number, wrong:number, blank:number, removed:number}>, discNet: Record<string, number>, discNetPct: Record<string, number>}} Submission */
/** @typedef {{userTotal: number, percentile: number, estimatedRank: number, ci90: {low:number, high:number}, cutStage2?: {estimatedScore:number, probAbove:number}, cutFinal?: {estimatedScore:number, probAbove:number}, sampleSize:number, totalCandidates:number}} Prediction */

export {};
