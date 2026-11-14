import Link from "next/link";
import { audiences, categories, facetOptions, type CatalogQuery } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./product-card";
import { SortSelect } from "./sort-select";
import { btn, field, labelCls } from "./styles";

function selected(value: string | string[] | undefined, option: string): boolean {
  if (!value) return false;
  return Array.isArray(value) ? value.includes(option) : value === option;
}

export function Listing({
  title,
  lede,
  action,
  query,
  products,
  universe,
  hideAudience,
  hideCategory,
}: {
  title: string;
  lede: string;
  action: string;
  query: CatalogQuery;
  products: Product[];
  universe: Product[];
  hideAudience?: boolean;
  hideCategory?: boolean;
}) {
  const shown = facetOptions(universe);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
      <span className="mb-4 block h-px w-10 bg-accent" />
      <h1 className="font-serif text-5xl font-medium md:text-6xl">{title}</h1>
      <p className="mt-3 max-w-xl text-stone-deep">{lede}</p>
      <div className="mt-10 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
        <form id="catalog-filters" action={action} method="get" className="mb-8 lg:mb-0">
          {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
          <details className="border-b border-sand lg:border-0">
            <summary className="filters-summary min-h-11 py-3 text-[12px] uppercase tracking-[0.16em]">
              Filter
            </summary>
            <div className="filters-panel space-y-6 py-4 lg:sticky lg:top-28">
              {!hideAudience ? (
                <fieldset>
                  <legend className={labelCls}>Audience</legend>
                  {audiences
                    .filter((item) => item.handle !== "unisex")
                    .concat(audiences.filter((item) => item.handle === "unisex"))
                    .map((item) => (
                      <label key={item.handle} className="flex min-h-11 items-center gap-2 text-sm">
                        <input type="radio" name="audience" value={item.handle} defaultChecked={query.audience === item.handle} />
                        {item.title}
                      </label>
                    ))}
                </fieldset>
              ) : (
                <input type="hidden" name="audience" value={query.audience ?? ""} />
              )}
              {!hideCategory ? (
                <fieldset>
                  <legend className={labelCls}>Category</legend>
                  {categories.map((item) => (
                    <label key={item.handle} className="flex min-h-11 items-center gap-2 text-sm">
                      <input type="radio" name="category" value={item.handle} defaultChecked={query.category === item.handle} />
                      {item.title}
                    </label>
                  ))}
                </fieldset>
              ) : query.category ? (
                <input type="hidden" name="category" value={query.category} />
              ) : null}
              <fieldset>
                <legend className={labelCls}>Size</legend>
                {shown.sizes.map((size) => (
                  <label key={size} className="mr-3 inline-flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" name="size" value={size} defaultChecked={selected(query.size, size)} />
                    {size}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend className={labelCls}>Colour</legend>
                {shown.colors.map((color) => (
                  <label key={color.name} className="flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" name="color" value={color.name} defaultChecked={selected(query.color, color.name)} />
                    <span className="h-3 w-3 border border-sand" style={{ background: color.hex }} />
                    {color.name}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend className={labelCls}>Fabric</legend>
                {shown.fabrics.map((fabric) => (
                  <label key={fabric} className="flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" name="fabric" value={fabric} defaultChecked={selected(query.fabric, fabric)} />
                    {fabric}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend className={labelCls}>Price, PKR</legend>
                <div className="flex gap-2">
                  <input name="min" inputMode="numeric" placeholder="Min" defaultValue={query.min ?? ""} className={field} />
                  <input name="max" inputMode="numeric" placeholder="Max" defaultValue={query.max ?? ""} className={field} />
                </div>
              </fieldset>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" name="availability" value="instock" defaultChecked={query.availability === "instock"} />
                In stock
              </label>
              <div className="flex gap-3">
                <button className={btn} type="submit">
                  Apply
                </button>
                <Link href={action} className="inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.14em]">
                  Clear
                </Link>
              </div>
            </div>
          </details>
        </form>
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-stone-deep">{products.length} pieces</p>
            <SortSelect value={query.sort || "newest"} />
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
