/// <reference types="vite/client" />
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles/globals.css?url";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "TanStack Start Starter" },
      { name: "emotion-insertion-point", content: "" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootLayout,
  notFoundComponent: () => {
    return <p>404 - Not Found!</p>;
  },
});

function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <head>
        <title>Spelling Bee</title>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Outlet />
          </LocalizationProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
