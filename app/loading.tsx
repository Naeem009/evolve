export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
      <div className="h-3 w-10 bg-accent" />
      <div className="mt-6 h-12 w-64 bg-sand" />
      <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse bg-sand" />
        ))}
      </div>
    </div>
  );
}
