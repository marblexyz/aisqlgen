import Head from "next/head";
import { FC } from "react";
import { SEO_INFO } from "./globalSEO";
export type SEOHeadProps = {
  description?: string;
  title: string;
  image?: string;
  slug?: string;
  article?: boolean;
};
export const SEOHead: FC<SEOHeadProps> = ({
  description,
  title,
  image,
  slug,
  article = false,
}) => {
  const {
    originalTitle,
    originalDescription,
    siteName,
    currentURL,
    originalImage,
  } = SEO_INFO;
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>{`${title} | ${originalTitle}`}</title>
      <meta
        name="description"
        content={`${
          description !== undefined ? description : originalDescription
        }`}
      />
      <meta
        name="image"
        content={`${image !== undefined ? image : originalImage}`}
        key="ogtitle"
      />
      {article ? (
        <meta property="og:type" content="article" key="ogtype" />
      ) : (
        <meta property="og:type" content="website" key="ogtype" />
      )}
      <meta
        property="og:title"
        content={`${title ? title : originalTitle}`}
        key="ogtitle"
      />
      <meta
        property="og:description"
        content={`${
          description !== undefined ? description : originalDescription
        }`}
        key="ogdesc"
      />
      <meta
        property="twitter:card"
        content="summary_large_image"
        key="twcard"
      />
      {/* <meta name="twitter:creator" content={twitter} key="twhandle" /> */}
      <meta
        name="twitter:title"
        content={`${title ? title : originalTitle}`}
        key="twtitle"
      />
      <meta
        name="twitter:description"
        content={`${
          description !== undefined ? description : originalDescription
        }`}
        key="twdescription"
      />
      <meta
        name="twitter:image"
        content={`${image !== undefined ? image : originalImage}`}
        key="twimage"
      />
      {slug !== undefined && (
        <meta property="og:url" content={`${currentURL}/${slug}`} key="ogurl" />
      )}
      <meta
        property="og:image"
        content={`${image !== undefined ? image : originalImage}`}
        key="ogimage"
      />
      <meta property="og:site_name" content={siteName} key="ogsitename" />
    </Head>
  );
};
