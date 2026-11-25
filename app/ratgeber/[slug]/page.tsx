import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoServicePage from "../../components/SeoServicePage";
import { vehicleAdvice } from "../../lib/vehicleAdvice";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return vehicleAdvice.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const advice = vehicleAdvice.find((entry) => entry.slug === slug);
  if (!advice) notFound();

  const url = `/ratgeber/${slug}`;
  return {
    title: advice.title,
    description: advice.intro,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: advice.title,
      description: advice.intro,
      url,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const advice = vehicleAdvice.find((entry) => entry.slug === slug);
  if (!advice) notFound();

  return <SeoServicePage {...advice} />;
}
