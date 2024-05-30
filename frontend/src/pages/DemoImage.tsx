import { Helmet } from 'react-helmet-async';
// sections
import DemoImage from '@/sections/DemoImage/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> DemoImage</title>
      </Helmet>

      <DemoImage />
    </>
  );
}
