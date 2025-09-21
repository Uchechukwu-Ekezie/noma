"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubscribed(true);
        setIsLoading(false);
        setEmail("");
    };

    return (
        <section className="py-16 bg-[#2b2b2b] w-full">
            <div className="container mx-auto px-4">
                <div className="bg-[#3b3b3b] rounded-[20px] overflow-hidden w-full">
                    <div className="p-0">
                        <div className="flex flex-col lg:flex-row px-6 lg:px-10 py-10 w-full">
                            {/* Left Side - Image */}
                            <div className="flex-1 relative min-h-[400px] lg:min-h-[500px] rounded-[20px] overflow-hidden">
                                <div className="absolute inset-0">
                                    <Image
                                        src="/Photo.svg"
                                        alt="Domain Intelligence Newsletter"
                                        fill
                                        className="object-cover rounded-[20px]"
                                    />
                                </div>
                        

                            </div>

                            {/* Right Side - Text Content */}
                            <div className="flex-1 p-8 lg:p-12">
                                <div className="max-w-lg">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Mail className="w-6 h-6 text-[#A259FF]" />
                                        <span className="text-[#A259FF] font-semibold text-sm uppercase tracking-wide">
                                            Stay Updated
                                        </span>
                                    </div>

                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                        Get the Latest Domain Market Insights
                                    </h2>

                                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                        Stay ahead of the curve with exclusive domain market updates,
                                        trading insights, and early access to premium domain listings.
                                        Join thousands of domain investors who trust our newsletter.
                                    </p>

                                    {!isSubscribed ? (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="relative">
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="w-full bg-white border-[#858584] text-black placeholder:text-gray-400 focus:border-[#A259FF] focus:ring-[#A259FF] pr-32 py-3 rounded-[15px] h-18"
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-6 py-2 rounded-[15px] font-semibold flex items-center gap-2 text-sm"
                                                >
                                                    {isLoading ? (
                                                        "Subscribing..."
                                                    ) : (
                                                        <>
                                                            Subscribe
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            <p className="text-sm text-gray-400">
                                                We respect your privacy. Unsubscribe at any time.
                                            </p>
                                        </form>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-[15px]">
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                            <div>
                                                <p className="text-green-500 font-semibold">Successfully Subscribed!</p>
                                                <p className="text-gray-300 text-sm">
                                                    Thank you for joining our newsletter. Check your email for confirmation.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="mt-8 grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-2xl font-bold text-white">10K+</div>
                                            <div className="text-sm text-gray-400">Subscribers</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-white">Weekly</div>
                                            <div className="text-sm text-gray-400">Updates</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
