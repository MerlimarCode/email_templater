"use client";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, FormEvent, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Variable } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const variables = [
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

const testEmail = `Subject: Your annual GourmetBox subscription is expiring soon
Dear valued member, Miguel Rodríguez,
We hope this email finds you well and that you've been enjoying your culinary journey with GourmetBox. We're writing to remind you that your annual subscription (Member ID: GB98765) is set to expire on July 31, 2024.
Subscription Details:

Plan: Premium Culinary Explorer
Current Expiration Date: July 31, 2024
Renewal Price: $479.99/year (10% discount applied)

To ensure uninterrupted service and continue receiving our carefully curated monthly boxes of gourmet ingredients and recipes from around the world, your subscription will be automatically renewed on August 1, 2024, using the payment method we have on file.
Here's a preview of what's coming in our next three boxes:

August: Flavors of Thailand
September: Italian Truffle Season
October: Autumn in New England

If you wish to make any changes to your subscription or update your payment information, please log in to your account at www.gourmetbox.com/account or contact our member services team at members@gourmetbox.com before July 25, 2024.
As a token of our appreciation for your continued loyalty, we're pleased to offer you a complimentary Artisanal Olive Oil Set with your renewal. This set includes three 250ml bottles of premium extra virgin olive oils from Spain, Italy, and Greece.
We value your membership and hope you'll continue your culinary adventures with us. If you have any questions or feedback, please don't hesitate to reach out.
Happy cooking!
Warmest regards,
Sophia Lee
Membership Services Manager
GourmetBox Inc.
1234 Gourmet Way, Suite 500
San Francisco, CA 94111
Tel: (415) 555-YUMM (9866)
www.gourmetbox.com`;

export default function Home() {
  const [text, setText] = useState("");
  const [updatedText, setNewText] = useState("");
  const [templateVariables, setTemplateVariables] =
    useState<string[]>(variables);
  const [finalVariables, setVariables] = useState<string[]>();
  const [newVariable, setNewVariable] = useState("");
  const [patterns, setPatterns] = useState<any>();
  const [outputSet, setOutputSet] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVariables(templateVariables);
  }, [templateVariables]);

  // Always inputed as json
  const processMappings2 = (mappings: any) => {
    let newText = text;
    mappings.forEach((pattern: any) => {
      if (
        !finalVariables?.some(
          (variable) => "{{" + variable + "}}" === pattern.variable
        )
      ) {
      } else {
        newText = newText.replaceAll(pattern.text, pattern.variable);
      }
    });
    return newText;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(updatedText);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (variable: string) => {
    const newVariables = templateVariables.filter((v) => v !== variable);
    setTemplateVariables(newVariables);
  };

  const handleAddVariable = async (variable: string) => {
    const newVariables = templateVariables.concat(variable.trim());
    setTemplateVariables(newVariables);
    setNewVariable("");
  };
  const handleSubmit = async () => {
    try {
      setVariables(templateVariables);

      setLoading(true);
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails: text, template: templateVariables }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.responseContent);

      if (parsedData && parsedData.mappings) {
        const processedText = processMappings2(parsedData.mappings);
        setNewText(processedText);
        setOutputSet(true);
      } else {
        console.error("Invalid response format:", parsedData);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-5">
      <div className="grid grid-cols-2 gap-4 h-3/4">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex-none">
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pt-2">
            <div className="">
              <Textarea
                placeholder="Put emails here"
                value={text}
                className="min-h-[calc(50vh)]"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            {loading && <div className="mt-4">Loading...</div>}
          </CardContent>
          <CardFooter className="flex-none">
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full overflow-auto">
          <CardHeader className="flex-none">
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-grow overflow-scroll">
            <div className="min-h-[calc(50vh)] max-h-[calc(50vh)]">
              {outputSet && <pre>{updatedText}</pre>}
            </div>
          </CardContent>
          <CardFooter className="flex-none">
            <Button onClick={handleCopy}>Copy</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="py-2">
        <Card className="">
          <CardHeader>
            <CardTitle>Template Variables</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pb-4">
            <div className="">
              {templateVariables.map((variable) => (
                <Badge
                  variant="outline"
                  key={variable}
                  className="m-2 h-10 w-fit relative group "
                >
                  {variable}
                  <Button
                    className="invisible group-hover:visible absolute top-1/2 right-1 h-6 transform -translate-y-1/2 p-0 bg-gray-200 text-red-500 hover:text-red-700 w-6"
                    onClick={() => handleRemove(variable)}
                  >
                    X
                  </Button>
                </Badge>
              ))}
              <div className="m-2">
                <Input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  className="p-2"
                ></Input>
                <Button
                  className="my-2"
                  onClick={() => handleAddVariable(newVariable)}
                >
                  Add Variable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
