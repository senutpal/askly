import { Button } from "@workspace/ui";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import { ArrowRight, Check, type LucideIcon, Plug, Sparkles } from "lucide-react";
import Image from "next/image";

export interface Feature {
	icon: LucideIcon;
	label: string;
	description: string;
}

interface PluginCardProps {
	isDisabled?: boolean;
	serviceName: string;
	serviceImage: string;
	features: Feature[];
	onSubmit: () => void;
}

export const PluginCard = ({
	isDisabled,
	serviceName,
	serviceImage,
	features,
	onSubmit,
}: PluginCardProps) => {
	return (
		<div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl dark:bg-black/20">
			{/* Background Glow */}
			<div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
			<div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

			<div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
				{/* Left Side: Connection Visual */}
				<div className="flex flex-col items-center gap-6 lg:w-1/3">
					<div className="flex items-center gap-4">
						<div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md transition-transform hover:scale-105 dark:bg-black/40">
							<Image
								alt="Platform"
								className="h-12 w-12 object-contain"
								height={48}
								width={48}
								src="/logo.svg"
							/>
							<div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
								<Sparkles className="h-4 w-4" />
							</div>
						</div>

						{/* Animated Connection Line */}
						<div className="relative flex w-16 items-center justify-center">
							<div className="h-1 w-full rounded-full bg-border/50" />
							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 20, opacity: [0, 1, 0] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
							/>
						</div>

						<div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md transition-transform hover:scale-105 dark:bg-black/40">
							<Image
								alt={serviceName}
								className="h-12 w-12 rounded-xl object-contain"
								height={48}
								width={48}
								src={serviceImage}
							/>
						</div>
					</div>

					<div className="text-center">
						<h3 className="text-xl font-bold">Connect {serviceName}</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Supercharge your agent with {serviceName} capabilities.
						</p>
					</div>

					<Button
						className="group w-full max-w-xs rounded-xl bg-primary/90 text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary hover:shadow-primary/30"
						size="lg"
						disabled={isDisabled}
						onClick={onSubmit}
					>
						Connect Now
						<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Button>
				</div>

				{/* Right Side: Features Grid */}
				<div className="flex-1">
					<div className="grid gap-4 sm:grid-cols-2">
						{features.map((feature, idx) => (
							<motion.div
								key={feature.label}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: idx * 0.1 }}
								className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 dark:hover:bg-white/5"
							>
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
									<feature.icon className="h-5 w-5" />
								</div>
								<div>
									<h4 className="font-semibold text-foreground">
										{feature.label}
									</h4>
									<p className="mt-1 text-sm text-muted-foreground">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
