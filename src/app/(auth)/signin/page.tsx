import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <div className="flex gap-2 mb-4">
            <Image src="/DMCILogo.png" width={128} height={32} alt="DMCI Logo" />
          </div>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your username below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet className="">
            <FieldGroup>

              <Field>
                <div className="flex justify-between">
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Button variant="link" className="font-normal h-auto p-0" >
                    Forgot your password?
                  </Button>
                </div>
                <Input id="username" type="text" placeholder="email or username" />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" placeholder="********" />
              </Field>

              <Field>
                <Button type="submit">Login</Button>
              </Field>

            </FieldGroup>
          </FieldSet>

          <div className="flex justify-center mt-4 gap-1">
            <Label className="font-normal text-muted-foreground">Don't have an account?</Label>
            <Button variant="link" className="font-normal h-auto p-0">
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}