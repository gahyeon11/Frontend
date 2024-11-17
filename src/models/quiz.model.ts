export interface QuizItem{
    quizId: number;
    word: string;
    definition: string;
    initialConstant: string;
    wordLength: number;
    quizAnswerStats : IquizAnswerStats;
}

export interface IquizAnswerStats{
    correctAnswersCount : number;
    totalAttemptsUntilFirstCorrectAnswer: number;

}

export interface quizAnswer{
    isCorrectAnswer : boolean;
    correctAnswer : string;
}

export interface QuizResult {
    totalQuizCount: number;
    solvedQuizCount: number;
    totalQuizScore: number;
    quizId: number,
  }
  