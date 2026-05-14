import { Helmet } from 'react-helmet-async'

const siteUrl = 'https://www.nikahrapi.online'

export default function InvitationSEO({ nama1, nama2, tanggal, slug, fotoUrl, lokasi }) {
  const title = `Undangan Pernikahan ${nama1 || 'Pengantin'} & ${nama2 || 'Pasangan'}`
  const tanggalStr = tanggal
    ? new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const description = [
    'Dengan penuh kebahagiaan, kami mengundang kehadiran Anda',
    tanggalStr ? `pada ${tanggalStr}` : null,
    lokasi ? `di ${lokasi}` : null,
  ].filter(Boolean).join(' ') + '.'

  const image = fotoUrl || `${siteUrl}/og-invitation-default.jpg`
  const url = slug ? `${siteUrl}/undangan/${slug}` : siteUrl

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph — dipakai WhatsApp, Telegram, Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="NIKAH RAPI" />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Tidak diindex mesin pencari — ini halaman personal */}
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  )
}
