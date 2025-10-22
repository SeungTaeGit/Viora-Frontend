import SoftBox from '@/components/atoms/SoftBox';
import SoftTypography from '@/components/atoms/SoftTypography';
import SoftInput from '@/components/atoms/SoftInput';

interface FormFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormField({ label, type, placeholder, value, onChange }: FormFieldProps) {
  const SoftBoxComponent = SoftBox as React.ComponentType<React.PropsWithChildren<any>>;
  const SoftTypographyComponent = SoftTypography as React.ComponentType<React.PropsWithChildren<any>>;
  const SoftInputComponent = SoftInput as React.ComponentType<any>;

  return (
    <SoftBoxComponent mb={2} lineHeight={1.25}>
      <SoftBoxComponent mb={1} ml={0.5}>
        <SoftTypographyComponent component="label" variant="caption" fontWeight="bold">
          {label}
        </SoftTypographyComponent>
      </SoftBoxComponent>
      <SoftInputComponent 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </SoftBoxComponent>
  );
}