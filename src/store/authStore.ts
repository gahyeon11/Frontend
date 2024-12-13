import { create } from "zustand";
import { persist } from "zustand/middleware";

// 쿠키에서 토큰을 가져오는 함수 (기존 코드 활용)
export const getToken = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  return token || null; // 토큰이 없으면 null 반환
};

const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/`; // 쿠키에 토큰 저장
};

export const removeToken = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // 토큰 삭제
};

interface StoreState {
  isLoggedIn: boolean;
  isDuplicate: boolean;
  storeLogin: (token: string) => void;
  storeLogout: () => void;
  checkLoginStatus: () => void; // 로그인 상태 확인 함수 추가
}

export const useAuthStore = create<StoreState>()(
  persist(
    (set) => ({
      isDuplicate: false,
      isLoggedIn: false, // 초기 상태를 false로 설정
      storeLogin: (token) => {
        setToken(token);
        set({ isLoggedIn: true });
      },
      storeLogout: () => {
        removeToken();
        set({ isLoggedIn: false });
      },
      checkLoginStatus: () => {
        const token = getToken();
        set({ isLoggedIn: !!token }); // 토큰이 있으면 isLoggedIn true로 설정
      },
    }),
    {
      name: "auth", // localStorage 키
    }
  )
);
