import { Card } from "@/components/ui/card";
import Link from "next/link";
import Socials from "./socials";

interface WrapperProps {
    children: React.ReactNode,
    header: string,
    text: string,
    url: string,
    social?: boolean,
}

export default function Wrapper({ children, header, text, url, social = true }: WrapperProps) {
    return (
        <Card className="flex items-center justify-center w-full h-[100vh] border-none absolute top-0">
            <div className="w-[30rem] md:px-[1rem]">
                <h1 className="uppercase text-center font-semibold text-2xl sm:text-lg text-slate-800 my-2">
                    {header}
                </h1>
                <div>
                    {children}
                </div>
                {social ? <Socials /> : null}
                <p className="text-slate-600 my-3 text-center">
                    {text}
                    <Link href={`${url}`}>{" "}
                        Click here.
                    </Link>
                </p>
            </div>
        </Card>
    )
}
