"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";



const HomeView = () => {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.hello.queryOptions({ text: "Aditya" }));

    return (
        <div className="flex flex-col p-4 gap-4 justify-center items-center">
            <h1>{data?.greeting}</h1>
        </div>
    );
};

export default HomeView;
