"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-8">
      <h2 className="text-xl font-semibold text-red-500">Something went wrong!</h2>
      <p className="text-sm text-vault-muted max-w-md text-center">
        {error.message || "An unexpected error occurred while loading this section."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-vault-primary text-white rounded-md hover:bg-vault-accent transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
