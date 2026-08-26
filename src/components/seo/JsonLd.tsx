import React from 'react';

export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blackora.com';

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Blackora',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/favicon.svg`,
          caption: 'Blackora Haute Horlogerie Logo',
        },
        sameAs: [
          'https://www.instagram.com/blackora',
          'https://www.facebook.com/blackora',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@blackora.com',
          availableLanguage: ['English', 'Urdu'],
          areaServed: 'PK',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Blackora | Haute Horlogerie & Luxury Watches',
        description:
          'Pakistan’s premier luxury watch brand offering automatic skeleton, chronographs, and diamond timepieces with Cash on Delivery & EasyPaisa.',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/collections?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-PK',
      },
      {
        '@type': 'Store',
        '@id': `${siteUrl}/#store`,
        name: 'Blackora Luxury Watches',
        image: `${siteUrl}/favicon.svg`,
        url: siteUrl,
        priceRange: '$$$$',
        currenciesAccepted: 'PKR',
        paymentAccepted: 'Cash on Delivery, EasyPaisa, JazzCash',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'PK',
          addressRegion: 'Sindh & Punjab',
          addressLocality: 'Karachi & Lahore',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
