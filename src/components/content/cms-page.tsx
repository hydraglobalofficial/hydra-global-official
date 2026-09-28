import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { getPage } from "@/server/queries/content";
import { RichText } from "./rich-text";

export async function CmsPage({ slug, eyebrow, aside }: { slug: string; eyebrow: string; aside?: React.ReactNode }) {
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={page.title} description={page.summary}>
        <p className="font-mono text-xs text-subtle">Last updated {formatDate(page.updatedAt)}</p>
      </PageHeader>
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_18rem]">
        <article className="max-w-3xl">
          <RichText source={page.body} />
        </article>
        {aside && <aside className="lg:sticky lg:top-28 lg:self-start">{aside}</aside>}
      </div>
    </>
  );
}
