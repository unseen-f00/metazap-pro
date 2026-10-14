import type { Metadata } from 'next';
import TermsOfServicePage from '@/app/terms-of-service/page';

export const metadata: Metadata = {
  title: 'Terms of Service | Usage Guidelines & Legal Terms',
  description:
    'Read our complete Terms of Service. Understand your rights, our zero-upload client-side architecture, intellectual property ownership, and acceptable use guidelines.',
};

export default function TermsPage() {
  return <TermsOfServicePage />;
}
