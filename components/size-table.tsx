import { adultChart, adultInches, girlsChart, girlsInches } from "@/lib/size-charts";

export function SizeTable({ kind, unit }: { kind: "adult" | "girls"; unit: "cm" | "in" }) {
  const rows = kind === "adult" ? (unit === "cm" ? adultChart : adultInches) : unit === "cm" ? girlsChart : girlsInches;
  return (
    <table className="mt-3 w-full text-left text-sm">
      <thead>
        <tr className="border-b border-sand text-[11px] uppercase tracking-[0.14em] text-stone-deep">
          <th className="py-2 font-medium">Size</th>
          <th className="py-2 font-medium">Chest</th>
          <th className="py-2 font-medium">Waist</th>
          <th className="py-2 font-medium">Hip</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.size} className="border-b border-sand">
            <th className="py-3 font-medium">{row.size}</th>
            <td>{row.chest}</td>
            <td>{row.waist}</td>
            <td>{row.hip}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
