# Auth methods are pluggable — read this before deleting anything

The sign-in / sign-up surface is built so that **any** method can be switched on per
project. That means parts of it are unreferenced by default, and unreferenced is not the
same as dead.

> Rule for humans and agents alike: do not remove a method's flag, provider helper, form
> component or route because "nothing uses it". Either wire it up behind its flag or document
> why it stays. This is the reason the starter exists.

## The one switchboard

`app/lib/auth/config.ts` is the only file a project should edit to change the auth surface.

```ts
export const authConfig: AuthConfig = {
  methods: {
    emailPassword: true, // primary
    emailOtp: true, // secondary
    magicLink: false, // off by default, fully implemented
    google: false, // off by default, fully implemented
  },
  defaultMethod: "email-password",
  passwordMinLength: 8,
  passwordReset: true,
};
```

| Method key in the form | Flag                    | Panel / control            | Provider helper (`app/lib/auth/providers.ts`)                                         | Supabase side                                                                                                                                                                          |
| ---------------------- | ----------------------- | -------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email-password`       | `methods.emailPassword` | `PasswordForm`             | `signInWithPassword`, `signUpWithPassword`, `resetPasswordForEmail`, `updatePassword` | Email provider enabled; "Restore password" template                                                                                                                                    |
| `email-otp`            | `methods.emailOtp`      | `EmailOtpForm`             | `sendEmailOtp`, `verifyEmailOtp`                                                      | Email OTP enabled; OTP email template                                                                                                                                                  |
| `magic-link`           | `methods.magicLink`     | `MagicLinkForm`            | `signInWithMagicLink`                                                                 | Magic link enabled; `Confirm email` turned off if you want instant sign-in                                                                                                             |
| `google`               | `methods.google`        | `GoogleButton` (+ divider) | `signInWithGoogle`                                                                    | Google OAuth configured, redirect URL `<origin>/auth/callback` added to Supabase's allowed list, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in the Cloudflare dashboard + `.dev.vars` |

Flags are enforced in **three** places, which is the point:

1. `getEnabledFormMethods()` / `isMethodEnabled()` decide what renders.
2. `getDefaultMethod()` falls back to the first enabled method, so a `defaultMethod` that is
   switched off cannot strand the page on a selector with no panel.
3. The `action()` in `app/routes/sign-in.tsx` and `app/routes/sign-up.tsx` rejects a disabled
   method before it touches Supabase — hiding a button is not a security boundary.

## Every panel exists and is reachable

`app/routes/auth-surface.test.tsx` iterates `getEnabledFormMethods()`, clicks each label from
`getMethodLabel()` and asserts the panel mounts, so a component can no longer rot into
"unreferenced". `app/lib/auth/config.test.ts` pins the method→flag table, the defaults, and
both fallbacks. `app/routes/sign-in.test.ts` / `sign-up.test.ts` assert the disabled-method
rejection and each provider's exact Supabase call shape.

If you add a fifth method, these four files are the checklist it will fail until updated.

## All flags off is a supported state

With every method disabled, the page renders an explanatory message instead of a form:

```
No authentication methods are enabled. Turn some on in app/lib/auth/config.ts.
```

`sign-in.tsx` / `sign-up.tsx` gate the panel on `methods.includes(activeMethod)` —
`getDefaultMethod()` still names a method so `useState` has a value, but rendering its panel
would show a form the action always rejects. The empty state is covered by
"refuses to render a panel for a disabled method" in `auth-surface.test.tsx`.

## Flow map

```
/sign-in, /sign-up            panels + method selector; POST to their own action
/auth/verify-otp?email=…      the OTP "enter the code" step at a real URL, so a refresh keeps you there
/auth/reset-password          lands here from the reset email's `redirectTo`
/auth/callback                exchanges the OAuth / magic-link / confirmation code for cookies
/sign-out                     POST-only (a GET link would let a third party log you out)
/dashboard, /admin            guarded by requireAuth / requireAdmin from app/middleware/chains.ts
```

`throw redirect(...)` is used inside actions rather than returning a redirect, because
middleware (`app/middleware/supabase.ts`) writes refreshed session cookies on the way out —
returning early would drop them.

## Adding a method

1. `AuthMethod` union + the flag in `AuthConfig.methods` + `METHOD_ORDER`.
2. `METHOD_FLAGS` and `METHOD_LABELS` entries — the compiler forces both.
3. A provider helper in `app/lib/auth/providers.ts` that takes the `SupabaseClient` from the
   route context and returns `{ error? } | { redirectTo? }`.
4. A panel component under `app/components/auth/`, or a button if it is an OAuth redirect.
5. A `case` in both actions, after the existing `isMethodEnabled(method)` guard.
6. Update `app/lib/auth/config.test.ts`'s method→flag table and
   `app/routes/auth-surface.test.tsx`'s `PANEL_SUBMIT` table, then
   `npm run check && npm run typecheck && npm test && npm run build`.
