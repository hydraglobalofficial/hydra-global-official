"use client";

import Form from "next/form";
import { useState } from "react";
import { Search } from "lucide-react";
import { useTypingPlaceholder } from "@/components/search/typing-placeholder";
import { buttonStyles } from "@/components/ui/button";

export function SearchForm({ defaultQuery = "" }: { defaultQuery?: string }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultQuery);
  const typing = useTypingPlaceholder(undefined, !focused && !value);

  return (
    <Form action="/search" className="border-gradient mx-auto flex max-w-3xl items-center gap-3 rounded-full p-2 pl-6">
      <Search size={20} className="shrink-0 text-accent" />
      <input
        name="q"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        minLength={1}
        placeholder={typing}
        aria-label="Search"
        className="h-12 min-w-0 flex-1 bg-transparent text-lg placeholder:text-subtle focus:outline-none"
      />
      <button type="submit" className={buttonStyles({ size: "md", className: "shrink-0" })}>
        Search
      </button>
    </Form>
  );
}
