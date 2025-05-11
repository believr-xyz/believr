import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is where you'll see posts from creators you follow.</p>
          <p className="mt-2 text-muted-foreground">Coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
