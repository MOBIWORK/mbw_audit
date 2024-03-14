import { Helmet } from 'react-helmet-async';
// sections
import Dashboard from '@/sections/Dashboard/view';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Dashboard />
    </>
  );
}
