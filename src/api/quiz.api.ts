import { quizAnswer, QuizItem, QuizResult } from "../models/quiz.model";
import { httpClient } from "./http";

interface FetchQuizzesResponse {
  quizzes: QuizItem[];
}

export const fetchQuizzes = async () => {
  try{
    const response = await httpClient.get<FetchQuizzesResponse>("/quizzes");
    return response.data;
  }catch (error) {
    return {
      quizzes: [],
    };
  }   
};

export const fetchAnswer = async (quizId: number, answer: string) : Promise<quizAnswer>=> {
  try{
    const response = await httpClient.get<quizAnswer>(`/quizzes/${quizId}/mark?answer=${answer}`);
    return response.data;
  }catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }   
};

// 퀴즈 결과 저장
export const result = async (data: QuizResult) => {
  try {
    await httpClient.post("/quizzes/result", data);
  } catch (error) {
    console.error("결과 저장에 실패하였습니다.", error);
  }
};

