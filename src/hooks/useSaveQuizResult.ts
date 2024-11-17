import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { result } from "../api/quiz.api";
import { QuizResult } from "../models/quiz.model";

export const useSaveQuizResult = () => {
  const { isLoggedIn } = useAuthStore();

  const saveResult = async (totalQuestions: number, totalScore: number, quizId: number) => {
    if (isLoggedIn) {
      console.log(`${totalScore} 점 저장 완료`);
      const quizResult: QuizResult = {
        totalQuizCount: totalQuestions,
        solvedQuizCount: totalScore / 10,
        totalQuizScore: totalScore,
        quizId: quizId,
      };
      try {
        await result(quizResult);
      } catch (error) {
        console.error("퀴즈 결과 저장 중 오류 발생", error);
      }
    } else {
      console.log("로그인하지 않으면 퀴즈 결과가 저장되지 않습니다.");
    }
  };

  return saveResult; // 함수 반환
};