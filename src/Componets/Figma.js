import React from 'react';
import styled from 'styled-components';

const Login = () => {
  return (
    <LoginContainer>
      <img className="img-1" src="" alt="" />
      <img className="img-2" src="" alt="" />
      <LoginForm>
        <div className="frame-1-6-1-9-0-5">
          <div className="frame-1-5">
            <img className="img-3" src="" alt="" />
            <p className="text-4">Saksham</p>
          </div>
          <div className="frame-1-6-1-9-0-4">
            <div className="frame-1-6-1-9-0-0">
              <p className="text-5">Secure Access Required</p>
              <p className="text-6">For enhanced security and privacy, accessing User X's confidential report necessitates a One-Time Password (OTP) verification. Please enter the OTP sent to your registered email or mobile number in the field below to proceed.</p>
            </div>
            <div className="frame-1-6-1-9-0-2">
              <div className="frame-1-6-1-8-9-9">
                <div className="rectangle-3-4-6-7-6-9-6" />
                <div className="rectangle-4" />
                <div className="rectangle-4" />
                <div className="rectangle-4" />
                <div className="rectangle-3-4-6-7-6-9-7" />
                <div className="rectangle-3-4-6-7-6-9-8" />
              </div>
              <div className="group-1-6-0-8-7-3">
                <div className="rectangle-3" />
                <div className="rectangle-2" />
                <p className="text-7">Submit</p>
                <p className="text-8">Resend OTP</p>
              </div>
            </div>
          </div>
        </div>
      </LoginForm>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 960px;
  width: 1600px;
  background-color: #0075f3;
`;

const LoginForm = styled.div`
  border-radius: 30px;
  height: 509px;
  width: 720px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;

  .frame-1-5 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 17.99238395690918px;
  }

  .img-3 {
    height: 74px;
    width: 73px;
  }

  .text-4 {
    text-align: center;
    vertical-align: top;
    font-size: 50.97842025756836px;
    font-family: Helvetica;
    line-height: auto;
    color: #0075f3;
  }

  .frame-1-6-1-9-0-4 {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
  }

  .frame-1-6-1-9-0-0 {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
  }

  .text-5 {
    text-align: center;
    vertical-align: top;
    font-size: 30px;
    font-family: Roboto;
    line-height: 40%;
    color: #000000;
  }

  .text-6 {
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
    font-family: Inter;
    line-height: 24%;
    color: #667085;
  }

  .frame-1-6-1-9-0-2 {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
  }

  .frame-1-6-1-8-9-9 {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
  }

  .rectangle-3-4-6-7-6-9-6,
  .rectangle-4,
  .rectangle-3-4-6-7-6-9-7,
  .rectangle-3-4-6-7-6-9-8 {
    border-radius: 8px;
    height: 50px;
    width: 74px;
    background-color: #ffffff;
    border: 1px solid #c9c9c9;
  }

  .group-1-6-0-8-7-3 {
    height: 78px;
    width: 328px;
  }

  .rectangle-3,
  .rectangle-2 {
    border-radius: 8px;
    height: 46px;
    width: 328px;
    background-color: #0075f3;
  }

  .text-7,
  .text-8 {
    text-align: left;
    vertical-align: top;
    font-size: 18px;
    font-family: Roboto;
    line-height: auto;
  }

  .text-7 {
    color: #ffffff;
  }

  .text-8 {
    color: #0075f3;
  }
`;

export default Login;
