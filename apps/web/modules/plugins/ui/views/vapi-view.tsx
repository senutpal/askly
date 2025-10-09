"use client";

import { Globe2, Phone, PhoneCall, Workflow } from "lucide-react";
import { type Feature, PluginCard } from "../components/plugins-card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@workspace/ui/components/dialog";
const vapiFeatures: Feature[] = [
  {
    icon: Globe2,
    label: "Web Voice Calls",
    description: "Voice chat directly in your app",
  },
  {
    icon: Phone,
    label: "Phone Numbers",
    description: "Get dedicated buisness lines",
  },
  {
    icon: PhoneCall,
    label: "Outbound Calls",
    description: "Automated customer outreach",
  },
  {
    icon: Workflow,
    label: "Workflows",
    description: "Custom conversation flows",
  },
];

const formSchema = z.object({
  publicApiKey: z.string().min(1, { message: "Public API Key is required" }),
  privateApiKey: z.string().min(1, { message: "Private API Key is required" }),
});

const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      });
    } catch {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

};

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  });
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <div className="flex flex-col  min-h-screen bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-semibold">Vapi Plugin</h1>
          <p>Connect Vapi to enable AI voice calls and phone</p>
        </div>
        <div className="mt-8">
          {vapiPlugin ? (
            <p>Connected</p>
          ) : (
            <PluginCard
              onSubmit={() => {}}
              isDisabled={vapiPlugin === undefined}
              features={vapiFeatures}
              serviceName="Vapi"
              serviceImage="/vapi.jpg"
            />
          )}
        </div>
      </div>
    </div>
  );
};
