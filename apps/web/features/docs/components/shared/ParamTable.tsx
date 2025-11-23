"use client";

interface ParamTableProps {
	params: { name: string; type: string; desc: string; required?: boolean }[];
}

export const ParamTable = ({ params }: ParamTableProps) => (
	<div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
		<table className="w-full text-sm text-left">
			<thead className="bg-zinc-100 dark:bg-zinc-900/50">
				<tr>
					<th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800">
						Property
					</th>
					<th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800">
						Type
					</th>
					<th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800">
						Description
					</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/20">
				{params.map((row) => (
					<tr key={row.name}>
						<td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">
							{row.name}
							{row.required && (
								<span className="ml-2 text-red-500 text-xs">*</span>
							)}
						</td>
						<td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-mono text-xs">
							{row.type}
						</td>
						<td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
							{row.desc}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);
