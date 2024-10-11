"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, FormEvent, use } from "react";
import { stringify } from "querystring";

export default function Home() {
  const testcases: string[] = [
    `
testcase

    `,
  ];
  const templateVariables: string[] = [
    "company_name",
    "support_email",
    "customer_email",
    "full_name",
    "shipping_address",
    "order_number",
    "products",
    "items",
    "quantity",
    "product_name",
    "tracking_number",
    "shipping_carrier",
    "ordered_at",
    "address",
  ];
  const expectedOutput: string[] = [];

  const [text, setText] = useState("");
  const [output, setOutput] = useState<any>();
  const [outputSet, setOutputSet] = useState(false);
  const [loading, setLoading] = useState(false);

  const PrettyPrintJson = ({ data }: any) => (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails: text, template: templateVariables }),
      });
      console.log("Submit button clicked");

      const data = await response.json();
      setOutput(JSON.parse(data.responseContent));
      setOutputSet(true);
      setLoading(false);

      console.log(JSON.parse(data.responseContent));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-5 flex flex-row">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex items-center min-h-48 justify-center">
            <Textarea
              placeholder="Put emails here"
              value={text}
              className="flex min-h-48 items-center justify-center"
              onChange={(e) => setText(e.target.value)}
            ></Textarea>
          </div>
          {/* <div className=" bg-yellow-200">
            {outputSet && (
              <div className=" bg-cyan-200">
                <Label>Output</Label>
                <pre>{JSON.stringify(output, null, 2)}</pre>
              </div>
            )}
          </div> */}
          {loading && <div className="self-center">Loading...</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit{outputSet}</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardContent>ads</CardContent>
      </Card>
    </div>
  );
}
