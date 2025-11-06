
import MarkDown from "react-markdown";
import Link from "next/link";

import { GeneratedAvatar } from "@/components/self/generated-avatar";

import { MeetingGetOne } from '@/modules/meetings/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BookOpenTextIcon,
    SparklesIcon,
    FileTextIcon,
    FileVideoIcon,
    ClockFadingIcon
} from 'lucide-react';
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatTimeDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
    data: MeetingGetOne;
};

export const CompletedState = ({ data }: Props) => {

    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-12">
                            {/* Summary: */}
                            <TabsTrigger
                                value="summary"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                                            border-b-2 border-transparent data-[state=active]:border-b-primary 
                                            data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <BookOpenTextIcon />
                                <h4 className="text-[13px]">Summary</h4>
                            </TabsTrigger>

                            {/* Transcripts: */}
                            <TabsTrigger
                                value="transcript"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                                            border-b-2 border-transparent data-[state=active]:border-b-primary 
                                            data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileTextIcon />
                                <h4 className="text-[13px]">Transcript</h4>
                            </TabsTrigger>

                            {/* Recordings: */}
                            <TabsTrigger
                                value="recording"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                                            border-b-2 border-transparent data-[state=active]:border-b-primary 
                                            data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <FileVideoIcon />
                                <h4 className="text-[13px]">Recording</h4>
                            </TabsTrigger>

                            {/* Ask AI / AI Chat: */}
                            <TabsTrigger
                                value="chat"
                                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                                            border-b-2 border-transparent data-[state=active]:border-b-primary 
                                            data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                            >
                                <SparklesIcon />
                                <h4 className="text-[13px]">Ask AI</h4>
                            </TabsTrigger>

                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* Summary: */}
                <TabsContent value="summary" >
                    <div className="bg-white rounded-lg border ">
                        <div className="px-4 py-5 gap-y-4 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center underline gap-x-2 underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar variant="botttsNeutral" seed={data.name} className="size-5" />
                                    <h3>{data.agent.name}</h3>
                                </Link> {"  "}
                                <p className="text-sm">{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-5" />
                                <p>General Summary</p>
                            </div>

                            <Badge variant="outline" className="flex items-center gap-x-2">
                                <ClockFadingIcon className="text-blue-600" />
                                {data.duration ? formatTimeDuration(data.duration) : "No duration"}
                            </Badge>

                            <MarkDown
                                components={
                                    {
                                        h1: (props) => (
                                            <h1 className="text-2xl font-medium mb-6 " {...props} />
                                        ),
                                        h2: (props) => (
                                            <h2 className="text-xl font-medium mb-6 " {...props} />
                                        ),
                                        h3: (props) => (
                                            <h3 className="text-lg font-medium mb-6 " {...props} />
                                        ),
                                        h4: (props) => (
                                            <h4 className="text-base font-medium mb-6 " {...props} />
                                        ),
                                        p: (props) => (
                                            <p className="leading-relaxed mb-6 text-sm " {...props} />
                                        ),
                                        ol: (props) => (
                                            <ol className="list-disc list-inside mb-6" {...props} />
                                        ),
                                        ul: (props) => (
                                            <ul className="list-decimal list-inside mb-6" {...props} />
                                        ),
                                        li: (props) => <li className="mb-1" {...props} />,
                                        strong: (props) => (
                                            <strong className="font-semibold" {...props} />
                                        ),
                                        code: (props) => (
                                            <code className="bg-gray-200 px-1 py-0.5 rounded" {...props} />
                                        ),
                                        blockquote: (props) => (
                                            <blockquote className="border-l-4 pl-4 italic my-4" {...props} />
                                        )
                                    }
                                }
                            >
                                {data.summary}
                            </MarkDown>
                        </div>
                    </div>
                </TabsContent>

                {/* Transcripts: */}
                <TabsContent value="transcript" >
                    <Transcript meetingId={data.id} />
                </TabsContent>


                {/* Recordings: */}
                <TabsContent value="recording" >
                    <div className="bg-white rounded-lg border px-4 py-5">
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>

                {/* Ask AI / AI Chat: */}
                <TabsContent value="chat">
                    <ChatProvider meetingId={data.id} meetingName={data.name} />
                </TabsContent>

            </Tabs>
        </div>
    );
};

