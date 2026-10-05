import { permanentRedirect } from "next/navigation";

export const dynamicParams = false;

/** Legacy brand-split URLs — install is one shared guide now. */
export function generateStaticParams() {
  return [{ brand: "iphone" }, { brand: "samsung" }];
}

export default async function InstallationBrandRedirect({
  params,
}: PageProps<"/installation/[brand]">) {
  await params;
  permanentRedirect("/installation");
}
