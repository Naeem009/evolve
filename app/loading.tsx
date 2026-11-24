export default function Loading() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="h-3 w-10 bg-accent" />
        <div className="mt-6 h-12 w-64 bg-sand" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-0 lg:grid-cols-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse bg-sand" />
        ))}
      </div>
    </div>
  );
}
