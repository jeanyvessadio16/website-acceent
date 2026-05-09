export function FormErrorBanner({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="text-center mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
      {message}
    </div>
  );
}
