import SoftBox from '@/components/atoms/SoftBox';
import SoftTypography from '@/components/atoms/SoftTypography';
import SoftButton from '@/components/atoms/SoftButton';
import FormField from '../atoms/FormField';
import RememberMe from '../molecules/RememberMe';

interface SignInFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  error: string;
  handleSubmit: (event: React.FormEvent) => void;
}

export default function SignInForm({ email, setEmail, password, setPassword, rememberMe, setRememberMe, error, handleSubmit }: SignInFormProps) {
  const SoftBoxComponent = SoftBox as React.ComponentType<React.PropsWithChildren<any>>;
  const SoftTypographyComponent = SoftTypography as React.ComponentType<React.PropsWithChildren<any>>;
  const SoftButtonComponent = SoftButton as React.ComponentType<React.PropsWithChildren<any>>;

  return (
    <SoftBoxComponent component="form" role="form" onSubmit={handleSubmit}>
      <FormField 
        label="Email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField 
        label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <RememberMe 
        checked={rememberMe} 
        onChange={() => setRememberMe(!rememberMe)} 
      />
      {error && (
        <SoftBoxComponent mt={2}>
          <SoftTypographyComponent variant="caption" color="error">
            {error}
          </SoftTypographyComponent>
        </SoftBoxComponent>
      )}
      <SoftBoxComponent mt={4} mb={1}>
        <SoftButtonComponent variant="gradient" color="info" fullWidth type="submit">
          sign in
        </SoftButtonComponent>
      </SoftBoxComponent>
    </SoftBoxComponent>
  );
}