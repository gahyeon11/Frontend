import { useState } from "react";
import { fetchAnswer } from "../api/quiz.api";

export const useAnswer= () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorrectAnswer, setIsCorrect] = useState<boolean | null>(null); // 정답 여부 저장
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null); // 올바른 답 저장

  // 퀴즈 답안을 제출하는 함수
  const submitAnswer = async (quizId: number, answer: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAnswer(quizId, answer);

      // 서버로부터 받은 응답에서 isCorrectAnswer와 correctAnswer를 저장
      setIsCorrect(response.isCorrectAnswer);
      setCorrectAnswer(response.correctAnswer);

      return response; 
    } catch (err) {
      setError('답안 제출에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, isCorrectAnswer, correctAnswer, submitAnswer };
};