import * as React from "react";

interface IErrorTemplateProps {
	message?: React.ReactNode;
}

export function ErrorTemplate(props: IErrorTemplateProps) {
	return (
		<div className="container py-8 mx-auto dark:text-white">
			<h3 className="font-bold">Error 📛</h3>
			<p className="mt-2 dark:text-slate-400">
				{props.message ? (
					<>{props.message}</>
				) : (
					<>
						Corruption in saved data.{" "}
						<span className="border-b-2 border-accent-300 dark:border-slate-100 font-medium">
							Clear site data
						</span>{" "}
						to fix this or contact app support.
					</>
				)}
			</p>
		</div>
	);
}
