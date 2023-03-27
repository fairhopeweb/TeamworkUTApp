import Head from "next/head";
import LoadingDots from "@/components/LoadingDots";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Github from "@/components/Github";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";

export default function Home() {
  const [loading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    toast.loading("Generating List of tasks...", {
      duration: 3000,
    });
    try {
      const response = await fetch("/api/generateTeamworkTasks", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Could not get task list");
      }

      if (response.ok) {
        toast.success("Generated list sent to Slack!", {
          duration: 3000,
        });
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Teamwork Unassigned Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-16 lg:mt-0">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/christian-luntok/TeamworkUnassignedTasks"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate a list of your Teamwork&apos;s unassigned tasks.
        </h1>
        <p className="text-slate-500 mt-5">
          And send them straight to your Slack channels!
        </p>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <Toaster position="bottom-center" reverseOrder={false} />
        {!loading && (
          <button
            className="bg-black rounded-md text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 max-w-5xl"
            onClick={handleClick}
          >
            Generate your tasks &rarr;
          </button>
        )}
        {loading && (
          <button
            className="bg-black rounded-md text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 max-w-5xl"
            disabled
          >
            <LoadingDots color="white" style="large" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}
