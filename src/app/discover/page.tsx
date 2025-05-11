import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiscoverPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Discover Creators</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Discover new creators to follow and support.</p>
          <p className="mt-2 text-muted-foreground">Coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
