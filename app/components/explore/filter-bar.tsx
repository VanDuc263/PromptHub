import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { SelectField } from "@/components/prompt-editor/field";
import { Button } from "@/components/ui/button";
import {
  exploreCategories,
  defaultExploreFilters,
  modelFilters,
  sortOptions,
  timeFilters,
} from "@/data/explore-data";

export interface ExploreFilters {
  category: string;
  model: string;
  sort: string;
  time: string;
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: ExploreFilters;
  onChange: (filters: ExploreFilters) => void;
}) {
  const changed = JSON.stringify(filters) !== JSON.stringify(defaultExploreFilters);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-white/[.07] bg-[#161b22] p-3 lg:flex-row lg:items-center">
      <span className="inline-flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-600">
        <SlidersHorizontal className="size-3.5" /> Filters
      </span>
      <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
        <FilterSelect label="Category" value={filters.category} options={exploreCategories} onChange={(category) => onChange({ ...filters, category })} />
        <FilterSelect label="Model" value={filters.model} options={modelFilters} onChange={(model) => onChange({ ...filters, model })} />
        <FilterSelect label="Sort" value={filters.sort} options={sortOptions} onChange={(sort) => onChange({ ...filters, sort })} />
        <FilterSelect label="Time" value={filters.time} options={timeFilters} onChange={(time) => onChange({ ...filters, time })} />
      </div>
      {changed && (
        <Button variant="ghost" size="sm" onClick={() => onChange(defaultExploreFilters)}>
          <RotateCcw className="size-3.5" /> Reset
        </Button>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block px-1 text-[9px] text-slate-700">{label}</label>
      <SelectField value={value} onChange={(event) => onChange(event.target.value)} className="h-9">
        {options.map((option) => <option key={option}>{option}</option>)}
      </SelectField>
    </div>
  );
}
