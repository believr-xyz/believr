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
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/hooks/use-create-post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required").max(2000, "Content is too long"),
  category: z.enum(["content", "art", "music", "tech", "writing"]),
  amount: z.string().min(1, "Target amount is required"),
  revenueShare: z.string().min(1, "Revenue share percentage is required"),
  totalSupply: z.string().min(1, "Total supply is required"),
  benefits: z.string().min(1, "Benefits are required"),
  endDate: z.string().min(1, "End date is required"),
  media: z.any().optional(),
  mediaType: z.enum(["image", "video", "audio"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateForm() {
  const router = useRouter();
  const { createPost, isLoading } = useCreatePost();
  const [preview, setPreview] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "content",
      amount: "",
      revenueShare: "",
      totalSupply: "",
      benefits: "",
      endDate: "",
    },
  });

  // Handle media file change
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media", file);

      // Show preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        form.setValue("mediaType", "image");
      } else if (file.type.startsWith("video/")) {
        form.setValue("mediaType", "video");
      } else if (file.type.startsWith("audio/")) {
        form.setValue("mediaType", "audio");
      }
    }
  };

  // Submit form data
  const onSubmit = async (values: FormValues) => {
    try {
      // Call our createPost hook with the form values
      const result = await createPost({
        title: values.title,
        content: values.content,
        imageFile: values.media,
        // Investment post is always collectible
        collectible: true,
        collectSettings: {
          price: values.amount,
          currency: "GHO",
          supply: values.totalSupply,
        },
        // Investment metadata
        investmentMetadata: {
          category: values.category,
          revenueShare: values.revenueShare,
          benefits: values.benefits,
          endDate: values.endDate,
          mediaType: values.mediaType,
        },
      });

      if (result) {
        router.push(`/posts/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
                    <Input placeholder="Name your investment project" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project and what you're offering"
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount (GHO)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Supply</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="revenueShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue Share (%)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits for Believers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the benefits believers will receive (e.g., early access, exclusive content, Lens Group access)"
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="media"
              render={() => (
                <FormItem>
                  <FormLabel>Media (Optional)</FormLabel>
                  <FormControl>
                    <div className="rounded-md border p-2">
                      <Input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={handleMediaChange}
                        className="cursor-pointer"
                      />
                      {preview && (
                        <div className="mt-2">
                          <img src={preview} alt="Preview" className="max-h-40 rounded-md" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image, video, or audio file to showcase your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your investment post...
                </>
              ) : (
                "Create Investment Post"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
