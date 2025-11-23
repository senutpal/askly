import React from "react";

/**
 * RadialPattern - Radial gradient dot pattern background
 * Provides a subtle, modern background texture
 */
export const RadialPattern = React.memo(() => {
	return (
		<div className="absolute inset-0 -z-10 h-full w-full">
			<div className="absolute h-full w-full bg-[radial-gradient(#00000030_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff35_1px,transparent_1px)]" />
		</div>
	);
});

RadialPattern.displayName = "RadialPattern";
