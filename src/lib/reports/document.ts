import "server-only";
import { companyInfo, siteConfig } from "@/config/site";
import { escapeHtml, formatReportDateTime } from "./format";

export function reportDocument({
  title,
  subtitle,
  meta,
  body,
  footerNote,
}: {
  title: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  body: string;
  footerNote?: string;
}) {
  const metaHtml = (meta ?? [])
    .map(
      (m) => `
      <div class="meta-item">
        <span class="meta-label">${escapeHtml(m.label)}</span>
        <span class="meta-value">${escapeHtml(m.value)}</span>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · ${escapeHtml(siteConfig.name)}</title>
  <style>
    :root {
      --ink: #0f1117;
      --muted: #5c6478;
      --line: #d8dde8;
      --soft: #f4f6fb;
      --accent: #1e40af;
      --accent-soft: #e8eefc;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: #eef1f7;
      font: 13px/1.45 "Segoe UI", system-ui, -apple-system, sans-serif;
    }
    .sheet {
      width: min(980px, 100%);
      margin: 24px auto;
      background: #fff;
      border: 1px solid var(--line);
      box-shadow: 0 18px 50px -30px rgba(15, 17, 23, 0.45);
    }
    .toolbar {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 12px 20px;
      border-bottom: 1px solid var(--line);
      background: var(--soft);
    }
    .toolbar button, .toolbar a {
      appearance: none;
      border: 1px solid var(--line);
      background: #fff;
      color: var(--ink);
      border-radius: 999px;
      padding: 8px 14px;
      font: inherit;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }
    .toolbar .primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .pad { padding: 28px 32px 36px; }
    .brand {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--ink);
    }
    .brand-mark {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--accent);
    }
    .brand-sub { margin-top: 4px; color: var(--muted); font-size: 12px; }
    .company {
      text-align: right;
      color: var(--muted);
      font-size: 11.5px;
      max-width: 280px;
    }
    .company strong { display: block; color: var(--ink); font-size: 13px; margin-bottom: 4px; }
    .doc-title {
      margin: 22px 0 6px;
      font-size: 22px;
      font-weight: 750;
      letter-spacing: -0.02em;
    }
    .doc-sub { color: var(--muted); margin: 0 0 18px; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 10px;
      margin: 0 0 22px;
      padding: 14px;
      background: var(--soft);
      border: 1px solid var(--line);
    }
    .meta-label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--muted);
      margin-bottom: 3px;
    }
    .meta-value { font-weight: 650; }
    table.data {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    table.data th {
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--muted);
      background: var(--soft);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 10px 10px;
      white-space: nowrap;
    }
    table.data td {
      padding: 10px;
      border-bottom: 1px solid #eceff5;
      vertical-align: top;
    }
    table.data tr:nth-child(even) td { background: #fafbfe; }
    table.data .num, table.data th.num { text-align: right; font-variant-numeric: tabular-nums; }
    table.data .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
    .totals {
      width: min(320px, 100%);
      margin-left: auto;
      margin-top: 18px;
      border: 1px solid var(--line);
    }
    .totals .row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--line);
    }
    .totals .row:last-child { border-bottom: 0; background: var(--accent-soft); font-weight: 750; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .site-foot {
      margin-top: 22px;
      padding: 16px 18px;
      border-radius: 14px;
      background: #0c1222;
      color: #d5dbe8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .site-mark {
      width: 64px;
      height: 64px;
      object-fit: contain;
      background: #0c1222;
      border-radius: 14px;
      flex: 0 0 auto;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .site-foot .label {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #8b9bb8;
    }
    .site-foot a {
      display: inline-block;
      margin-top: 4px;
      color: #e7c56a;
      font-size: 14px;
      font-weight: 750;
      text-decoration: none;
    }
    .sign {
      margin-top: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .sign .line {
      border-top: 1px solid var(--ink);
      padding-top: 8px;
      color: var(--muted);
      font-size: 11px;
    }
    @media print {
      body { background: #fff; }
      .sheet { margin: 0; width: 100%; border: 0; box-shadow: none; }
      .toolbar { display: none !important; }
      .pad { padding: 0; }
      a { color: inherit; text-decoration: none; }
      .site-foot, .site-mark {
        background: #0c1222;
        color: #d5dbe8;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .site-foot a { color: #e7c56a; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="toolbar">
      <a href="javascript:window.print()" class="primary">Print / Save PDF</a>
      <a href="javascript:window.close()">Close</a>
    </div>
    <div class="pad">
      <header class="brand">
        <div style="display:flex;align-items:center;gap:14px">
          <img src="/products/Hydra_Mark.png" alt="${escapeHtml(siteConfig.name)}" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:contain;background:#0c1222;border-radius:14px" />
          <div>
            <div class="brand-sub" style="font-size:15px;font-weight:750;color:var(--ink);letter-spacing:0.04em">${escapeHtml(siteConfig.legalName)}</div>
            <div class="brand-sub">${escapeHtml(siteConfig.tagline)}</div>
          </div>
        </div>
        <div class="company">
          <strong>${escapeHtml(siteConfig.legalName)}</strong>
          ${escapeHtml(companyInfo.registeredOffice)}<br/>
          ${escapeHtml(siteConfig.email)} · ${escapeHtml(siteConfig.phone)}
        </div>
      </header>

      <h1 class="doc-title">${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="doc-sub">${escapeHtml(subtitle)}</p>` : ""}
      ${metaHtml ? `<div class="meta-grid">${metaHtml}</div>` : ""}

      ${body}

      <div class="sign">
        <div class="line">Prepared by · HYDRA Admin</div>
        <div class="line">Authorized signature</div>
      </div>

      <div class="site-foot">
        <img class="site-mark" src="/products/Hydra_Mark.png" alt="${escapeHtml(siteConfig.name)}" width="64" height="64" />
        <div style="flex:1;min-width:220px">
          <div class="label">Website</div>
          <a href="${escapeHtml(siteConfig.website)}/">${escapeHtml(siteConfig.website)}/</a>
        </div>
        <div>${escapeHtml(siteConfig.legalName)}</div>
      </div>

      <footer class="footer">
        <span>${escapeHtml(footerNote ?? "Computer-generated statement. Valid without signature when printed from HYDRA Admin.")}</span>
        <span>Generated ${escapeHtml(formatReportDateTime())} (UTC)</span>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

export function htmlResponse(html: string, filename: string) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
