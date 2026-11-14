import { products } from "@/lib/catalog";
import { site } from "@/lib/site";

function cell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function GET() {
  const rows = [
    ["sku_id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand"],
    ...products.flatMap((product) => {
      const variant = product.variants.find((item) => item.stock > 0) ?? product.variants[0];
      if (!variant) return [];
      return [[
        variant.sku,
        product.title,
        product.description,
        variant.stock > 0 ? "in stock" : "out of stock",
        "new",
        `${product.price} PKR`,
        `${site.url}/products/${product.handle}`,
        product.images[0]?.src ?? "",
        "EVOLVE",
      ]];
    }),
  ];
  const body = rows.map((row) => row.map((value) => cell(String(value))).join(",")).join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
