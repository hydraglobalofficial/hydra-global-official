import { getNavigationData } from "@/server/queries/catalog";
import { HeaderClient } from "./header-client";

export async function SiteHeader() {
  const nav = await getNavigationData();
  return <HeaderClient nav={nav} />;
}
