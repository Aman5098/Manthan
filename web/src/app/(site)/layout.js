import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getActiveTheme } from '@/lib/api';

export default async function SiteLayout({ children }) {
  const theme = await getActiveTheme();

  return (
    <>
      <SiteHeader theme={theme} />
      {children}
      <SiteFooter theme={theme} />
    </>
  );
}
