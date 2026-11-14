import { products } from "@/lib/catalog";
import { site } from "@/lib/site";

function xml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function GET() {
  const items = products
    .map((product) => {
      const variant = product.variants.find((item) => item.stock > 0) ?? product.variants[0];
      if (!variant) return "";
      return `<item>
        <g:id>${xml(variant.sku)}</g:id>
        <title>${xml(product.title)}</title>
        <description>${xml(product.description)}</description>
        <link>${xml(`${site.url}/products/${product.handle}`)}</link>
        <g:image_link>${xml(product.images[0]?.src ?? "")}</g:image_link>
        <g:availability>${variant.stock > 0 ? "in stock" : "out of stock"}</g:availability>
        <g:price>${product.price} PKR</g:price>
        <g:brand>EVOLVE</g:brand>
        <g:condition>new</g:condition>
      </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>EVOLVE</title>
    <link>${xml(site.url)}</link>
    <description>EVOLVE product catalog</description>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
