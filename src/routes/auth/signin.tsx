import { createFileRoute } from "@tanstack/react-router";
import authClient from "@/utils/auth-client";

export const Route = createFileRoute("/auth/signin")({
  component: SignIn,
});

function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Spelling Bee+!
          </h2>
        </div>
        <div>
          <button
            onClick={() =>
              authClient.signIn.oauth2({
                providerId: "authentik",
                callbackURL: "/api/auth/oauth/callback/authentik",
              })
            }
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
