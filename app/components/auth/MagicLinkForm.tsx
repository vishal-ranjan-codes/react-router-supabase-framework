import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface MagicLinkFormProps {
  error?: string | null;
  success?: boolean;
  isLoading?: boolean;
}

export function MagicLinkForm({ error, success, isLoading }: MagicLinkFormProps) {
  if (success) {
    return (
      <div className="rounded-md theme-bg-success p-4 text-sm theme-text-success text-center">
        Check your email for the magic link!
      </div>
    );
  }

  return (
    <Form method="POST" className="space-y-4">
      <input type="hidden" name="method" value="magic-link" />

      <div className="space-y-2">
        <Label htmlFor="magic-email">Email Address</Label>
        <Input
          id="magic-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending link..." : "Send Magic Link"}
      </Button>
    </Form>
  );
}
