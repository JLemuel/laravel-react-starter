import { FormEventHandler } from "react";
import GuestLayout from "@/layouts/guest-layout";
import { Head, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputError } from "@/components/ui/input-error";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOTP({ status, email }: { status?: string; email?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const handleOTPChange = (value: string) => {
        setData('otp', value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verify.otp'));
    };

    const resendOTP: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.resend'));
    };

    return (
        <GuestLayout>
            <Head title="Verify OTP" />

            <Card className="mx-auto max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        We've sent a verification code to {email}. 
                        Please enter the code and set your new password.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label>Verification Code</Label>
                            <InputOTP 
                                maxLength={6}
                                value={data.otp}
                                onChange={handleOTPChange}
                                disabled={processing}
                                className="gap-2"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError message={errors.otp} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                required
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-4 w-4 inline"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Set Password'
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={resendOTP}
                                disabled={processing}
                            >
                                Resend Code
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
} 