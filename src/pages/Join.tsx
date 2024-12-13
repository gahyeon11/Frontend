import styled from 'styled-components';
import Button from '../components/Button';
import { FormWrapper } from '../components/common/FormWrapper';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { FiInfo } from "react-icons/fi";
import { useAuth } from '../hooks/useAuth';

export interface JoinProps {
  id: string;
  password: string;
  passwordConfirm: string;
}

const Join = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<JoinProps>();

  const { userJoin, checkIdDuplication } = useAuth();
  const [isIdChecked, setIsIdChecked] = useState<boolean | null>(null);

  const passwordRef = useRef<string | null>(null);
  passwordRef.current = watch("password");

  const onSubmit = async(data: JoinProps) => {
    if (isIdChecked !== true) {
      window.alert("아이디 중복을 확인해주세요.");
      return;
    }

    try {
      await userJoin(data);
    } catch (err) {
      setIsIdChecked(null);
      throw err;
    }
  };

  const onCheckId = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    
    const id = watch("id");
    if (!id) {
      window.alert("아이디를 입력해주세요.");
      return;
    }

    const isDuplicated = await checkIdDuplication(id);
    // 중복일 경우 true, 중복 아닐 경우 false
    setIsIdChecked(!isDuplicated);
    
    if (isDuplicated) {
      window.alert("이미 사용 중인 아이디입니다.");
    } else {
      window.alert("사용 가능한 아이디입니다.");
    }
  };

  return (
    <FormWrapper>
      <h1>회원가입</h1>
      <JoinForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div className="check-id">
            <input
              type='text'
              placeholder='아이디'
              {...register('id', {
                required: true, 
                minLength: 5, 
                maxLength: 20,
                pattern: /^[a-z0-9]{5,20}$/,
              })}
            />
            <Button
              className='check-id-btn'
              type='button'
              size='short' 
              schema='normal'
              onClick={onCheckId}
            >중복 확인</Button>
          </div>
          <p className={`join-info ${isSubmitted && (errors.id ? 'invalid' : 'valid')}`}>
            <FiInfo className='icon-info' />
            5~20자 영문 소문자, 숫자로 입력해주세요.
          </p>
        </fieldset>
        <fieldset>
          <input
            type='password'
            placeholder='비밀번호'
            {...register('password', {
              required: true, 
              minLength: 8, 
              maxLength: 20,
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%?])[a-zA-Z0-9!@#$%?]{8,20}$/,
            })}
          />
          <p className={`join-info ${isSubmitted && (errors.password ? 'invalid' : 'valid')}`}>
            <FiInfo className='icon-info' />
            8~20자 영문 대/소문자, 숫자, 특수문자(?!@#$%)를 혼합하여 입력해주세요.
          </p>
        </fieldset>
        <fieldset>
          <input
            type='password'
            placeholder='비밀번호 확인'
            {...register('passwordConfirm', {
              required: true,
              minLength: 8, 
              maxLength: 20,
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%?])[a-zA-Z0-9!@#$%?]{8,20}$/,
              validate: (value) => value === watch('password'),
            })}
          />
          <p className={`join-info ${isSubmitted && (errors.passwordConfirm !== errors.password ? 'invalid' : 'valid')}`}>
            <FiInfo className='icon-info' />
            비밀번호 확인
          </p>
        </fieldset>
        <Button
          className='join-btn'
          type='submit'
          size='long'
          schema='primary'>회원가입</Button>
        <div className="go-to-link">
          <span>이미 회원이신가요?</span>
          <Link to='/users/login'>로그인</Link>
        </div>
      </JoinForm>
    </FormWrapper>
  )
};

const JoinForm = styled.form`
  .check-id {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    input {
      flex: 8;
    }

    button {
      flex: 2;
    }
  }

  .join-info {
    margin: 0;
    margin-top: 4px;
    padding-left: 4px;
    color: #333;
    font-size: ${({ theme }) => theme.text.text3};

    .icon-info {
      margin-right: 4px;
    }
  }

  .valid {
    color: green;
  }

  .invalid {
    color: red;
  }

  .error {
    color: red;
    font-size: ${({ theme }) => theme.text.text2};
    margin-bottom: 16px;
  }
`;

export default Join;
