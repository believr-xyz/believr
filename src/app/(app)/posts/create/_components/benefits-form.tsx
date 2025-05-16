"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

// Temporary type definition
interface Benefit {
  type: string;
  title: string;
  description: string;
  percentage?: number;
}

interface BenefitsFormProps {
  initialBenefits?: Benefit[];
  onChange?: (benefits: Benefit[]) => void;
}

interface BenefitFormValues {
  benefits: Benefit[];
}

export function BenefitsForm({ initialBenefits = [], onChange }: BenefitsFormProps) {
  const form = useForm<BenefitFormValues>({
    defaultValues: {
      benefits: initialBenefits.length
        ? initialBenefits
        : [
            {
              type: "access",
              title: "",
              description: "",
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "benefits",
  });

  const onSubmit = (values: BenefitFormValues) => {
    if (onChange) {
      onChange(values.benefits);
    }
  };

  // Any time form changes, notify parent if onChange is provided
  const handleFormChange = () => {
    const values = form.getValues();
    if (onChange) {
      onChange(values.benefits);
    }
  };

  return (
    <Card className="border-[#00A8FF]/20 bg-gradient-to-br from-[#00A8FF]/5 to-[#00A8FF]/10">
      <CardHeader>
        <CardTitle className="text-lg">Benefits for Early Believers</CardTitle>
        <CardDescription>
          Define what early believers get for supporting your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onChange={handleFormChange}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`benefit-${index}-type`} className="font-medium text-base">
                    Benefit {index + 1}
                  </Label>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <TrashIcon className="size-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`benefits.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select benefit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="access">Access</SelectItem>
                          <SelectItem value="revenue">Revenue Share</SelectItem>
                          <SelectItem value="recognition">Recognition</SelectItem>
                          <SelectItem value="exclusive">Exclusive Content</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`benefits.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Early Access to Beta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`benefits.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Get early access to our beta before public release"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch(`benefits.${index}.type`) === "revenue" && (
                  <FormField
                    control={form.control}
                    name={`benefits.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue Share (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() =>
                append({
                  type: "access",
                  title: "",
                  description: "",
                })
              }
            >
              <PlusIcon className="mr-2 size-4" />
              Add Another Benefit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
