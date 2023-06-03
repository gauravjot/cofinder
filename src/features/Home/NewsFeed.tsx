import * as React from "react";
import axios from "axios";
import { RSS_NEWS_URL, NEWS_URL, SCHOOL_SHORT_NAME } from "@/config";
import Spinner from "@/components/ui/Spinner";
import { xml2json } from "xml-js";

interface FeedItem {
	title: string;
	link: string;
	description: string;
	pubDate: string;
	author: string;
}

export default function NewsFeed() {
	const [fetched, setFetched] = React.useState<FeedItem[]>([]);
	const [isFetched, setIsFetched] = React.useState(false);

	React.useEffect(() => {
		axios
			.get(RSS_NEWS_URL)
			.then((response) => {
				const data = JSON.parse(
					xml2json(response.data, { compact: true, spaces: 2 })
				);
				let makeList: FeedItem[] = [];
				data.rss.channel.item.forEach(
					(item: {
						title: { _text: string };
						link: { _text: string };
						description: { _cdata: string };
						pubDate: { _text: string };
						["dc:creator"]: { _cdata: string };
					}) => {
						let entry: FeedItem = {
							title: item.title._text,
							link: item.link._text,
							description: item.description._cdata.split("...")[0],
							pubDate: item.pubDate._text,
							author: item["dc:creator"]._cdata,
						};
						makeList.push(entry);
					}
				);
				setFetched(makeList);
				setIsFetched(true);
			})
			.catch((error) => {
				console.log(error);
				setIsFetched(true);
			});
	}, []);

	function pubDatePrettier(pubDate: string): string {
		let date = new Date(pubDate);
		let months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		let string =
			months[date.getMonth()] +
			" " +
			date.getDate() +
			", " +
			date.getFullYear() +
			" - " +
			date.toLocaleTimeString();
		return string;
	}

	return (
		<div>
			<h2 className="flex-1 font-medium font-serif dark:text-white">
				Important News
			</h2>
			<div className="bg-white border border-gray-300 dark:border-slate-700 border-opacity-70 shadow-sm dark:bg-slate-800 p-4 rounded mt-6">
				{isFetched && fetched.length > 0 ? (
					<div className="grid gap-8">
						{fetched.slice(0, 2).map((item: FeedItem, index) => {
							return (
								<div key={index}>
									<p className="text-sm text-gray-500 dark:text-slate-400">
										{pubDatePrettier(item.pubDate)}
									</p>
									<h5 className="font-medium mt-0.5">
										<a
											href={item.link}
											target="_blank"
											rel="noreferrer"
											className="text-accent-700 dark:text-white"
										>
											{item.title}
										</a>
									</h5>
									<p className="text-gray-600 dark:text-slate-400 mt-2 leading-7">
										<span className="text-gray-800 dark:text-slate-300">
											{item.author}
										</span>{" "}
										- {item.description.substring(0, 100)}
										...
									</p>
								</div>
							);
						})}
					</div>
				) : isFetched ? (
					<div className="text-gray-500 dark:text-slate-400 leading-8">
						<span className="mr-2">Sorry, could not find any news.</span>
					</div>
				) : (
					<div className="text-center py-8">
						<Spinner />
					</div>
				)}
				<div className="text-right mt-8">
					<a
						href={NEWS_URL}
						target="_blank"
						rel="noreferrer"
						className="tw-accent-light-button"
					>
						<span className="align-middle mr-2">
							Visit {SCHOOL_SHORT_NAME} Blog
						</span>
						<span className="material-icons text-base align-middle">
							open_in_new
						</span>
					</a>
				</div>
			</div>
		</div>
	);
}
