import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useUser } from '../_layout';
import addUser from '@/components/addUser';
export default function LogInPage() {
  const { setUserAcc } = useUser();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const fillRef = useRef(null);

  const handleClick = () => {
    if (isAnimating) return; // prevent re-click

    setIsAnimating(true);
    fillRef.current.style.transition = 'width 0.8s linear';
    fillRef.current.style.width = '100%';

    // Optional: do something after animation
    setTimeout(() => {
      // e.g., navigate or show success
      console.log('Login animation complete');
      setIsAnimating(false);
      fillRef.current.style.transition = 'none';
      fillRef.current.style.width = '0%';
    }, 3000);
    handleLogin();
  };
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User Info:", user);
      addUser(user.uid, user.displayName ?? 'no-name',user.email??'none','dog1',setUserAcc)
      /*setUserAcc({
        uuid: user.uid,
        username: user.displayName ?? 'no-name',
        email: user.email ?? 'no-email',
      })*/
      // After login success, navigate to (tabs)
      router.replace("/(tabs)"); // (optional) force redirect to tabs
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
        background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: '#60a5fa',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.4,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          right: '-120px',
          width: '500px',
          height: '500px',
          background: '#93c5fd',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Welcome text */}
      <h1
        style={{
          fontSize: '32px',
          marginBottom: '40px',
          color: '#1e3a8a',
          zIndex: 2,
        }}
      >
        Welcome to CoWish
      </h1>

      {/* Login button */}
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '200px',
          height: '60px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 12px 24px rgba(26, 21, 88, 3.99)',
          cursor: isAnimating ? 'not-allowed' : 'pointer',
          backgroundColor: '#fff',
          border: '2px solid #3b82f6',
          zIndex: 2,
        }}
      >
        <div
          ref={fillRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '0%',
            backgroundColor: '#3b82f6',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        ></div>
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: isAnimating ? 'white' : '#3b82f6',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'color 0.3s ease',
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
}
