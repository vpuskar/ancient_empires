export function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="w-full py-2 rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 text-sm"
      >
        Sign Out
      </button>
    </form>
  );
}
