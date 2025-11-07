"use client";

// NPM imports:
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Local imports:
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { FaGoogle, FaGithub } from "react-icons/fa";



// Form Schema:
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
});


export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setLoading(true);

        try {
            await authClient.signIn.email(
                {
                    email: data.email,
                    password: data.password,
                    callbackURL: "/",
                },
                {
                    onSuccess: () => {
                        router.push("/");
                    },
                    onError: ({ error }) => {
                        setError(error.message);
                    },
                }
            );
        } catch (err) {
            // Catch any unhandled promise rejections
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            // Always stop loading no matter what
            setLoading(false);
        }
    };

    const onSubmitSocial = async (provider: "google" | "github") => {
        setError(null);
        setLoading(true);

        try {
            await authClient.signIn.social(
                {
                    provider: provider,
                    callbackURL: "/",
                },
                {
                    onError: ({ error }) => {
                        setError(error.message);
                    },
                }
            );
        } catch (err) {
            // Catch any unhandled promise rejections
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            // Always stop loading no matter what
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col p-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-semibold">Welcome back</h1>
                                    <p className="text-muted-foreground text-balance">Login to your account</p>
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="email">Email</FormLabel>
                                                <Input id="email" type="email" placeholder="iam@example.com" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="password">Password</FormLabel>
                                                <Input id="password" type="password" placeholder="********" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {!!error &&
                                    <Alert className="bg-destructive/30 ">
                                        <OctagonAlertIcon className="w-4 h-4 !text-destructive" />
                                        <AlertTitle >
                                            {error}
                                        </AlertTitle>
                                    </Alert>
                                }

                                {loading && <Button disabled size="sm">
                                    <Spinner />
                                    Signing in...
                                </Button>
                                }

                                {!loading && <Button type="submit" >
                                    Sign in
                                </Button>}

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button disabled={loading} onClick={() => onSubmitSocial("google")} type="button" variant="outline" >
                                        <FaGoogle /> Google
                                    </Button>
                                    <Button disabled={loading} onClick={() => onSubmitSocial("github")} type="button" variant="outline" >
                                        <FaGithub /> Github
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Don&apos;t have an account? <Link href="/sign-up" className="font-bold" >Sign up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-pink-200 to-pink-400 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="Logo" className="w-[92px] h-[92px] pt-4" />
                        <p className="text-2xl font-semibold text-purple-800 pb-4">
                            prep.ai
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-6">
                By clicking continue, you agree our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
};