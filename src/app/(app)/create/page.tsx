"use client";

import { CreateForm } from "./_components/create-form";

export default function CreatePage() {
  return (
    <div className="container mx-auto max-w-2xl py-6">
      <h1 className="mb-2 font-bold text-3xl">Create a Tokenized Post</h1>
      <p className="mb-6 text-muted-foreground">
        Launch a new post for your believers to support and collect
      </p>

      <CreateForm />
    </div>
  );
}
