import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string | number;
    description: string;
    Icon: LucideIcon;
    borderColor?: string;
    iconColor?: string;
}

export function MetricCard({ title, value, description, Icon, borderColor, iconColor }: MetricCardProps) {
    return (
        <Card className={cn("border-t-4", borderColor)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className={cn("h-4 w-4 text-muted-foreground", iconColor)} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}