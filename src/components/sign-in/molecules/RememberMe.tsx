import { Switch } from '@mui/material';
import SoftBox from '@/components/atoms/SoftBox';
import SoftTypography from '@/components/atoms/SoftTypography';

interface RememberMeProps {
  checked: boolean;
  onChange: () => void;
}

export default function RememberMe({ checked, onChange }: RememberMeProps) {
  const SoftBoxComponent = SoftBox as React.ComponentType<React.PropsWithChildren<{ display?: string; alignItems?: string }>>;
  const SoftTypographyComponent = SoftTypography as React.ComponentType<React.PropsWithChildren<{ variant?: string; fontWeight?: string; onClick?: () => void; sx?: object }>>;
  
  return (
    <SoftBoxComponent display="flex" alignItems="center">
      <Switch checked={checked} onChange={onChange} />
      <SoftTypographyComponent
        variant="button"
        fontWeight="regular"
        onClick={onChange}
        sx={{ cursor: 'pointer', userSelect: 'none' }}
      >
        &nbsp;&nbsp;Remember me
      </SoftTypographyComponent>
    </SoftBoxComponent>
  );
}