import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { useAuthStore, getToken, removeToken } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isLoggedIn, storeLogin, storeLogout } = useAuthStore();
  const { userLogout } = useAuth();

  useEffect(() => {
    const token = getToken(); // 쿠키에서 토큰 가져오기
    if (token) {
      storeLogin(token); // 토큰이 있으면 로그인 상태로 전환
    } else {
      storeLogout(); // 토큰이 없으면 로그아웃 상태로 전환
    }

    const handleBeforeUnload = () => {
      removeToken(); // 창을 닫거나 새로고침할 때 토큰 삭제
    };

    window.addEventListener("beforeunload", handleBeforeUnload); // beforeunload 이벤트 추가

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, [storeLogin, storeLogout]);

  return (
    <HeaderWrapper>
      <Content>
        <div className='logo'>
          <Link to='/'>
            <h1>Quiz</h1>
          </Link>
        </div>
        <div className="auth">
          {isLoggedIn ? (
            <>
              <Link to='/mypage'>
                <Button size='short' schema='normal'>MY PAGE</Button>
              </Link>
              <Button size='short' schema='normal' onClick={userLogout}>LOGOUT</Button>
            </>
          ) : (
            <>
              <Link to='/users/join'>
                <Button size='short' schema='normal'>JOIN</Button>
              </Link>
              <Link to='/users/login'>
                <Button size='short' schema='normal'>LOGIN</Button>
              </Link>
            </>
          )}
        </div>
      </Content>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: ${({ theme }) => theme.color.primary};
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 1200px;
  height: 100%;

  .logo {
    h1 {
      margin: 0;
      padding: 0;
      color: white;
      font-size: ${({ theme }) => theme.heading.title3};
      font-weight: 400;
    }
  }

  .auth {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
`;

export default Header;
