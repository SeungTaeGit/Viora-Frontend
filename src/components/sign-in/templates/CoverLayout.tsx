import { ReactNode } from 'react';
import { Box } from '@mui/material';
import SoftBox from '@/components/atoms/SoftBox';
import SoftTypography from '@/components/atoms/SoftTypography';

interface CoverLayoutProps {
  title: string;
  description: string;
  image: string;
  children: ReactNode;
}

export default function CoverLayout({ title, description, image, children }: CoverLayoutProps) {
  const SoftBoxComponent = SoftBox as React.ComponentType<React.PropsWithChildren<{ 
    mt?: number; 
    pt?: number; 
    px?: number; 
    mb?: number; 
    p?: number; 
    height?: string; 
    position?: string; 
    right?: object; 
    mr?: number; 
    ml?: number; 
    sx?: object 
  }>>;
  const SoftTypographyComponent = SoftTypography as React.ComponentType<React.PropsWithChildren<{ 
    variant?: string; 
    fontWeight?: string; 
    color?: string; 
    textGradient?: boolean 
  }>>;

  return (
    <Box sx={{ minHeight: '100vh', background: 'white', position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '75vh', margin: 0 }}>
        <Box sx={{ width: { xs: '91.67%', sm: '66.67%', md: '41.67%', xl: '25%' } }}>
          <SoftBoxComponent mt={20}>
            <SoftBoxComponent pt={3} px={3}>
              <SoftBoxComponent mb={1}>
                <SoftTypographyComponent variant="h3" fontWeight="bold" color="info" textGradient>
                  {title}
                </SoftTypographyComponent>
              </SoftBoxComponent>
              <SoftTypographyComponent variant="body2" fontWeight="regular" color="text">
                {description}
              </SoftTypographyComponent>
            </SoftBoxComponent>
            <SoftBoxComponent p={3}>{children}</SoftBoxComponent>
          </SoftBoxComponent>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '41.67%' }, display: { xs: 'none', md: 'block' } }}>
          <SoftBoxComponent
            height="100%"
            position="relative"
            right={{ md: '-12rem', xl: '-16rem' }}
            mr={-16}
            sx={{
              transform: 'skewX(-10deg)',
              overflow: 'hidden',
              borderBottomLeftRadius: '1rem',
            }}
          >
            <SoftBoxComponent
              ml={-8}
              height="100%"
              sx={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                transform: 'skewX(10deg)',
              }}
            />
          </SoftBoxComponent>
        </Box>
      </Box>
    </Box>
  );
}