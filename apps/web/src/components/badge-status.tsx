import { Badge } from "@/components/ui/badge"

type Color = "green" | "red" 

const colorVariants: Record<Color, string> = {
  green: "bg-green-500",
  red: "bg-red-500",
};

export default function BadgeStatus(props: {status: string, color: Color}) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className={`size-1.5 rounded-full ${colorVariants[props.color]}`}
        aria-hidden="true"
      ></span>
      {props.status}
    </Badge>
  )
}
