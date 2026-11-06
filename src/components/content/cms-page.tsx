import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/primitives";
import { getPolicy } from "@/content/policies";
import { formatDate } from "@/lib/utils";
import { getPage } from "@/server/queries/content";
import { RichText } from "./rich-text";

export async function CmsPage({ slug, eyebrow, aside }: { slug: string; eyebrow: string; aside?: React.ReactNode }) {
  const policy = getPolicy(slug);
  const page = policy ? null : await getPage(slug);
  if (!policy && !page) notFound();

  const title = policy?.title ?? page!.title;
  const summary = policy?.summary ?? page?.summary;
  const body = policy?.body ?? page!.body;
  const updated = policy?.updated ?? formatDate(page!.updatedAt);

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={summary}>
        <p className="font-mono text-xs text-subtle">Last updated {updated}</p>
      </PageHeader>
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_16rem]">
        <article className="max-w-3xl">
          <RichText source={body} />
        </article>
        {aside && <aside className="lg:sticky lg:top-28 lg:self-start">{aside}</aside>}
      </div>
    </>
  );
}
