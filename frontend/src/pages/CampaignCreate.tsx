import { Helmet } from 'react-helmet-async';
// sections
import CampaignCreate from '@/sections/CampaignCreate/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Campaign Create</title>
      </Helmet>

      <CampaignCreate />
    </>
  );
}
