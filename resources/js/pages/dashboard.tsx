import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, XAxis, BarChart, Bar } from "recharts";
import { TrendingUp, ArrowLeft, Settings, Bell, ChevronRight } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Dashboard() {
    // Sample data for apprehension line chart
    const dailyData = [
        { date: "Jan 1", value: 32 },
        { date: "Jan 2", value: 58 },
        { date: "Jan 3", value: 44 },
        { date: "Jan 4", value: 78 },
        { date: "Jan 5", value: 34 },
        { date: "Jan 6", value: 56 },
    ];

    // Sample data for monthly apprehensions
    const monthlyData = [
        { month: "Jan", value: 32 },
        { month: "Feb", value: 256 },
        { month: "Mar", value: 144 },
        { month: "Apr", value: 168 },
        { month: "May", value: 248 },
        { month: "Jun", value: 96 },
        { month: "Jul", value: 144 },
        { month: "Aug", value: 168 },
        { month: "Sep", value: 40 },
    ];
    // Chart configuration
    const chartConfig: ChartConfig = {
        value: {
            label: "Apprehension",
            color: "hsl(var(--chart-1))",
        }
    };

    // Inside your Dashboard component, add this function to get all images
    const getLGUSeals = () => {
        const seals = import.meta.glob<{ default: string }>('/resources/images/LGU-Seals/*.{png,jpg,jpeg}', { eager: true });
        return Object.values(seals).map(seal => seal.default);
    };

    // Add this state at the beginning of the Dashboard component
    const [selectedLGU, setSelectedLGU] = useState<number | null>(null);

    // Add this dummy data for recent apprehensions
    const recentApprehensions = [
        {
            id: 1,
            violator: "John Doe",
            violation: "No Driver's License",
            date: "Mar 15, 2024",
            location: "Main Street",
        },
        {
            id: 2,
            violator: "Jane Smith",
            violation: "Expired Registration",
            date: "Mar 14, 2024",
            location: "Highway 1",
        },
        {
            id: 3,
            violator: "Mike Johnson",
            violation: "Overspeeding",
            date: "Mar 13, 2024",
            location: "Downtown",
        },
    ];

    // Create plugin instance outside of JSX
    const plugin = Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
    });

    // Inside Dashboard component, add this data
    const announcements = [
        {
            id: 1,
            title: "System Maintenance Notice",
            content: "The system will undergo scheduled maintenance on March 25, 2024, from 2:00 AM to 4:00 AM PHT.",
            priority: "high",
            date: "Mar 20, 2024"
        },
        {
            id: 2,
            title: "New Traffic Policy Implementation",
            content: "Starting April 1, 2024, updated traffic violation penalties will take effect across all jurisdictions.",
            priority: "medium",
            date: "Mar 18, 2024"
        }
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Announcement Card */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-purple-50 dark:bg-purple-950/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-purple-500 animate-[shake_0.5s_ease-in-out_infinite]" />
                                Announcements
                            </CardTitle>
                            {/* <button className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1">
                                View All
                                <ChevronRight className="h-4 w-4" />
                            </button> */}
                        </CardHeader>
                        <CardContent>
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                plugins={[plugin]}
                                className="w-full"
                            >
                                              <CarouselContent className="mt-2 -ml-2 md:-ml-4">
                                    {announcements.map((announcement) => (
                                        <CarouselItem key={announcement.id}>
                                            <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800/50 backdrop-blur-sm p-4 transition-all hover:shadow-md border border-purple-100 dark:border-purple-900/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-black text-2xl text-primary dark:text-purple-400">
                                                        {announcement.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${announcement.priority === 'high'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                        }`}>
                                                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                    {announcement.content}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {announcement.date}
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {/* <div className="mt-4 flex justify-center gap-2">
                                    <CarouselPrevious className="relative static translate-y-0 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800" />
                                    <CarouselNext className="relative static translate-y-0 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800" />
                                </div> */}
                            </Carousel>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-950/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                </span>
                                Recent Apprehension
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                    skipSnaps: false,
                                    dragFree: false,
                                }}
                                plugins={[plugin]}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {recentApprehensions.map((apprehension) => (
                                        <CarouselItem key={apprehension.id} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                                            <div className="p-4 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900/20">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-semibold text-primary dark:text-purple-400">
                                                        {apprehension.violator}
                                                    </h3>
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                        New
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            {apprehension.violation}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>{apprehension.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>{apprehension.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {/* <div className="mt-4 flex justify-center gap-2">
                                    <CarouselPrevious className="relative static translate-y-0 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800" />
                                    <CarouselNext className="relative static translate-y-0 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800" />
                                </div> */}
                            </Carousel>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Collection Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Collection</CardTitle>
                            <div className="p-2 bg-muted rounded-full">
                                <Settings
                                    size={20}
                                    onClick={() => setSelectedLGU(null)}
                                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedLGU === null ? (
                                // Grid view of all LGU seals
                                <div className="grid grid-cols-4 gap-6">
                                    {getLGUSeals().map((sealPath, i) => (
                                        <div key={i} className="relative group">
                                            <AspectRatio
                                                ratio={1 / 1}
                                                className="bg-muted rounded-full overflow-hidden transition-all duration-200 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] cursor-pointer"
                                                onClick={() => setSelectedLGU(i)}
                                            >
                                                <img
                                                    src={sealPath}
                                                    alt={`LGU Seal ${i + 1}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </AspectRatio>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Single LGU view with back button
                                <div className="h-screen flex flex-col m-auto">
                                    {/* <button
                                        onClick={() => setSelectedLGU(null)}
                                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                                    >
                                        <ArrowLeft size={20} />
                                        <span>Back to all LGUs</span>
                                    </button> */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="flex flex-col items-center justify-center max-w-sm">
                                            <AspectRatio
                                                ratio={1 / 1}
                                                className="w-72 mb-6"
                                            >
                                                <img
                                                    src={getLGUSeals()[selectedLGU]}
                                                    alt={`Selected LGU Seal`}
                                                    className="rounded-full object-cover"
                                                />
                                            </AspectRatio>
                                            <div className="mt-6 text-lg text-muted-foreground">Month of October</div>
                                            <div className="text-5xl font-bold text-purple-600 mt-3">
                                                ₱150,000.00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reports and Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Reports and Statistics</CardTitle>
                            <CardDescription>January - June 2024</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Daily Apprehension Line Chart */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Apprehension Per Day</h4>
                                <ChartContainer config={chartConfig}>
                                    <LineChart
                                        accessibilityLayer
                                        data={dailyData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                            bottom: 12,
                                        }}
                                        height={200}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Line
                                            dataKey="value"
                                            type="natural"
                                            stroke="hsl(250 90% 60%)"
                                            strokeWidth={2}
                                            dot={{
                                                fill: "hsl(250 90% 60%)",
                                                strokeWidth: 0,
                                            }}
                                            activeDot={{
                                                r: 6,
                                                fill: "hsl(250 90% 60%)",
                                                strokeWidth: 0,
                                            }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </div>

                            {/* Monthly Apprehension Bar Chart */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Apprehension Per Month</h4>
                                <ChartContainer config={chartConfig}>
                                    <BarChart
                                        accessibilityLayer
                                        data={monthlyData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                        height={200}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="hsl(250 90% 60%)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        </CardContent>

                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
