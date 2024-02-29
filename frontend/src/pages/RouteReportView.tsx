import { Helmet } from 'react-helmet-async';
// sections
import ReportView from '@/sections/RouterReportView/view';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title>BÁO CÁO</title>
      </Helmet>
      <ReportView/>
    </>
  );
}
