"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {

  const { data: session } = authClient.useSession();


  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const onSignUp = () => {
    authClient.signUp.email(
      {
        email,
        name,
        password,
      }, {
      onError: () => {
        window.alert("Something went wrong.");
      },
      onSuccess: () => {
        window.alert("Success");
      }
    }
    );
  };

  const onLogin = () => {
    authClient.signIn.email(
      {
        email,
        password,
      }, {
      onError: () => {
        window.alert("Something went wrong.");
      },
      onSuccess: () => {
        window.alert("Success");
      }
    }
    );
  };

  /* UI Part */

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-4 justify-center items-center">
        <h1>Logged in as: {session.user.name}</h1>
        <Button onClick={() => authClient.signOut()}>Logout</Button>
      </div>
    );
  }

  if (isLogin) {
    return (
      <div className="p-4 gap-4 flex flex-col">
        <h1>Login</h1>

        <Input placeholder="email" value={email} onChange={
          (e) => {
            setEmail(e.target.value);
          }
        } />
        <Input placeholder="password" type="password" value={password} onChange={
          (e) => {
            setPassword(e.target.value);
          }
        } />

        <Button onClick={onLogin}>
          Login
        </Button>

        <Button onClick={() => setIsLogin(false)}>Don't have an account!</Button>
      </div>
    );
  }


  return (
    <div className="p-4 gap-4 flex flex-col">
      <h1>Sign Up</h1>
      <Input placeholder="name" value={name} onChange={
        (e) => {
          setName(e.target.value);
        }
      } />
      <Input placeholder="email" value={email} onChange={
        (e) => {
          setEmail(e.target.value);
        }
      } />
      <Input placeholder="password" type="password" value={password} onChange={
        (e) => {
          setPassword(e.target.value);
        }
      } />

      <Button onClick={onSignUp}>
        Create user
      </Button>

      <Button onClick={() => setIsLogin(true)}>Have an account!</Button>
    </div>
  );
}
