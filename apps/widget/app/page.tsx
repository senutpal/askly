"use client";

import { use } from "react";
import { WidgetView } from "@/features/widget/components/views/widget-view";

interface Props {
	searchParams: Promise<{ organizationId: string }>;
}

const Page = ({ searchParams }: Props) => {
	const { organizationId } = use(searchParams);
	return <WidgetView organizationId={organizationId} />;
};

export default Page;
