import { ReactNode } from "react";

export interface TooltipProps {
    title: string;
    children: React.ReactElement<any, any>;
}