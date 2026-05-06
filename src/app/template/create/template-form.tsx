"use client";
import { NewTemplate, Template, TemplateInsertSchema } from "@/db/schema";
import { apiFetch, ApiFetchError } from "@/lib/api";
import { ApiResponse } from "@/types/api-response.type";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/reui/phone-input";
import { Loader2 } from "lucide-react";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getQueryClient } from "@/providers/get-react-cilents";
import { Turnstile } from "@marsidev/react-turnstile";
export const CommuneLabels: Record<string, string> = {
  sangkat_tuek_lak_1: "សង្កាត់ទឹកល្អក់ទី១",
  sangkat_tuek_lak_2: "សង្កាត់ទឹកល្អក់ទី២",
  sangkat_tuek_lak_3: "សង្កាត់ទឹកល្អក់ទី៣",
  sangkat_boeung_keng_kang_1: "សង្កាត់បឹងកេងកងទី១",
  sangkat_boeung_keng_kang_2: "សង្កាត់បឹងកេងកងទី២",
  sangkat_boeung_keng_kang_3: "សង្កាត់បឹងកេងកងទី៣",
  sangkat_psar_doeum_thkov: "សង្កាត់ផ្សារដើមថ្កូវ",
  sangkat_tonle_bassac: "សង្កាត់ទន្លេបាសាក់",
  sangkat_olympic: "សង្កាត់អូឡាំពិក",
  sangkat_phsar_thmei_1: "សង្កាត់ផ្សារថ្មីទី១",
};

export default function CreateTemplate() {
  const navigate = useRouter();
  const queryClient = getQueryClient();
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  const createTemplate = async (values: NewTemplate) => {
    const response = await apiFetch<ApiResponse<Template>>("/api/template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.error || !response.value) {
      const Message = response.error.message ?? "submit data failed";
      toast.error(Message);
      throw new Error(Message);
    }

    return response.value;
  };

  const form = useForm({
    resolver: zodResolver(TemplateInsertSchema),
    defaultValues: {
      commune: "សង្កាត់ទឹកល្អក់ទី១",
      name: "",
      percentage: 0,
      phoneNumber: "",
    },
  });

  const createTemplateMutate = useMutation({
    mutationFn: (values: NewTemplate) => createTemplate(values),
    onSuccess: (result) => {
      if (result.success) {
        form.reset();
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["template"],
        });

        navigate.push("/template");
      }
    },
    onError: (error) => {
      console.error("An error occurred during create", error);
      const errorMessage =
        error instanceof ApiFetchError
          ? "Teacher data not found"
          : "failed_to_export_report";
      toast.error(errorMessage);
    },
  });

  const { mutate } = createTemplateMutate;

  const onsubmit = useCallback(
    async (values: NewTemplate) => {
      if (!turnstileToken) {
        toast.error("Please complete the captcha");
        return;
      }

      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      if (!verifyRes.ok) {
        toast.error("Captcha verification failed. Please try again.");
        setTurnstileToken("");
        setTurnstileKey((k) => k + 1);
        return;
      }

      mutate(values);
    },
    [mutate, turnstileToken],
  );

  return (
    <div className="mx-auto w-full max-w-xs p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}>
          <FieldGroup>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your PhoneNumber</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      value={field.value ?? undefined}
                      onChange={(value) => field.onChange(value ?? "")}
                      countries={["KH", "VN"]}
                      defaultCountry="KH"
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commune"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Your Commune</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select commune" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CommuneLabels).map(
                          ([commune, label]) => (
                            <SelectItem value={label} key={commune}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="creditCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visa Card</FormLabel>
                  <FormControl>
                    <CardInputGroup>
                      <CardNumberInput
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      />
                      <CardExpiryInput />
                      <CardCvcInput />
                    </CardInputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage</FormLabel>
                  <FormControl>
                    <NumberField
                      value={field.value ?? 0}
                      onValueChange={field.onChange}
                    >
                      <NumberFieldGroup>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldGroup>
                    </NumberField>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Turnstile
              key={turnstileKey}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token: string) => setTurnstileToken(token)}
            />

            <Button
              type="submit"
              size="lg"
              disabled={createTemplateMutate.isPending}
            >
              {createTemplateMutate.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                ""
              )}

              {createTemplateMutate.isPending ? `saving...` : `save`}
              {createTemplateMutate.isSuccess}
            </Button>
          </FieldGroup>
        </form>
      </Form>
    </div>
  );
}
