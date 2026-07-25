// app/loading.tsx
export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-full h-1 bg-gray-100 overflow-hidden">
        <div className="h-full bg-orange-500 w-1/3 animate-shimmer-bar" />
      </div>
    </div>
  );
}