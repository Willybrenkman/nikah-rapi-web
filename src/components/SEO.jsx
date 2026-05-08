import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '/', keywords = '' }) {
  const siteUrl = 'https://www.nikahrapi.online';
  const fullUrl = `${siteUrl}${path}`;
  const siteName = 'NIKAH RAPI';
  const ogImage = `${siteUrl}/landing-assets/dashboard.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="NIKAH RAPI" />
    </Helmet>
  );
}
