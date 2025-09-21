import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative py-20 overflow-hidden lg:py-32 bg-[#2b2b2b]">

            <div className="container relative z-20 px-4 mx-auto bg-[#2b2b2b] flex flex-col lg:flex-row mx-auto">
                <div className="  mx-auto text-left">
                    <Badge
                        variant="secondary"
                        className="mb-6 text-sm font-medium text-white bg-[#A259FF]"
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        Powered by Blockchain Technology
                    </Badge>

                    <h1 className="mb-6 text-4xl font-semibold  text-white lg:text-[67px] text-left leading-[0.9] ">
                        <span className="text-pretty">Unleashing the </span>
                        <span className="text-[#A259FF]">Future</span>
                        <br />
                        <span className="text-pretty">of </span>
                        <span className="text-[#A259FF]">Domains</span>
                    </h1>

                    <p className="max-w-2xl mx-auto mb-8 text-lg text-white lg:text-xl text-left">
                        <span className="text-pretty">
                            By bridging Web2 and Web3, DomainFi will tokenize current and
                            future domain names as real-world assets on the DNS, unlocking a
                            new era of liquidity and financial opportunities for billions of
                            users worldwide.
                        </span>
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-start text-left">
                        <Link href="/marketplace">
                            <button
                                className="text-lg bg-[#A259FF] hover:bg-[#A259FF] px-4 py-[7px] rounded-[20px] text-white flex items-center gap-2 font-bold text-[18px] px-6"
                            >
                                Start Trading
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </Link>

                    </div>

                    <div className="flex items-start justify-start gap-8 mt-12 text-sm text-white">
                        {/* list of features like total sales, total domains, total users */}
                        <div className="grid grid-cols-3 gap-3 w-[70%]">
                            <div className="flex flex-col items-start gap-2 text-pretty">
                                {/* show number of sales */}
                                <span className="text-[28px] font-bold">240k+</span>
                                <span className="text-lg font-bold">Total Sales</span>
                            </div>
                            <div className="flex flex-col items-start gap-2 text-pretty">

                                <span className="text-[28px] font-bold">100k+</span>
                                <span className="text-lg font-bold">Total Domains</span>
                            </div>
                            <div className="flex flex-col items-start gap-2 text-pretty">

                                <span className="text-[28px] font-bold">100k+</span>
                                <span className="text-lg font-bold">Total Users</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center justify-center mx-auto">
                    <div className="flex flex-col items-center  rounded-lg ">
                        <Image src="/uche.svg" alt="Hero Image" width={500} height={500} />
                        <div className="flex flex-col gap-4 bg-[#3B3B3B] rounded-b-[20px] p-4 w-full">
                            <h2 className="text-2xl font-bold text-white">uche.com</h2>
                            <p className="text-white flex items-center gap-2">

                                <User className="w-6 h-6 text-[#A259FF] font-bold" />
                                <span className="text-white">0x1234567890abcdef1234567890abcdef12345678</span>

                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
