import React, { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../utils/cn.js";

const Avatar = forwardRef(function Avatar({ className, ...props }, ref) {
    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        />
    );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = forwardRef(function AvatarImage({ className, ...props }, ref) {
    return (
        <AvatarPrimitive.Image
            ref={ref}
            className={cn("h-full w-full rounded-full object-cover", className)}
            {...props}
        />
    );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = forwardRef(function AvatarFallback({ className, ...props }, ref) {
    return (
        <AvatarPrimitive.Fallback
            ref={ref}
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-muted",
                className
            )}
            {...props}
        />
    );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
