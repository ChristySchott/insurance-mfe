# 🏗️ Insurance Quote System - Micro Frontend Architecture

A modern Proof of Concept (POC) demonstrating Micro Frontend architecture with Module Federation applied to an insurance quote system. The frontend is divided into independent applications that communicate through shared state, enabling independent development, deployment, and scalability.

🎯 **POC Objective**: Validate the feasibility of a Micro Frontend architecture for multi-product insurance quote systems, where different products can be developed and deployed independently while maintaining a unified user experience.

---

## ✨ Features

### 🎯 Micro Frontend Architecture

- Independent Host and Remote with autonomous deployment
- Module Federation for runtime code sharing
- Shared state via Zustand singleton
- End-to-end type-safety with TypeScript
- Lazy loading of remote components

### 📋 Multi-Step System

4 fixed steps for all products:

1. **Initial Data** - Insured's CPF and product selection
2. **Additional Data** - Product-specific forms (rendered by MFE)
3. **Offers** - Cards with plans, coverage, and pricing
4. **Summary** - Complete view before finalization

- Step navigation with validation
- Progressive wizard with visual indicator

### 🦺 Insurance Products

**Auto Insurance:**

- Specific fields: Driver's license, License plate, Vehicle brand/model, Tracker
- Specific validations: Mercosur plate, 11-digit driver's license
- Personalized offers based on vehicle and driver age
- Additional discount for vehicles with tracker

**Home Insurance:**

- Specific fields: Postal code, Property type, Total area, Alarm
- Specific validations: 8-digit Postal code, minimum/maximum area
- Personalized offers based on type and location
- Additional discount for properties with alarm

### 🔧 Technical Features

- Zod validation in both applications
- Loading states in all asynchronous operations
- Error boundaries for error handling
- Responsive design mobile-first
- Accessibility with ARIA labels
- Hot Module Replacement in development

---

## 💡 Micro Frontend with Module Federation

### What is Micro Frontend?

**Micro Frontend** is an architectural pattern where a frontend application is divided into **multiple smaller, independent applications**, each responsible for a specific functionality. Each micro frontend can be developed, tested, and deployed independently.

### What is Module Federation?

**Module Federation** is a Webpack 5 feature (now available in Vite) that allows **sharing code between JavaScript applications at runtime**. Unlike npm libraries, modules are loaded dynamically when needed.

### How it works in this project

#### 1. Application architecture

```
┌─────────────────────────────────────────────────────────────┐
│          Multicotador Host (Port 3000)                      │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Step 1  │─▶│  Step 2  │─▶│  Step 3  │─▶│  Step 4  │     │
│  │  (Local) │  │  (MFE)   │  │  (Local) │  │  (Local) │     │
│  └──────────┘  └────┬─────┘  └──────────┘  └──────────┘     │
│                     │                                       │
│  ┌──────────────────▼────────────────────────────────────┐  │
│  │         Zustand Store (Shared State)                  │  │
│  │  - currentStep                                        │  │
│  │  - cpf, productType                                   │  │
│  │  - step2Data, step2Valid                              │  │
│  │  - offers, selectedOffer                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Exposes: './store' → Zustand                               │
│  Consumes: 'AutoForm', 'ResidencialForm'                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Module Federation
                          │ (Runtime Import)
                          │
┌─────────────────────────▼─────────────────────────────────┐
│          Products MFE (Port 3001)                         │
│                                                           │
│  ┌──────────────────┐          ┌──────────────────┐       │
│  │   AutoForm       │          │ ResidencialForm  │       │
│  │                  │          │                  │       │
│  │ - useProductForm │          │ - useProductForm │       │
│  │ - Zod validation │          │ - Zod validation │       │
│  │ - Masks          │          │ - Masks          │       │
│  └────────┬─────────┘          └────────┬─────────┘       │
│           │                             │                 │
│           └─────────────┬───────────────┘                 │
│                         │                                 │
│              Imports Host Store                           │
│              Updates step2Data                            │
│                                                           │
│  Exposes: './AutoForm', './ResidencialForm'               │
│  Consumes: 'multicotadorHost/store'                       │
└───────────────────────────────────────────────────────────┘
```

#### 2. Communication via Zustand

```typescript
// 1. Host exposes the store via Module Federation
// apps/multicotador-host/vite.config.ts
federation({
  name: "multicotador_host",
  exposes: {
    "./store": "./src/store/cotacaoStore.ts",
  },
  shared: ["react", "react-dom", "zustand"],
});

// 2. MFE imports the store as a remote module
// apps/products-mfe/src/features/auto/AutoForm.tsx
import { useCotacaoStore } from "multicotadorHost/store";

// 3. Both share the same Zustand instance
const { step2Data, setStep2Data, setStep2Valid } = useCotacaoStore();
```

#### 3. Data flow

```
┌────────────────────────────────────────────────────────────┐
│ STEP 1 (Host - Local)                                      │
├────────────────────────────────────────────────────────────┤
│ 1. User fills CPF: "123.456.789-00"                        │
│ 2. User selects: "Seguro Auto"                             │
│ 3. Host calls: setCpf() and setProductType()               │
│ 4. Zustand updates: { cpf, productType }                   │
│ 5. Host validates and allows going to Step 2               │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────────┐
│ STEP 2 (MFE - Remote)                                          │
├────────────────────────────────────────────────────────────────┤
│ 1. Host reads productType from Zustand                         │
│ 2. Host loads remote component:                                │
│    const AutoForm = lazy(() => import('productsMfe/AutoForm')) │
│ 3. AutoForm renders specific fields                            │
│ 4. User fills: name, email, license, plate, etc                │
│ 5. AutoForm validates with Zod                                 │
│ 6. AutoForm calls: setStep2Data(formData)                      │
│ 7. AutoForm calls: setStep2Valid(true)                         │
│ 8. Zustand updates: { step2Data, step2Valid }                  │
│ 9. Host reads step2Valid and allows going to Step 3            │
└────────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 3 (Host - Local)                                        │
├──────────────────────────────────────────────────────────────┤
│ 1. Host reads: cpf, productType, step2Data from Zustand      │
│ 2. Host calls API: POST /api/quotes/auto                     │
│    Body: { cpf, data: step2Data }                            │
│ 3. Backend returns: { offers: [...] }                        │
│ 4. Host calls: setOffers(offers)                             │
│ 5. Host renders OfferCard for each offer                     │
│ 6. User selects an offer                                     │
│ 7. Host calls: setSelectedOffer(offer)                       │
│ 8. Zustand updates: { selectedOffer, step3Valid: true }      │
│ 9. Host allows going to Step 4                               │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 4 (Host - Local)                                        │
├──────────────────────────────────────────────────────────────┤
│ 1. Host reads ALL data from Zustand                          │
│ 2. Host displays complete summary:                           │
│    - CPF and Product type                                    │
│    - All fields filled in Step 2                             │
│    - Selected offer with details                             │
│ 3. User clicks "Finish"                                      │
│ 4. System can submit to backend or reset                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Implemented patterns

### 1. State sharing via Module Federation

**Problem**: How to make two independent applications share state without duplicating code?

**Solution**: Host exposes the Zustand store via Module Federation, and MFE imports it as a remote module.

**Host Configuration:**

```typescript
// apps/multicotador-host/vite.config.ts
federation({
  name: "multicotador_host",
  exposes: {
    "./store": "./src/store/cotacaoStore.ts", // ← Exposes the store
  },
  shared: ["react", "react-dom", "zustand"],
});
```

**MFE Configuration:**

```typescript
// apps/products-mfe/vite.config.ts
federation({
  name: "products_mfe",
  remotes: {
    multicotadorHost: "http://localhost:3000/assets/remoteEntry.js",
  },
  shared: ["react", "react-dom", "zustand"], // ← Same instance
});
```

**Usage in MFE:**

```typescript
// apps/products-mfe/src/features/auto/AutoForm.tsx
import { useCotacaoStore } from "multicotadorHost/store";

export default function AutoForm() {
  const { step2Data, setStep2Data, setStep2Valid } = useCotacaoStore();

  // ✅ Accesses the same store as Host
  // ✅ Updates are reflected in real-time
}
```

**Singleton:**

| Configuration         | Result                                        |
| --------------------- | --------------------------------------------- |
| `shared: ['zustand']` | ✅ Same instance in Host and MFE              |
| Without shared        | ❌ Two different instances (duplicated state) |

📍 **Implementation**: `apps/multicotador-host/src/store/cotacaoStore.ts` + `apps/products-mfe/vite.config.ts`

---

### 2. Dynamic loading of remote components

**Problem**: How to load components from another application at runtime?

**Solution**: React.lazy() + Module Federation for on-demand loading.

**Type Declarations:**

```typescript
// apps/multicotador-host/src/types/remotes.d.ts
declare module "productsMfe/AutoForm" {
  const AutoForm: React.ComponentType;
  export default AutoForm;
}

declare module "productsMfe/ResidencialForm" {
  const ResidencialForm: React.ComponentType;
  export default ResidencialForm;
}
```

**Lazy Loading:**

```typescript
// apps/multicotador-host/src/steps/Step2.tsx
import { lazy, Suspense } from 'react';

const AutoForm = lazy(() => import('productsMfe/AutoForm'));
const ResidencialForm = lazy(() => import('productsMfe/ResidencialForm'));

export function Step2() {
  const { productType } = useCotacaoStore();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {productType === 'auto' && <AutoForm />}
      {productType === 'residencial' && <ResidencialForm />}
    </Suspense>
  );
}
```

**Loading Flow:**

| Action                             | What happens                                                     |
| ---------------------------------- | ---------------------------------------------------------------- |
| User selects "Seguro Auto"         | Step2 renders `<AutoForm />`                                     |
| React detects lazy import          | Makes request: `GET http://localhost:3001/assets/remoteEntry.js` |
| Module Federation loads the module | AutoForm is downloaded and executed                              |
| Component is rendered              | ✅ Auto form appears on screen                                   |

**Benefits:**

- 📦 Automatic code splitting - Only downloads what's needed
- ⚡ Performance - On-demand loading
- 🔄 Hot reload - MFE changes reflect without Host rebuild

📍 **Implementation**: `apps/multicotador-host/src/steps/Step2.tsx`

---

### 3. Fields validation with reusable custom hook

**Problem**: Avoid duplicating form logic between products.

**Solution**: Custom hook `useProductForm` that encapsulates React Hook Form + Zod + Zustand.

**Generic Hook:**

```typescript
// apps/products-mfe/src/hooks/useProductForm.ts
export function useProductForm<T extends FieldValues>({
  schema,
  defaultValues,
}: UseProductFormProps<T>) {
  const { step2Data, setStep2Data, setStep2Valid } = useCotacaoStore();

  const form = useForm<T>({
    resolver: zodResolver(schema), // ← Zod validation
    mode: "onBlur",
    defaultValues: defaultValues || step2Data,
  });

  // Sync validation with Zustand
  useEffect(() => {
    setStep2Valid(form.formState.isValid);
  }, [form.formState.isValid]);

  // Sync data with Zustand
  useEffect(() => {
    const subscription = form.watch((formData) => {
      setStep2Data(formData);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return form;
}
```

**Usage in AutoForm:**

```typescript
// apps/products-mfe/src/features/auto/AutoForm.tsx
export default function AutoForm() {
  const { register, watch, setValue, formState } = useProductForm<AutoFormData>(
    {
      schema: autoFormSchema, // ← Specific Zod schema
    }
  );

  // ✅ Automatic validation
  // ✅ Automatic Zustand synchronization
  // ✅ Type-safety guaranteed
}
```

📍 **Implementation**: `apps/products-mfe/src/hooks/useProductForm.ts`

---

## 🚀 How to Run

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Clone the repository
git clone git@github.com:ChristySchott/insurance-mfe.git

# Install dependencies
pnpm install
```

### Development

```bash
# Terminal 1: Backend
cd apps/server
pnpm dev

# Terminal 2: Products MFE
cd apps/products-mfe
pnpm serve

# Terminal 3: Multicotador Host
cd apps/multicotador-host
pnpm serve
```

**Access**: http://localhost:3000

---

## 🎯 How to Add a New Product

### 1. Create form in products-mfe

```typescript
// apps/products-mfe/src/features/life/LifeForm.tsx
import { useProductForm } from '@/hooks/useProductForm';
import { lifeFormSchema, type LifeFormData } from '../../lib/validation';

export default function LifeForm() {
  const { register, formState: { errors } } = useProductForm<LifeFormData>({
    schema: lifeFormSchema,
  });

  const hasErrors = Object.keys(errors).length > 0

  return (
    <ProductFormWrapper hasErrors={hasErrors}>
      {/* Fields here */}
    </ProductFormWrapper>
  );
}
```

### 2. Expose in Module Federation

```typescript
// apps/products-mfe/vite.config.ts
federation({
  exposes: {
    "./AutoForm": "./src/features/auto/AutoForm.tsx",
    "./ResidencialForm": "./src/features/residencial/ResidencialForm.tsx",
    "./LifeForm": "./src/features/life/LifeForm.tsx", // ← New
  },
});
```

### 3. Add type in Host

```typescript
// apps/multicotador-host/src/store/types.ts
export type ProductType = "auto" | "residencial" | "life"; // ← Add
```

TODO: Find a way to add a product without having to update the host

### 4. Load in Step2

```typescript
// apps/multicotador-host/src/steps/Step2.tsx
const LifeForm = lazy(() => import('productsMfe/LifeForm'));

// In render:
{productType === 'life' && <LifeForm />}
```

TODO: Find a way to add a product without having to update the host

### 5. Create service in backend

```typescript
// apps/server/src/services/life-offers.ts
export async function generateLifeOffers(cpf: string, data: any) {
  return [
    {
      id: "life-basic",
      insurerName: "Seguro Vida",
      // ...
    },
  ];
}
```

### 6. Add route in backend

```typescript
// apps/server/src/routes/quotes.ts
if (productType === "life") {
  offers = await generateLifeOffers(cpf, data);
}
```

---

## 🗂️ Project structure

```
insurance-mfe/
├── apps/
│   ├── multicotador-host/              # Host Application (Port 3000)
│   │   ├── src/
│   │   │   ├── components/             # Host Components
│   │   │   │   ├── StepWizard.tsx     # Wizard orchestrator
│   │   │   │   ├── StepProgress.tsx   # Progress indicator
│   │   │   │   ├── Navigation.tsx     # Previous/Next buttons
│   │   │   │   ├── OfferCard.tsx      # Offer card
│   │   │   │   └── LoadingSpinner.tsx # Loading spinner
│   │   │   ├── steps/                  # Wizard steps
│   │   │   │   ├── Step1.tsx          # CPF + Product selection
│   │   │   │   ├── Step2.tsx          # MFE container
│   │   │   │   ├── Step3.tsx          # Offers display
│   │   │   │   └── Step4.tsx          # Final summary
│   │   │   ├── store/                  # Global state (Zustand)
│   │   │   │   ├── cotacaoStore.ts    # Shared store
│   │   │   │   └── types.ts           # Store types
│   │   │   ├── lib/                    # Utilities
│   │   │   │   ├── api.ts             # HTTP client
│   │   │   │   └── format.ts          # Format functions
│   │   │   └── shared-deps.ts         # Shared dependencies
│   │   └── vite.config.ts             # Module Federation config
│   │
│   ├── products-mfe/                   # Remote MFE (Port 3001)
│   │   ├── src/
│   │   │   ├── features/              # Features (Products)
│   │   │   │   ├── auto/
│   │   │   │   │   ├── AutoForm.tsx   # Auto form
│   │   │   │   │   └── data.ts        # Static data
│   │   │   │   └── residencial/
│   │   │   │       └── ResidencialForm.tsx  # Home form
│   │   │   └── shared/                # Reusable code
│   │   │       ├── components/
│   │   │       │   ├── FormField.tsx   # Form field
│   │   │       │   └── ProductFormWrapper.tsx        # Form wrapper
│   │   │       ├── hooks/
│   │   │       │     └── useProductForm.tsx  # Form hook
│   │   │       └── types/
│   │   │           └── form.tsx       # Generic form types
│   │   └── vite.config.ts             # Module Federation config
│   │
│   └── server/                         # Backend API (Port 3002)
│       ├── src/
│       │   ├── index.ts               # Server setup
│       │   ├── routes/                # API Routes
│       │   │   └── quotes.ts          # Quotes endpoint
│       │   ├── services/              # Business logic
│       │   │   ├── auto-offers.ts     # Auto offers generator
│       │   │   └── residencial-offers.ts # Home offers generator
│       │   └── types/                 # TypeScript types
│       │       └── index.ts
│       └── ...
│
└── packages/
    ├── eslint-config/                 # Shared ESLint config
    └── prettier-config/               # Shared Prettier config
```

---

## 📖 Key concepts

**Module Federation**

- **Host**: Application that consumes remote modules (multicotador-host)
- **Remote**: Application that exposes modules (products-mfe)
- **Shared**: Shared dependencies (React, Zustand)
- **Singleton**: Guarantees single instance of a dependency

**Zustand store**

- Global state shared between Host and MFE
- Type-safe with TypeScript
- Reactive - changes reflect in real-time
- Simple - no complex boilerplate

**Lazy loading**

- Automatic code splitting
- On-demand loading - only downloads what's needed
- Fallback - loading component while loading
