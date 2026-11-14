"use client";

export function SortSelect({ value }: { value: string }) {
  return (
    <label className="text-sm text-stone-deep">
      <span className="sr-only">Sort</span>
      <select
        name="sort"
        form="catalog-filters"
        defaultValue={value}
        className="min-h-11 border border-sand bg-bone px-3"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="newest">Newest</option>
        <option value="bestselling">Bestselling</option>
        <option value="price-asc">Price, low to high</option>
        <option value="price-desc">Price, high to low</option>
      </select>
    </label>
  );
}
