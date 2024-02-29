import { Helmet } from 'react-helmet-async';
// sections
import Campaign from '@/sections/Campaign/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Campaign</title>
      </Helmet>

      <Campaign />
    </>
  );
}
