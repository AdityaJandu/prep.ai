

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Bot, Video, FileText } from "lucide-react";


export const HomeView = () => {

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900">

            {/* Main Content */}
            <main className="flex-grow">

                {/* Hero Section */}
                <section className="container mx-auto max-w-6xl px-4 py-20 text-center sm:py-32">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                        Stop Practicing in the Mirror.
                        <br />
                        <span className="pt-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                            Start Interviewing with AI.
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                        `prep.ai` is a platform where you can create custom AI agents,
                        conduct live video mock interviews, and get instant, detailed
                        feedback with transcripts and summaries.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/meetings"
                            className={buttonVariants({ size: "lg" })}
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="bg-gray-50 py-24">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">
                                    Create Your Personal Interviewer
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Build your own AI agent—a Flutter Developer, Data
                                    Scientist, or Math Tutor—with specific instructions and
                                    personalities.
                                </p>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Video className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">
                                    Realistic, Live Video Sessions
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Go beyond text-based chat. Join a live video call with your AI
                                    agent to practice your communication skills and on-the-spot
                                    thinking.
                                </p>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-xl font-semibold">
                                    Instant, Actionable Feedback
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Get a full breakdown with transcripts, AI summaries, and an
                                    &quot;Ask AI&quot; chat to query your meeting&apos;s content.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* "How It Works" Section */}
                <section className="py-24">
                    <div className="container mx-auto max-w-4xl px-4">
                        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
                            How it Works
                        </h2>
                        <div className="mt-12 space-y-12">
                            <div className="flex flex-col items-center gap-6 md:flex-row">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white text-2xl font-bold">1</div>
                                <div>
                                    <h3 className="text-xl font-semibold">Define Your Agent</h3>
                                    <p className="mt-2 text-gray-600">
                                        Create a new agent and give it a role, like &quot;You are a
                                        senior hiring manager at Google for a web developer role.&quot;
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-6 md:flex-row">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white text-2xl font-bold">2</div>
                                <div>
                                    <h3 className="text-xl font-semibold">Start the Meeting</h3>
                                    <p className="mt-2 text-gray-600">
                                        Schedule a new meeting, assign your custom agent, and join
                                        the live video call when you&apos;re ready to practice.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-6 md:flex-row">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white text-2xl font-bold">3</div>
                                <div>
                                    <h3 className="text-xl font-semibold">Review & Analyze</h3>
                                    <p className="mt-2 text-gray-600">
                                        Instantly get your recording, transcript, and AI summary. Use
                                        the &quot;Ask AI&quot; chat to drill down on specific details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="bg-gray-900 text-white py-24">
                    <div className="container mx-auto max-w-4xl px-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Ready to Ace Your Next Interview?
                        </h2>
                        <p className="mt-4 text-lg text-gray-300">
                            Get instant access to your personal AI interview coach.
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/agents"
                                className={buttonVariants({ size: "lg", variant: "default" })}
                            >
                                Start Prepping for Free
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="border-t">
                <div className="container mx-auto max-w-6xl px-4 py-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} prep.ai. All rights reserved.
                        </p>
                        {/* <div className="flex gap-4">
                            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
                                Privacy Policy
                            </Link>
                        </div> */}
                    </div>
                </div>
            </footer>

        </div>
    );
};


