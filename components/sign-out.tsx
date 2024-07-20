import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async (_) => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
