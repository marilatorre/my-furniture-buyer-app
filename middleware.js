import { withAuth } from "next-auth/middleware";

// Any page not in the matcher below requires a logged-in session.
// Visiting one without a valid session redirects to /login.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!login|api/auth|_next|favicon.ico|.*\\..*).*)"],
};
