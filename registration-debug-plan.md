# Registration Debugging Implementation Plan

## Overview

This plan covers debugging the three main error categories surfaced during profile registration:
1. **Network Errors** — fetch fails before the server responds
2. **Fetch/HTTP Errors** — server responds with a non-2xx status
3. **Registration Failed Errors** — multi-step flow fails partway through (user created but startup/skills not saved)

The registration flow has two paths — **Create** (`CreateProfile.tsx`) and **Join** (`JoinTeam.tsx`) — each involving multiple sequential API calls. A failure at any step can leave the user in a partial state.

---

## Registration Flow Map

### Create Path (`CreateProfile.tsx`)
```
Step 1: registerUser()       → POST /api/auth/register
Step 2: login()              → POST /api/auth/login
Step 3: createStartup()      → POST /api/startups
Step 4: addSkills()          → POST /api/users/{id}/skills
Step 5: updateUserProfile()  → PATCH /api/users/{id}
Step 6: getUser()            → GET  /api/users/{id}
```

### Join Path (`JoinTeam.tsx`)
```
Step 1: registerUser()       → POST /api/auth/register
Step 2: login()              → POST /api/auth/login
Step 3: searchCompanies()    → GET  /api/startups
Step 4: addMember()          → POST /api/startups/{id}/members
```

---

## Error Category 1: Network Errors

### What it looks like
- `TypeError: Failed to fetch`
- `TypeError: NetworkError when attempting to fetch resource`
- `net::ERR_CONNECTION_REFUSED`
- No response received; the browser never reached the server

### Root Causes to Check
| # | Cause | Where to Look |
|---|-------|---------------|
| 1 | Backend server not running | Terminal — is `mvn spring-boot:run` active on port 8080? |
| 2 | Wrong base URL in API layer | `frontend/src/tsx/api/index.ts` — check `BASE_URL` constant |
| 3 | CORS preflight blocked | Browser DevTools → Network tab → look for failed OPTIONS request |
| 4 | HTTPS/HTTP mismatch | GitHub Pages serves HTTPS; backend must also be HTTPS or use a proxy |
| 5 | Browser offline / VPN | Check browser network status |

### Debugging Steps

**Step 1 — Confirm the backend is reachable**
```bash
curl http://localhost:8080/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test"}'
```
If this fails → backend is down or on a different port.

**Step 2 — Check `BASE_URL` in `frontend/src/tsx/api/index.ts`**

The URL used for all fetch calls must match the running backend address. When deployed to GitHub Pages, `localhost` will not work — there must be an environment variable or proxy in place.

**Step 3 — Check CORS configuration**

The backend must allow the GitHub Pages origin. Confirm the Spring Security / `WebMvcConfigurer` CORS setup includes:
- Allowed origin: `https://<github-username>.github.io`
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Allowed headers: `Authorization, Content-Type`

**Step 4 — Improve frontend error messaging for network failures**

In `frontend/src/tsx/api/index.ts`, all fetch calls should distinguish a network failure from a server error:

```typescript
// Current pattern (improve this):
const res = await fetch(url, options);
if (!res.ok) throw new Error(await res.text());

// Improved pattern:
let res: Response;
try {
  res = await fetch(url, options);
} catch (e) {
  throw new Error("Network error: unable to reach the server. Please check your connection.");
}
if (!res.ok) throw new Error(await res.text());
```

Apply this wrapper to: `registerUser`, `login`, `createStartup`, `addSkills`, `updateUserProfile`, `addMember`, `searchCompanies`.

---

## Error Category 2: Fetch / HTTP Errors

### What it looks like
- `Error: Username already taken`
- `Error: Email already registered`
- `Error: 400 Bad Request` / `Error: 401 Unauthorized` / `Error: 500 Internal Server Error`
- Response received but `res.ok` is false

### Root Causes to Check
| # | Cause | HTTP Status | Where Generated |
|---|-------|-------------|-----------------|
| 1 | Username already exists | 500 (RuntimeException) | `UserService.register()` |
| 2 | Email already registered | 500 (RuntimeException) | `UserService.register()` |
| 3 | Invalid input (blank field) | 400 | `@Valid RegisterRequest` |
| 4 | Invalid email format | 400 | `@Email` on `RegisterRequest` |
| 5 | JWT missing on protected call | 401 | Spring Security filter |
| 6 | JWT expired | 401 | `JWTService.validateToken()` |
| 7 | Startup creation fails | 500 | `StartupController` |
| 8 | DB connection failure | 500 | JPA / PostgreSQL |

### Debugging Steps

**Step 1 — Fix backend error responses (return proper HTTP status codes)**

`UserService` currently throws `RuntimeException` for username/email conflicts. Spring Boot will return 500 for uncaught `RuntimeException`. These should return 409 Conflict:

In `UserService.java`:
```java
// Replace:
throw new RuntimeException("Username already taken");
// With a custom exception mapped to 409:
throw new ConflictException("Username already taken");
```

Create `ConflictException.java`:
```java
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
```

Or add a `@ControllerAdvice` global exception handler:
```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<String> handleRuntime(RuntimeException e) {
    if (e.getMessage().contains("already")) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
}
```

**Step 2 — Surface meaningful error text in the frontend**

In `frontend/src/tsx/api/index.ts`, the `registerUser` function already returns `res.text()` as the error. Confirm the backend actually returns a human-readable body (not a stack trace). With the `@ControllerAdvice` above, the body will be a plain string that can be shown directly.

**Step 3 — Handle 401 on protected calls after login**

After `login()` succeeds, the JWT is stored and used for subsequent calls. If the token is missing:
- Check that `login()` stores the token before `createStartup()` is called.
- Check that `createStartup()`, `addSkills()`, and `updateUserProfile()` all read the token from localStorage and include it in the `Authorization: Bearer <token>` header.

**Step 4 — Validate inputs client-side before submitting**

Add frontend validation in `CreateProfile.tsx` and `JoinTeam.tsx` before making any API call:
- Username: non-empty, no spaces, min 3 characters
- Email: matches basic email regex
- Password: non-empty, min 8 characters
- Company name (Create path): non-empty

This prevents avoidable 400 errors and gives faster user feedback.

---

## Error Category 3: Registration Failed (Partial State)

### What it looks like
- User account is created but they can't log in
- User logs in but has no startup associated
- Skills are not saved after registration
- Profile name / role is missing

### Root Causes to Check
| # | Cause | Step That Fails |
|---|-------|-----------------|
| 1 | `login()` fails after `registerUser()` succeeds | Step 2 |
| 2 | JWT not stored before `createStartup()` is called | Step 3 |
| 3 | `createStartup()` fails silently | Step 3 |
| 4 | `addSkills()` called with empty array or malformed payload | Step 4 |
| 5 | `updateUserProfile()` called with `undefined` userId | Step 5 |
| 6 | Any step throws but error is swallowed | Any step |

### Debugging Steps

**Step 1 — Add step-level error messages in `CreateProfile.tsx`**

Each step should set a specific error message so the user (and developer) knows exactly where the flow broke:

```typescript
// Step 1
try {
  registered = await registerUser({ username, email, password });
} catch (e) {
  setError("Account creation failed: " + (e as Error).message);
  return;
}

// Step 2
const loginResult = await login(username, password);
if (!loginResult.success) {
  setError("Login after registration failed: " + loginResult.error);
  return;
}

// Step 3
try {
  startup = await createStartup({ name: companyName, ownerId: registered.id });
} catch (e) {
  setError("Startup creation failed: " + (e as Error).message);
  return;
}

// Step 4
try {
  await addSkills(registered.id, skills);
} catch (e) {
  setError("Skills could not be saved: " + (e as Error).message);
  return;
}

// Step 5
try {
  await updateUserProfile(registered.id, { name: profileName, preferredRole: profileRole });
} catch (e) {
  setError("Profile update failed: " + (e as Error).message);
  return;
}
```

**Step 2 — Confirm JWT is stored before protected calls**

In `AuthContext.tsx`, the `login()` function stores the token. Verify that `createStartup()` is only called after `login()` resolves and the token is in localStorage. If the calls are not awaited in the correct order, the token may not be available yet.

**Step 3 — Handle partial failure recovery**

If Step 3 (startup creation) or later fails, the user account already exists. On retry they will hit "Username already taken." Options:
- **Option A (simple):** Show an error message that says "Your account was created but setup did not complete. Please sign in and complete your profile."
- **Option B (robust):** Detect on login whether `startupId` is missing and redirect to a "complete your profile" step.

Implement Option A first as it requires no backend changes.

**Step 4 — Fix `JoinTeam.tsx` generic error message**

`JoinTeam.tsx` currently shows a single generic error for all failures. Apply the same step-level error pattern as above.

**Step 5 — Log errors to the console during development**

All `catch` blocks should `console.error(e)` in addition to `setError(...)`. This makes it trivial to identify which step failed in the browser DevTools without needing source maps or backend logs.

---

## Backend: Global Exception Handler

Create `GlobalExceptionHandler.java` in the `controller` package to centralize all error responses:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(message);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException e) {
        String msg = e.getMessage();
        if (msg != null && (msg.contains("already taken") || msg.contains("already registered"))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("An unexpected error occurred.");
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UsernameNotFoundException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }
}
```

---

## Implementation Order

| Priority | Task | File(s) |
|----------|------|---------|
| 1 | Add `GlobalExceptionHandler` to backend | `controller/GlobalExceptionHandler.java` |
| 2 | Wrap fetch calls to distinguish network vs. HTTP errors | `api/index.ts` |
| 3 | Add step-level error messages in `CreateProfile.tsx` | `pages/Auth/CreateProfile.tsx` |
| 4 | Add step-level error messages in `JoinTeam.tsx` | `pages/Auth/JoinTeam.tsx` |
| 5 | Add client-side input validation before API calls | `CreateProfile.tsx`, `JoinTeam.tsx` |
| 6 | Handle partial registration failure with a recovery message | `CreateProfile.tsx`, `JoinTeam.tsx` |
| 7 | Verify CORS config covers GitHub Pages origin | Spring Security config |

---

## Testing Checklist

After implementing the fixes above, manually verify each scenario:

- [ ] Submit with all fields empty — expect client-side validation errors
- [ ] Submit with invalid email format — expect client-side error
- [ ] Register with an existing username — expect "Username already taken" (409)
- [ ] Register with an existing email — expect "Email already registered" (409)
- [ ] Stop the backend and attempt registration — expect "Network error: unable to reach the server"
- [ ] Complete full Create path successfully — confirm user, startup, skills all persisted
- [ ] Complete full Join path successfully — confirm user added to startup
- [ ] Kill the backend after Step 1 succeeds — confirm recovery message shown
- [ ] Sign in after a partial registration — confirm appropriate redirect or message
