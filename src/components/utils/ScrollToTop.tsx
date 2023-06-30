import * as React from "react";

export default function ScrollToTopBtn() {
	let mybutton = React.useRef<HTMLButtonElement>(null);

	// When the user scrolls down 20 units from the top of the document, show the button
	React.useEffect(() => {
		const handleScroll = () => {
			if (
				document.body.scrollTop > 200 ||
				document.documentElement.scrollTop > 200
			) {
				mybutton.current?.classList.remove("-right-16");
				mybutton.current?.classList.add("transition-all");
				mybutton.current?.classList.add("right-0");
			} else {
				mybutton.current?.classList.remove("right-0");
				mybutton.current?.classList.add("-right-16");
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<button
			ref={mybutton}
			type="button"
			className="fixed flex place-items-center place-content-center z-20 bottom-0 lg:bottom-16 -right-16 bg-gray-300/80 dark:bg-slate-700/80 hover:bg-gray-400/60 dark:hover:bg-slate-600 rounded-tl-md lg:rounded-l-lg w-12 h-12"
			id="btn-back-to-top"
			title="Scroll to top"
			onClick={() => {
				document.body.scrollTop = 0;
				document.documentElement.scrollTop = 0;
			}}
			aria-label="Top"
		>
			<span className="ic-md dark:invert ic-north"></span>
		</button>
	);
}
