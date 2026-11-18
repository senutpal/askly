import Image from "next/image";

export const Logo = ({ size }: { size: number }) => {
	return (
		<Image src="/logo.svg" alt="" width={size} height={size} unoptimized />
	);
};
