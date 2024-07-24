"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => signOut()}> Sign Out</button>
    </div>
  );
}
