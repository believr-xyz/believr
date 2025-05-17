"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required").max(2000, "Content is too long"),
  enableCollectible: z.boolean(),
  price: z.string().optional(),
  currency: z.string().optional(),
  supply: z.string().optional(),
  image: z.any().optional(),
});

// Create a TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

export function CreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      enableCollectible: false,
      price: "0",
      currency: "GHO",
      supply: "100",
    },
  });

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set image in form
      form.setValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form data
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would be replaced with actual Lens Protocol publishing logic
      console.log("Form submitted:", values);

      toast.success("Post created successfully!");
      router.push("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts, ideas or updates..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="mb-2 flex items-center gap-2">
                <ImageIcon className="size-4 text-muted-foreground" />
                <FormLabel className="m-0">Add Image</FormLabel>
              </div>

              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />

              {imagePreview && (
                <div className="mt-4 overflow-hidden rounded-lg">
                  <img src={imagePreview} alt="Preview" className="max-h-60 w-full object-cover" />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="enableCollectible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Make Collectible</FormLabel>
                    <FormDescription>
                      Allow others to collect this post to become believers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("enableCollectible") && (
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="5" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GHO">GHO</SelectItem>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Supply</FormLabel>
                      <FormControl>
                        <Input placeholder="100" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
              >
                Publish Post
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
