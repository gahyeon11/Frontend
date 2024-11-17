import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import next from "../assets/quizImg/next.png";
import hintD from "../assets/quizImg/hintD.png";
import hintH from "../assets/quizImg/hintH.png";
import { CiClock2 } from "react-icons/ci";
import { theme } from "../styles/theme";
import { useQuizzes } from "../hooks/useQuizzes";
import HintModal from "../components/quiz/HintModal";
import { useNavigate } from "react-router-dom";
import { useAnswer } from "../hooks/useAnswer";
import { useSaveQuizResult } from "../hooks/useSaveQuizResult";

function Quiz() {
  const [currentScore, setCurrentScore] = useState<number>(10);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [progressNum, setProgressNum] = useState<number>(0);
  const { quizzes } = useQuizzes();
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [answer, setAnswer] = useState("");
  const { loading, error, isCorrectAnswer, correctAnswer, submitAnswer } = useAnswer();

  const currentQuiz = quizzes[currentIndex];

  const [inputText, setInputText] = useState<string>("");
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };
  const [isCorrect, setIsCorrect] = useState<string>(theme.color.grey4);
  const [resultText, setResultText] = useState<string>("");
  const [correctRate, setCorrectRate] = useState<number>(0);
 
  const saveQuizResult = useSaveQuizResult(); 

  useEffect(() => {
    if (currentQuiz && currentQuiz.quizAnswerStats) {
      const correctAnswersCount = currentQuiz.quizAnswerStats.correctAnswersCount;
      const totalAttempts = currentQuiz.quizAnswerStats.totalAttemptsUntilFirstCorrectAnswer;
      if (totalAttempts > 0) {
        setCorrectRate((correctAnswersCount / totalAttempts) * 100);
      } else {
        setCorrectRate(0);
      }
    } else {
      // currentQuiz나 quizAnswerStats가 없을 때 예외 처리
      setCorrectRate(0);
      console.warn("currentQuiz 또는 quizAnswerStats가 정의되지 않았습니다.");
    }
  }, [currentQuiz]);


  // 타이머 시작
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        if(resultText){
          return;
        }
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      handleTimeOut(); // 시간이 0이 되었을 때 처리
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft]);

  const handleTimeOut = async () => {
    setIsCorrect(theme.color.red);
    setResultText("오답!");
    await submitAnswer(currentQuiz.quizId, answer);
    saveQuizResult(1, 0, currentQuiz.quizId);
  };

  // 새로고침 및 뒤로가기 시 메인 화면으로 이동
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    const handleUnload = () => {
      if (sessionStorage.getItem("confirmed") !== "true") {
        sessionStorage.setItem("refreshed", "true");
        navigate("/");
      }
    };

    const handlePopState = () => {
      if (window.confirm("퀴즈가 종료됩니다. 계속하시겠습니까?")) {
        navigate("/");
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    window.addEventListener("popstate", handlePopState);

    if (sessionStorage.getItem("refreshed") === "true") {
      sessionStorage.removeItem("refreshed");
      sessionStorage.removeItem("confirmed");
      navigate("/");
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const onClickNextBtn = () => {
    if (progressNum >= 100) {
      navigate("/quiz-result", {
        state: {
          totalScore,
          totalQuestions: progressNum / 10,
        },
      });

      return;
    }
    if (resultText === "") {
      alert("답 입력 후 엔터를 눌러주세요.");
      return;
    }
    setProgressNum((state) => state + 10);
    setTimeLeft(15); // 타이머 초기화
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputText("");
      setIsCorrect(theme.color.grey4);
      setResultText("");
    } else {
      // 모든 퀴즈 완료
    }
  };

  const onMouseEnterHint = () => {
    setHintVisible(true);
  };

  const onMouseLeaveHint = () => {
    setHintVisible(false);
  };

  const renderQuizDefinition = (definition: string) => {
    const sentences = definition.split(".,");
    let charCount = 0;
    return sentences.map((sentence, index) => {
      charCount += sentence.length;
      if (index === 0 || charCount <= 40) {
        return <p key={index}>{sentence}</p>;
      }
      return null;
    });
  };

  if (!quizzes || quizzes.length === 0) {
    return <p>퀴즈를 불러오는 중...</p>;
  }
  const onSubmitAnswer = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = inputText;
    if (event.key === "Enter" && resultText === "") {
      if (value === "") {
        alert("답 입력 후 엔터를 눌러주세요.");
      } else {
        const response = await submitAnswer(currentQuiz.quizId, value);
        if(response){
          if(response.isCorrectAnswer){
            saveQuizResult(1, 10, currentQuiz.quizId);
            setIsCorrect(theme.color.green);
            setResultText("정답!");
            setTotalScore((state) => state + currentScore);
          }else{
            saveQuizResult(1, 0, currentQuiz.quizId);
            setIsCorrect(theme.color.red);
            setResultText("오답!");
          }
        }
      }
    }
  };

  return (
    <QuizWrapper>
      <div className="progressContainer">
        <div className="progressBar">
          <Progress width={progressNum} />
        </div>
        <div className="progressText">
          <span></span>
          <span>{currentIndex + 1}/10</span>
        </div>
      </div>
      <div className="infoContainer">
        <span>정답률: {correctRate}%</span>
        <TimeContainer>
          <StyledClockIcon />
          <span>{timeLeft}</span>
        </TimeContainer>
        <span>{totalScore}점</span>
      </div>
      <div className="questionBox">
        {renderQuizDefinition(currentQuiz.definition)}
      </div>
      <div className="answerBox">
        <HintWrapper
          onMouseEnter={onMouseEnterHint}
          onMouseLeave={onMouseLeaveHint}
        >
          <div className="quizButton">
            <img
              className="imgH"
              src={hintVisible ? hintH : hintD}
              alt="hint button"
            />
            <HintModal
              initialConstant={currentQuiz.initialConstant}
              visible={hintVisible}
            />
          </div>
        </HintWrapper>
        <QuizInput
          readOnly={resultText === "정답!" || resultText === "오답!"}
          onChange={onChangeInput}
          value={inputText}
          isCorrect={isCorrect}
          onKeyDown={onSubmitAnswer}
        />
        <div className="quizButton" onClick={onClickNextBtn}>
          <img className="imgN" src={next} alt="next button" />
        </div>
      </div>
      {resultText && (
        <ResultBox isCorrect={isCorrect === theme.color.green}>
          {resultText === "오답!" ? `답 : ${correctAnswer}` : "정답"}
        </ResultBox>
      )}
    </QuizWrapper>
  );
}

export default Quiz;

const QuizWrapper = styled.div`
  height: 783px;
  text-align: center;
  .quizButton {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    background-color: ${({ theme }) => theme.color.grey3};
    cursor: pointer;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .imgH {
    width: 20px;
  }
  .imgN {
    width: 17px;
  }
  .answerBox {
    display: flex;
    margin-bottom: 1rem;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  .progressContainer {
    margin: 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .progressBar {
    width: 80%;
    height: 16px;
    background-color: ${({ theme }) => theme.color.grey3};
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .infoContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 75%;
    margin: 10px auto 10px;
    padding:0px 5px 0px 5px;
    font-size: ${({ theme }) => theme.heading.text3};
    line-height: 28px;
  }
  .progressText {
    display: flex;
    justify-content: space-between;
    width: 80%;
    padding-right:5px;
    color: ${({ theme }) => theme.color.blue};
  }
  .questionBox {
    display: flex;
    width: 75%;
    height: 350px;
    margin-bottom: 1rem;
    margin: auto;
    padding: 30px;
    border: 8px solid ${({ theme }) => theme.color.grey2};
    border-radius: 5px;
    font-size: ${({ theme }) => theme.heading.title2};
    line-height: 46px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
  }
  .scores {
    display: flex;
    margin-bottom: 30px;
    font-size: ${({ theme }) => theme.heading.title4};
    line-height: 28px;
    justify-content: center;
    flex-direction: column;
  }
  .resultBox {
    margin-top: 1rem;
    font-size: ${({ theme }) => theme.heading.title2};
    justify-content: center;
  }
`;

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
  border: 1px solid ${({ theme }) => theme.color.grey2}; 
  border-radius: 8px;
  padding: 5px 10px;
  span {
    font-size: ${({ theme }) => theme.heading.text2};
    font-weight: bold;
  }
`;

const StyledClockIcon = styled(CiClock2)`
  width: 23px;
  height: 23px;
  margin-right: 7px;
  color: ${({ theme }) => theme.color.blue};
`;

const Progress = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 100%;
  border-radius: 5px;
  background-color: #2196f3;
`;

const QuizInput = styled.input<{ isCorrect: string; value: string }>`
  width: 300px;
  margin: 45px;
  padding: 1rem;
  border: 0;
  border-radius: 5px;
  background: ${(props) => props.isCorrect};
  cursor: pointer;
  color: ${(props) =>
    props.isCorrect === theme.color.grey4 ? "black" : "white"};
  text-align: center;
  outline: none;
`;

const ResultBox = styled.div<{ isCorrect: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.heading.title3};
  width: 500px;
  height: 130px;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.color.grey2};
  background-color: ${({ isCorrect, theme }) => (isCorrect ? '#d4f5d3' : '#fdecea')};
  color: ${({ theme }) => theme.color.text};
  border-color: ${({ isCorrect, theme }) => (isCorrect ? theme.color.green : theme.color.red)};
  margin: 0 auto; /* 가운데 정렬 */
  margin-top: 1rem; /* 상단 여백 추가 */
`;

const HintWrapper = styled.div`
  position: relative;
`;