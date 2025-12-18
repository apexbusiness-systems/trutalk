import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleNavigateToMatch = useCallback(() => {
    navigate("/match");
  }, [navigate]);

  return (
    <div className="min-h-screen p-4">
      <header className="container mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TRU Talk
        </h1>
        <Button variant="outline" onClick={handleNavigateToMatch}>
          Back to Match
        </Button>
      </header>

      <main className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
