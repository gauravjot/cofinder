import * as React from "react";
import Sidebar from "@/features/Sidebar/Sidebar";
import github from "@/assets/svg/github.svg";
import linkedin from "@/assets/svg/linkedin.svg";
import logo from "@/assets/images/branding.png";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { APP_NAME, VERSION_CODE } from "@/config";

export default function About() {
	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<div className="App">
			<Helmet>
				<title>About Us - {APP_NAME}</title>
			</Helmet>
			<div className="flex relative">
				<div className="flex-none xl:sticky fixed top-0 h-screen z-20">
					{/* Sidebar */}
					<Sidebar current="team" />
				</div>
				<div className="bg-slate-200 dark:bg-slate-900 bg-opacity-80 w-full z-10">
					<div className="container p-4 py-8 mx-auto min-h-screen">
						<div className="min-h-screen relative flex-1 lg:grid grid-cols-12">
							<div className="col-span-9 2xl:col-span-8">
								<div className="max-w-[90ch] float-right lg:mt-6">
									<div className="float-right">
										<img
											src={logo}
											alt="Cofinder Logo"
											className="lg:w-10 lg:h-10 w-8 h-8"
										/>
									</div>
									<br />
									<span className="text-slate-400 dark:text-slate-600 text-sm">
										v{VERSION_CODE}
									</span>
								</div>
								<div className="mt-10 xl:mt-6 mb-6">
									<h3
										className="font-medium font-serif"
										id="about-cofinder"
									>
										About CoFinder
									</h3>
								</div>
								<p className="max-w-[70ch] text-lg lg:leading-9 leading-8 text-gray-800 dark:text-slate-400 lg:tracking-wide">
									Our goal is to alleviate the stress of course
									selection for students. Typically, registration for
									each semester coincides with final exams, adding an
									extra layer of pressure to an already challenging
									time. Our solution is to provide a website that
									simplifies the process for students. With this
									website, they no longer have to balance a heavy
									workload and navigate shifting schedules from the
									university simultaneously. Say goodbye to the outdated
									myUFV portal and the frustrating process of manually
									creating a schedule by juggling multiple classes. Our
									website streamlines the entire course selection
									process for students, making it easier and
									stress-free.
								</p>
								<h4 className="font-medium font-serif mt-8 mb-2">
									Want to talk?
								</h4>
								<p className="max-w-[70ch] text-lg lg:leading-9 leading-8 text-gray-800 dark:text-slate-400">
									Contact us:{" "}
									<a
										className="font-medium italic font-mono tracking-tight"
										href="mailto:admin@cofinder.ca"
									>
										admin@cofinder.ca
									</a>
								</p>
								<div className="mt-12 mb-4">
									<h3
										className="font-medium font-serif"
										id="about-team"
									>
										About Team
									</h3>
								</div>
								<p className="mt-4 mb-8 dark:text-slate-300">
									👋 Meet the team behind this project.
								</p>
								<div className="grid lg:grid-cols-2 grid-cols-1 gap-6 max-w-[90ch]">
									<TeamMember
										name="David Jeler"
										title="Software Engineer, Back-End"
										description={
											<span>
												Ever since I was a child, my passion for
												computers has driven me to explore the
												intricate world behind the screen. My
												fascination with the inner workings of
												technology has led me to specialize in
												creating and maintaining servers, as well
												as delving into the realm of
												cybersecurity. My toolkit mainly consists
												of Python, Bash scripting and Ansible.
												<div className="py-1.5" />
												When I’m not immersed in the digital
												landscape, I find solace in playing the
												piano and composing music, allowing me to
												unwind and and express my creativity in a
												different way.
											</span>
										}
										github="https://github.com/DJeler"
										linkedin="https://ca.linkedin.com/in/david-jeler"
										email="djeler8562@gmail.com"
									/>
									<TeamMember
										name="Gauravjot Garaya"
										title="Software Engineer, Front-End"
										description={
											<span>
												With my niche in front-end development, I
												enjoy making reactive user experiences in
												my applications. My toolkit primarily
												consists of ReactJS and it's associating
												libraries for building complex projects. I
												also work with Django (a Python framwork)
												on as-need basis to bring server logic and
												data to my front-ends.
												<div className="py-1.5" />
												When not engineering, I love going on
												walks around the town and enjoy nature's
												beauty which I believe is important to
												balance out my otherwise busy week.
											</span>
										}
										github="https://github.com/gauravjot"
										website="https://gauravjot.com"
										email="connect@gauravjot.com"
										linkedin="https://linkedin.com/in/gauravjot"
									/>
									<TeamMember
										name="Michael Morris"
										title="Software Engineer"
										description={
											<span>
												I'm a versatile software engineer with a
												passion for designing innovative models
												and diagrams that drive project success.
												My strong business background enables me
												to bridge the gap between technology and
												strategy, delivering solutions that exceed
												expectations.
												<div className="py-1.5" />
												When I'm not coding, you'll find me
												shredding the slopes skiing or exploring
												new trails mountain biking, embracing the
												thrill and challenge of the outdoors. I
												bring the same energy and determination to
												my work, always ready to tackle complex
												problems and contribute to the growth of
												the team.
											</span>
										}
										github="https://cisgitlab.ufv.ca/u/Michael.Morris"
										email="michael.morris@student.ufv.ca"
										linkedin="https://www.linkedin.com/in/michael-morris-526415130/"
									/>
									<TeamMember
										name="Simon Bogdanov"
										title="Software Engineer, Back-End"
										description={
											<span>
												I am a skilled Computer Science soon to be
												graduate with a proven track record of
												delivering results. With expertise in
												Software Engineering, QA, Back-end/IT, and
												legacy environments; I am eager to
												innovate, and focus on excellence.
											</span>
										}
										linkedin="https://www.linkedin.com/in/simon-bogdanov-a32037147/"
										github="https://github.com/ConfirmedToBeACabbage"
										email="simon.bogdanov@gmail.com"
										website="https://itssimon.ca/"
									/>
									<TeamMember
										name="Zulfiqar Ali"
										title="Software Engineer, Front-End"
										description={
											<span>
												As a junior front-end developer, I possess
												extensive knowledge of HTML, CSS,
												JavaScript, and React. With two years of
												experience developing front-end websites
												under my belt, I have had the privilege of
												collaborating with development teams and
												playing a pivotal role in bringing various
												web projects to fruition. Also awarded to
												be on the dean's list with holding GPA of
												3.86/4.00.
											</span>
										}
										github="https://github.com/zulfiqar-110"
										linkedin="https://linkedin.com/in/zulfiqar-a"
									/>
								</div>
								<div className="mt-12 mb-4">
									<h3
										className="font-medium font-serif"
										id="special-thanks"
									>
										🎓 Special Thanks
									</h3>
								</div>
								<div className="max-w-[90ch] p-4 mt-4 mb-8 border border-gray-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-1000 hover:bg-opacity-40 rounded shadow-sm">
									<h4 className="font-bold">Opeyemi Adesina</h4>
									<div className="mt-1 dark:text-slate-200">
										Instructor • University of the Fraser Valley
										<div className="py-0.5" />
										COMP 370 AB1 - Winter 2023
									</div>
									<p className="mt-4 text-gray-700 dark:text-slate-400 leading-7 tracking-wide">
										{
											<>
												Opeyemi's inspiration was pivotal in
												motivating our team to deliver this
												project at a much greater capacity. In the
												beginning, our focus was limited to
												serving UFV exclusively. However, with his
												encouragement, we were able to transform
												CoFinder into a versatile platform that
												can be adapted to other schools with ease.
												<div className="py-1.5" />
												Throughout the project, Opeyemi held
												biweekly meetings with us to monitor our
												progress and provide valuable feedback on
												the core objects and models. His guidance
												and open-mindedness allowed us to build
												this platform using the latest best
												practices.
												<div className="py-1.5" />- Cofinder Team
											</>
										}
									</p>
								</div>
								<div className="text-gray-500 dark:text-slate-400 mt-12">
									Last edited: April 7, 2023, 3:50 PM
								</div>
							</div>
							<div className="col-span-3 2xl:col-span-4 lg:block hidden pl-24 mt-2">
								<h3 className="mt-4 font-medium tracking-tight">
									On this page
								</h3>
								<ul className="mt-4">
									<li className="pt-1.5 pl-2 ml-4 list-disc text-gray-400 dark:text-slate-400">
										<a href="#about-cofinder">About Cofinder</a>
									</li>
									<li className="pt-1.5 pl-2 ml-4 list-disc text-gray-400 dark:text-slate-400">
										<a href="#about-team">About Team</a>
									</li>
									<li className="pt-1.5 pl-2 ml-4 list-disc text-gray-400 dark:text-slate-400">
										<a href="#special-thanks">Special Thanks</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface TmProps {
	image?: string;
	name: string;
	title?: string;
	description: React.ReactNode;
	website?: string;
	email?: string;
	github: string;
	linkedin?: string;
}

function TeamMember(props: TmProps) {
	return (
		<div className="border border-gray-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-1000 hover:bg-opacity-40 rounded shadow-sm">
			{props.image ? (
				<img
					src={props.image}
					alt={props.name}
					className="w-100 h-96 rounded-t object-cover"
				/>
			) : (
				<></>
			)}
			<div className="text-black text-xl px-4 pt-4">
				<span className="align-middle font-bold dark:text-white">
					{props.name}{" "}
				</span>
				{props.website ? (
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={props.website}
						className="align-middle inline-block border border-transparent tw-hover-no-underline hover:bg-accent-200 dark:hover:bg-slate-800 hover:text-accent-800 transition-colors hover:border-accent-300 dark:hover:border-slate-700 text-accent-700 dark:text-slate-300 px-1 rounded ml-1"
					>
						<span className="material-icons rotate-45 hover:-rotate-45 text-lg align-middle transition-transform">
							link
						</span>
						<span className="font-mono text-[0.95rem] font-bold align-middle ml-1">
							website
						</span>
					</a>
				) : (
					<></>
				)}
			</div>
			<p className="px-4 mt-1 dark:text-slate-100">{props.title}</p>
			<div className="px-4 mt-4 text-gray-700 dark:text-slate-400 leading-7 tracking-wide">
				{props.description}
			</div>
			<div className="p-4 mt-2 mb-2">
				{props.github ? (
					<Link
						target="_blank"
						rel="noopener noreferrer"
						to={props.github}
						className="text-base mr-3 inline-block px-1.5 py-0.5 border border-transparent rounded-md align-middle hover:bg-gray-300 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-700 transition-colors cursor-pointer text-gray-500 tw-hover-no-underline"
					>
						<img
							className="hover:scale-125 align-middle inline-block transition-transform h-5 w-5 dark:invert"
							src={github}
							alt={"Github " + props.name}
						/>
						<span className="text-black dark:text-white font-mono font-medium ml-2 align-middle">
							Github
						</span>
					</Link>
				) : (
					<></>
				)}
				{props.linkedin ? (
					<Link
						target="_blank"
						rel="noopener noreferrer"
						to={props.linkedin}
						className="text-base mr-3 inline-block px-1.5 py-0.5 border border-transparent rounded-md align-middle hover:bg-gray-300 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-700 transition-colors cursor-pointer text-gray-500 tw-hover-no-underline"
					>
						<img
							className="hover:scale-125 align-middle inline-block transition-transform h-5 w-5 dark:invert"
							src={linkedin}
							alt={"LinkedIn " + props.name}
						/>
						<span className="text-black dark:text-white font-mono font-medium ml-2 align-middle">
							LinkedIn
						</span>
					</Link>
				) : (
					<></>
				)}
				{props.email ? (
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={"mailto:" + props.email}
						className="text-base inline-block px-1.5 py-0.5 border border-transparent rounded-md align-middle hover:bg-gray-300 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-700 transition-colors cursor-pointer text-gray-500 tw-hover-no-underline"
					>
						<span className="material-icons text-black text-[1.415rem] align-middle hover:scale-125 transition-transform dark:invert">
							email
						</span>
						<span className="text-black dark:text-white font-mono font-medium ml-2 align-middle">
							Email
						</span>
					</a>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
