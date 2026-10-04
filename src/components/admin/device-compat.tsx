"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Loader2, Pencil, Plus, Search, Smartphone } from "lucide-react";
import { createDeviceMutation, updateDeviceMutation } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export type DeviceOpt = {
  id: string;
  model: string;
  brand: "APPLE" | "SAMSUNG" | string;
  series?: string;
};

const brandLabel: Record<string, string> = {
  APPLE: "Apple",
  SAMSUNG: "Samsung",
};

function seriesGuess(model: string, brand: string) {
  if (brand === "APPLE") {
    const m = model.match(/^(iPhone\s+\d+)/i);
    return m?.[1] ?? "iPhone";
  }
  if (/Z\s*Fold/i.test(model)) return "Galaxy Z Fold";
  if (/Z\s*Flip/i.test(model)) return "Galaxy Z Flip";
  const m = model.match(/^(Galaxy\s+S\d+)/i);
  return m?.[1] ?? "Galaxy";
}

export function DeviceCompatField({
  devices: initialDevices,
  selectedIds: initialSelected,
}: {
  devices: DeviceOpt[];
  selectedIds: string[];
}) {
  const [devices, setDevices] = useState(initialDevices);
  const [selected, setSelected] = useState(() => new Set(initialSelected));
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<"ALL" | "APPLE" | "SAMSUNG">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ brand: "APPLE" as "APPLE" | "SAMSUNG", series: "", model: "" });
  const [add, setAdd] = useState({ brand: "APPLE" as "APPLE" | "SAMSUNG", series: "", model: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devices.filter((d) => {
      if (brandFilter !== "ALL" && d.brand !== brandFilter) return false;
      if (!q) return true;
      return (
        d.model.toLowerCase().includes(q) ||
        (d.series ?? "").toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q)
      );
    });
  }, [devices, query, brandFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, DeviceOpt[]>();
    for (const d of filtered) {
      const key = `${d.brand}::${d.series || seriesGuess(d.model, d.brand)}`;
      const list = map.get(key) ?? [];
      list.push(d);
      map.set(key, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startEdit(d: DeviceOpt) {
    setEditingId(d.id);
    setDraft({
      brand: d.brand === "SAMSUNG" ? "SAMSUNG" : "APPLE",
      series: d.series || seriesGuess(d.model, d.brand),
      model: d.model,
    });
    setMessage(null);
  }

  function saveEdit() {
    if (!editingId) return;
    const fd = new FormData();
    fd.set("id", editingId);
    fd.set("brand", draft.brand);
    fd.set("series", draft.series);
    fd.set("model", draft.model);
    startTransition(async () => {
      const result = await updateDeviceMutation(fd);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setDevices((list) =>
        list.map((d) => (d.id === result.device.id ? { ...d, ...result.device } : d)),
      );
      setEditingId(null);
      setMessage("Device updated.");
    });
  }

  function saveAdd() {
    const fd = new FormData();
    fd.set("brand", add.brand);
    fd.set("series", add.series);
    fd.set("model", add.model);
    startTransition(async () => {
      const result = await createDeviceMutation(fd);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setDevices((list) => [...list, result.device]);
      setSelected((prev) => new Set(prev).add(result.device.id));
      setAdd({ brand: add.brand, series: add.series, model: "" });
      setMessage(`Added ${result.device.model} and selected it.`);
    });
  }

  return (
    <div className="space-y-3">
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="deviceIds" value={id} />
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones…"
            className="h-10 border-white/[0.08] bg-black/30 pl-9 text-sm"
          />
        </div>
        <div className="flex rounded-full border border-line bg-surface-2 p-0.5">
          {(["ALL", "APPLE", "SAMSUNG"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrandFilter(b)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                brandFilter === b ? "bg-fg text-black" : "text-muted hover:text-fg",
              )}
            >
              {b === "ALL" ? "All" : brandLabel[b]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-subtle">
        <span className="font-mono tabular-nums text-fg">{selected.size}</span> selected
        <span className="mx-1.5 text-zinc-600">·</span>
        <span className="font-mono tabular-nums">{filtered.length}</span> shown
        <span className="mx-1.5 text-zinc-600">·</span>
        scroll down to <span className="text-muted">Add phone</span>
      </p>

      <div className="max-h-[28rem] space-y-4 overflow-y-auto rounded-xl border border-line bg-surface-2/30 p-3 sm:p-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Smartphone size={22} className="text-zinc-600" />
            <p className="text-sm text-muted">No phones match</p>
            <p className="text-xs text-subtle">Try another search or add a new model.</p>
          </div>
        ) : (
          groups.map(([key, rows]) => {
            const [brand, series] = key.split("::");
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="rounded-md bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    {brandLabel[brand] ?? brand}
                  </span>
                  <span className="text-xs font-medium text-zinc-300">{series}</span>
                  <span className="font-mono text-[10px] text-zinc-600">{rows.length}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {rows.map((d) => {
                    const on = selected.has(d.id);
                    const editing = editingId === d.id;
                    return (
                      <div
                        key={d.id}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 transition",
                          on
                            ? "border-accent/40 bg-accent/[0.1] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)]"
                            : "border-white/[0.06] bg-black/20 hover:border-white/[0.12]",
                        )}
                      >
                        {editing ? (
                          <div className="space-y-2">
                            <Select
                              value={draft.brand}
                              onChange={(e) => setDraft((x) => ({ ...x, brand: e.target.value as "APPLE" | "SAMSUNG" }))}
                              className="h-9 border-white/[0.08] bg-black/40 text-xs"
                            >
                              <option value="APPLE">Apple</option>
                              <option value="SAMSUNG">Samsung</option>
                            </Select>
                            <Input
                              value={draft.series}
                              onChange={(e) => setDraft((x) => ({ ...x, series: e.target.value }))}
                              className="h-9 border-white/[0.08] bg-black/40 text-xs"
                              placeholder="Series"
                            />
                            <Input
                              value={draft.model}
                              onChange={(e) => setDraft((x) => ({ ...x, model: e.target.value }))}
                              className="h-9 border-white/[0.08] bg-black/40 text-xs"
                              placeholder="Model"
                            />
                            <div className="flex gap-1.5">
                              <Button type="button" size="sm" className="h-8 flex-1" disabled={pending} onClick={saveEdit}>
                                {pending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                Save
                              </Button>
                              <Button type="button" size="sm" variant="ghost" className="h-8" onClick={() => setEditingId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <button
                              type="button"
                              onClick={() => toggle(d.id)}
                              className="mt-0.5 flex min-w-0 flex-1 items-start gap-2.5 text-left"
                            >
                              <span
                                className={cn(
                                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded border transition",
                                  on ? "border-accent bg-accent text-black" : "border-zinc-600 bg-transparent",
                                )}
                              >
                                {on ? <Check size={10} strokeWidth={3} /> : null}
                              </span>
                              <span className="min-w-0">
                                <span className={cn("block text-sm leading-snug", on ? "text-fg" : "text-muted")}>
                                  {d.model}
                                </span>
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(d)}
                              className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-fg"
                              aria-label={`Edit ${d.model}`}
                            >
                              <Pencil size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Always-visible add row — bottom of the device list */}
      <div className="rounded-xl border border-dashed border-accent/40 bg-accent/[0.07] p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-accent/20 text-blue-100">
            <Plus size={16} />
          </span>
          <div>
            <p className="text-sm font-medium text-fg">Add phone</p>
            <p className="text-xs text-subtle">New model goes into the list and stays selected for this product.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:items-end">
          <label className="min-w-0">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Brand</span>
            <Select
              value={add.brand}
              onChange={(e) => setAdd((a) => ({ ...a, brand: e.target.value as "APPLE" | "SAMSUNG" }))}
              className="h-11 border-white/[0.1] bg-black/35 text-sm"
            >
              <option value="APPLE">Apple</option>
              <option value="SAMSUNG">Samsung</option>
            </Select>
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Series</span>
            <Input
              value={add.series}
              onChange={(e) => setAdd((a) => ({ ...a, series: e.target.value }))}
              placeholder="iPhone 17"
              className="h-11 border-white/[0.1] bg-black/35 text-sm"
            />
          </label>
          <label className="min-w-0">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Model name</span>
            <Input
              value={add.model}
              onChange={(e) => setAdd((a) => ({ ...a, model: e.target.value }))}
              placeholder="iPhone 17 Pro Max"
              className="h-11 border-white/[0.1] bg-black/35 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (add.series && add.model && !pending) saveAdd();
                }
              }}
            />
          </label>
          <Button
            type="button"
            size="md"
            className="h-11 w-full sm:w-auto"
            disabled={pending || add.series.trim().length < 2 || add.model.trim().length < 2}
            onClick={saveAdd}
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add
          </Button>
        </div>
        {message ? <p className="mt-3 text-xs text-muted">{message}</p> : null}
      </div>
    </div>
  );
}
