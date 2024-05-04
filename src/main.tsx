import ReactDOM from "react-dom/client";
import App from "./App";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

import {
	QueryClient as QueryClient2,
	QueryClientProvider as QueryClientProvider2,
} from "react-query";

const queryClient2 = new QueryClient2();

/*
 * Paint the DOM and Redux
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider2 client={queryClient2}>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</QueryClientProvider2>
	</React.StrictMode>
);
