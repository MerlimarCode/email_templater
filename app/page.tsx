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
import { useState, FormEvent } from "react";

export default function Home() {
  const templateVariables = [
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

  const [text, setText] = useState("");
  const [output, setOutput] = useState<any>();
  const [outputSet, setOutputSet] = useState(false);
  const [loading, setLoading] = useState(false);

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

      const data = await response.json();
      setOutput(JSON.parse(data.responseContent));
      setOutputSet(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-5">
      <div className="pb-5">
        <Card className="">
          <CardContent>temp</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-2.5rem)]">
        <Card className="flex flex-col h-3/4">
          <CardHeader className="flex-none">
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-2">
            <div className="">
              <Textarea
                placeholder="Put emails here"
                value={text}
                className="min-h-80"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            {loading && <div className="mt-4">Loading...</div>}
          </CardContent>
          <CardFooter className="flex-none">
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-3/4 overflow-auto">
          <CardHeader className="flex-none">
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="flex overflow-scroll">
            <div className="">
              {outputSet && (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(output, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
