import React from 'react';
import { cn } from '../../utils/cn.js';

const SkeletonLoader = ({
    className,
    variant = 'rectangular'
}) => {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    return (
        <div className={cn(
            'bg-muted animate-pulse-soft',
            variantClasses[variant],
            className
        )} />
    );
};

export default SkeletonLoader;
