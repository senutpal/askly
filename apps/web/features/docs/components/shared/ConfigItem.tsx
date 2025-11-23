"use client";

interface ConfigItemProps {
	label: string;
	value?: string;
	desc: string;
}

export const ConfigItem = ({ label, value, desc }: ConfigItemProps) => (
	<div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 border-b last:border-0 border-zinc-100 dark:border-zinc-800">
		<div className="min-w-[180px]">
			<code className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
				{label}
			</code>
			{value && <p className="text-xs text-zinc-400 mt-1 font-mono">{value}</p>}
		</div>
		<p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
			{desc}
		</p>
	</div>
);
