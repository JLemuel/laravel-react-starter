import ApplicationLogo from "@/components/application-logo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import Logo from '../../images/logo.png'

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-background">
            <div>
                <Link href="/">
                    {/* <ApplicationLogo className="w-20 h-20 text-gray-500 fill-current" /> */}
                    <img
                        src={Logo}
                        alt="POVR Logo"
                        className="object-contain w-auto h-12"
                    />
                </Link>
            </div>

            <div className="w-full px-6 py-4 mt-6 sm:max-w-md">{children}</div>
        </div>
    );
}
