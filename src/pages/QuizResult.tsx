import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSaveQuizResult } from "../hooks/useSaveQuizResult";
import ConfettiComponent from "../components/common/ConfettiComponent";

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const totalScore = location.state?.totalScore || 0;
  const totalQuestions = location.state?.totalQuestions || 0;

  //useSaveQuizResult(totalQuestions, totalScore);

  const handleRankButtonClick = () => {
    if (isLoggedIn) {
      navigate("/rank");
    } else {
      window.alert("로그인이 필요한 서비스입니다.");
      navigate("/users/login");
    }
  };

  return (
    <QuizResultStyle>
      <ConfettiComponent />
      <div className="header"> 총 점수는 </div>
      <div className="score">🎉 {totalScore}점 🎉</div>
      <div className="details">
        <div>총 문제 수: {totalQuestions}</div>
        <div>맞춘 문제 수: {totalScore / 10}</div>
      </div>
      <div className="buttons">
        <div className="btn">
          <Link to="/quiz">
            <Button size="long" schema="normal">
              다시하기 🔮
            </Button>
          </Link>
        </div>
        <div className="btn">
          <Link to="/">
            <Button size="long" schema="normal">
              홈 화면으로 이동 🏠
            </Button>
          </Link>
        </div>
        <div className="btn">
          <Button size="long" schema="normal" onClick={handleRankButtonClick}>
            랭킹 확인 - 과연 나의 랭킹은❓
          </Button>
        </div>
      </div>
    </QuizResultStyle>
  );
}

const QuizResultStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px;

  .header {
    margin: 50px;
    font-size: ${({ theme }) => theme.heading.title3};
  }

  .score {
    margin-bottom: 50px;
    font-size: ${({ theme }) => theme.heading.title1};
    font-weight: bold;
  }

  .details {
    margin-bottom: 50px;
    text-align: center;
    font-size: ${({ theme }) => theme.heading.title4};
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn {
      margin: 10px;
    }
    Button {
      width: 300px;
      height: 50px;
    }
  }
`;

export default QuizResult;
