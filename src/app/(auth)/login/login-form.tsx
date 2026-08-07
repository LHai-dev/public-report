"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserLoginSchema, Login, User } from "@/db/schema";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/types/api-response.type";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";

const loginUser = async (data: Login) => {
  const result = await apiFetch<ApiResponse<User>>("/api/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.error || !result.value.success) {
    throw new Error(result.error?.message);
  }

  return result.value;
};

export default function LoginFormAuth() {
  const router = useRouter();

  const form = useForm<Login>({
    resolver: standardSchemaResolver(createUserLoginSchema),
    defaultValues: {
      password: "",
      email: "",
      token: "",
    },
  });

  const verifyUserLogin = useMutation({
    mutationFn: (values: Login) => loginUser(values),
    onSuccess: (result) => {
      const user = result.data;
      if (user) {
        form.reset();
        toast.success("Logged in successfully");

        return router.push("/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.message);
      if (error.message === "") {
        window.location.reload();
      }
    },
  });

  const { mutate } = verifyUserLogin;

  const onSubmit = (values: Login) => {
    if (!values.token) {
      toast.error("Please complete the captcha");
      return;
    }
    mutate(values);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h3 className="text-balance text-center font-semibold text-foreground text-lg dark:text-foreground">
            Welcome Back
          </h3>
          <p className="text-pretty text-center text-muted-foreground text-sm dark:text-muted-foreground">
            Enter your credentials to access your account.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
              method="post"
            >
              {/* <div>
                <Label
                  className="font-medium text-foreground text-sm dark:text-foreground"
                  htmlFor="email-login-03"
                >
                  Email
                </Label>
                <Input
                  autoComplete="email"
                  className="mt-2"
                  id="email-login-03"
                  name="email-login-03"
                  placeholder="ephraim@blocks.so"
                  type="email"
                />
              </div> */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground text-sm dark:text-foreground">
                      email
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        className="mt-2"
                        id="email-login-03"
                        placeholder="ephraim@blocks.so"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <div>
                <Label
                  className="font-medium text-foreground text-sm dark:text-foreground"
                  htmlFor="password-login-03"
                >
                  Password
                </Label>
                <Input
                  autoComplete="password"
                  className="mt-2"
                  id="password-login-03"
                  name="password-login-03"
                  placeholder="**************"
                  type="password"
                />
              </div> */}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground text-sm dark:text-foreground">
                      password
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="password"
                        className="mt-2"
                        id="password-login-03"
                        placeholder="**************"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ផ្ទៀងផ្ទាត់ថាអ្នកមិនមែនជាមនុស្សយន្តទេ</FormLabel>
                    <FormControl>
                      <Turnstile
                        siteKey="1x00000000000000000000AA"
                        onSuccess={(token) => field.onChange(token)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="mt-4 w-full py-2 font-medium" type="submit">
                Sign in
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-pretty text-muted-foreground text-sm dark:text-muted-foreground">
            Forgot your password?{" "}
            <a
              className="font-medium text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/90"
              href="#"
            >
              Reset password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
