'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <div className="adm-login">
      <form action={action} className="adm-login__box">
        <div className="brand"><span className="brand__main">NARGIZA</span><span className="brand__sub">ADMIN</span></div>
        <div className="field">
          <label htmlFor="pw">Пароль</label>
          <input id="pw" name="password" type="password" autoFocus autoComplete="current-password" />
        </div>
        {state?.error && <p className="error">{state.error}</p>}
        <button className="btn btn--dark btn--block" disabled={pending}>Войти</button>
      </form>
    </div>
  );
}
