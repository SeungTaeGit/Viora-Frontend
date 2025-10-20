import CoverLayout from '@/components/sign-in/templates/CoverLayout';
import SignInForm from '@/components/sign-in/organisms/SignInForm';
import { useAuth } from '@/hooks/useAuth';

export default function SignIn() {
  const { email, setEmail, password, setPassword, rememberMe, setRememberMe, error, handleSubmit } = useAuth();

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image="/images/curved9.jpg"
    >
      <SignInForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        error={error}
        handleSubmit={handleSubmit}
      />
    </CoverLayout>
  );
}