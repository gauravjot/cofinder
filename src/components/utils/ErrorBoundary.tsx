import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorTemplate } from "./ErrorTemplate";

interface Props {
	children?: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			if (!this.props.fallback) {
				return <ErrorTemplate />;
			}
			return this.props.fallback;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
