<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <div
        class="hidden sm:flex w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center ring-1 ring-emerald-100">
        <UIcon name="heroicons-book-open" class="h-6 w-6 text-emerald-600" />
      </div>
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Application Guide</h1>
        <p class="text-sm text-slate-500 mt-0.5">Learn how to use Mentora and get the most out of the platform</p>
      </div>
    </div>

    <!-- Section 1: Introduction -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100 shrink-0">
          <UIcon name="heroicons-sparkles" class="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Introduction to Mentora</h2>
          <p class="text-xs text-slate-500">Getting started with the learning platform</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          Welcome to Mentora, your learning management system designed to make education accessible and engaging.
          Mentora provides a streamlined experience for both students and teachers to manage classes,
          track progress, and collaborate effectively.
        </p>
        <p class="text-slate-700 leading-relaxed">
          When you first visit each section of the application, an interactive walkthrough will guide you
          through the key features. The walkthrough highlights important UI elements and provides
          step-by-step instructions to help you get started quickly.
        </p>
        <img
          src="/images/guide/dashboard-overview.svg"
          alt="Dashboard overview showing class cards and navigation"
          class="w-full rounded-lg border border-slate-200"
          loading="eager"
        />
      </div>
    </section>

    <!-- Section 2: /classes Page -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100 shrink-0">
          <UIcon name="heroicons-academic-cap" class="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Classes Page (/classes)</h2>
          <p class="text-xs text-slate-500">Browse, enroll, and manage your courses</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          The <strong>/classes</strong> page is your main dashboard for all enrolled or managed classes.
          It displays a header with the total class count and a primary action button.
        </p>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Highlighted Elements:</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Page Header</strong> — Shows "My Classes" title with the total number of classes and a subtitle describing your role (manage classes for teachers, learning journey for students).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Action Button</strong> — "Create Class" for teachers/admins or "Join Class" for students. Opens a modal to create or join a class by code.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Cards Grid (4-column layout)</strong> — A responsive grid that displays up to 4 cards per row on large screens (1 column on mobile, 2 on small, 3 on medium, 4 on XL). Each card is described in detail below.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Individual Class Card (first card highlighted)</strong> — The walkthrough spotlights the first class card to show its anatomy: colored banner, code badge, title, description, teacher info, and action button. This teaches users what each card contains.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Sidebar: My Classes</strong> — The sidebar navigation item is highlighted to show users they can also access classes from the left panel.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Sidebar Class List</strong> — The expandable class list in the sidebar is highlighted to show quick navigation to individual class detail pages.</span>
            </li>
          </ul>
        </div>

        <!-- Class Card Detail -->
        <div class="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <h3 class="font-semibold text-sky-800 text-sm mb-2">Class Card Anatomy (when classes exist):</h3>
          <p class="text-sm text-sky-700 mb-3">Each card in the grid represents one class and contains the following elements from top to bottom:</p>
          <ul class="space-y-2 text-sm text-sky-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Colored Banner (h-24)</strong> — A colored header strip (emerald, violet, amber, rose, or sky based on class ID). Shows a visibility badge (e.g., "Class" or "Public") at the bottom-left.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Code Badge</strong> — Positioned at the top-right of the banner. Displays the class code in monospace font. On hover, a clipboard icon appears. Click to copy the code (shows a checkmark on success).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Title</strong> — Bold text, truncated to 1 line if too long.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Description</strong> — Slate-colored text, truncated to 2 lines. Shows "No description provided." if empty.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Teacher Info</strong> — A colored circular avatar (first letter of teacher name) with the teacher's display name and "Teacher" label below.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Footer Section</strong> — Separated by a border-top. Shows student count with a users icon. Below that, a full-width button labeled "Manage Class" (for teachers) or "Open Class" (for students) that turns dark on hover.</span>
            </li>
          </ul>
          <p class="text-xs text-sky-600 mt-3 italic">The entire card is a clickable link (NuxtLink) that navigates to /classes/:id. On hover, the card lifts slightly with a shadow effect.</p>
        </div>

        <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h3 class="font-semibold text-amber-800 text-sm mb-2">When No Classes Exist (Empty State):</h3>
          <p class="text-sm text-amber-700">
            If you have no classes yet, the page displays an empty state with a large academic cap icon inside a circle,
            a "No classes yet" heading, a description prompting you to create or join a class, and a single action button.
            No class cards or grid are shown — just the centered empty state card with a dashed border.
          </p>
        </div>

        <img
          src="/images/guide/classes-navigation.svg"
          alt="Classes page showing enrolled and available classes"
          class="w-full rounded-lg border border-slate-200"
          loading="eager"
        />
      </div>
    </section>

    <!-- Section 3: Create Class Modal -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100 shrink-0">
          <UIcon name="heroicons-plus" class="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Create Class Modal</h2>
          <p class="text-xs text-slate-500">For teachers and admins to create a new class</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          Clicking the <strong>"Create Class"</strong> button on the /classes page opens a modal dialog (max-width: lg).
          This modal is only available to users with the <strong>teacher</strong> or <strong>admin</strong> role.
        </p>

        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <h3 class="font-semibold text-emerald-800 text-sm mb-2 flex items-center gap-2">
            <UIcon name="heroicons-cursor-arrow-rays" class="h-4 w-4" />
            Walkthrough Highlight
          </h3>
          <p class="text-sm text-emerald-700">
            The "Create Class" / "Join Class" button is highlighted in the walkthrough as <strong>"Create or Join a Class"</strong> step on the /classes page.
            The walkthrough explains that this button opens a modal for creating (teachers) or joining (students) a class.
          </p>
        </div>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Modal Structure (Highlighted Elements):</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Header</strong> — An emerald academic cap icon with the title "Create New Class" and subtitle "Set up a new class for your students. You can edit details later."</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Title Field</strong> — Required text input (placeholder: "e.g. Mathematics 101"). Validated with valibot schema — must be non-empty.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Description Field</strong> — Required textarea with 4 rows (placeholder: "What will students learn in this class?", hint: "A brief overview shown to students"). Validated — must be non-empty.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Error Display</strong> — If creation fails, a red error box appears with an exclamation icon and the error message. If the error is a 403 (class limit reached), a "View subscription plans" link navigates to /subscription.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Footer Actions</strong> — Gray background footer with: a ghost "Cancel" button and a primary "Create Class" button with a plus icon. The create button shows a loading spinner while the API call is in progress.</span>
            </li>
          </ul>
        </div>

        <p class="text-sm text-slate-600">
          On successful creation, the modal closes, the form resets, a success toast notification appears ("Class created successfully"),
          and the class list refreshes automatically to show the new class card in the grid.
        </p>
      </div>
    </section>

    <!-- Section 4: Join Class Modal -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center ring-1 ring-sky-100 shrink-0">
          <UIcon name="heroicons-arrow-right-on-rectangle" class="h-5 w-5 text-sky-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Join Class Modal</h2>
          <p class="text-xs text-slate-500">For students to join a class using a code</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          Clicking the <strong>"Join Class"</strong> button on the /classes page opens a modal dialog (max-width: md).
          This modal is available to <strong>student</strong> users (non-teacher, non-admin).
        </p>

        <div class="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <h3 class="font-semibold text-sky-800 text-sm mb-2 flex items-center gap-2">
            <UIcon name="heroicons-cursor-arrow-rays" class="h-4 w-4" />
            Walkthrough Highlight
          </h3>
          <p class="text-sm text-sky-700">
            The "Join Class" button shares the same walkthrough highlight as "Create Class" — it is the <strong>"Create or Join a Class"</strong> step.
            The walkthrough explains that students use this button to join an existing class with a code provided by their teacher.
          </p>
        </div>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Modal Structure (Highlighted Elements):</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Header</strong> — A sky-blue arrow-right-on-rectangle icon with the title "Join a Class" and subtitle "Enter the class code shared by your teacher to enroll."</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Code Field</strong> — A single required field with extra-large size, monospace font, centered text, uppercase transform (placeholder: "e.g. ABC123", hint: "Usually a short alphanumeric code"). Validated with valibot — must be non-empty.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Error Display</strong> — If joining fails (invalid code, already enrolled, class not found, etc.), a red error box appears with an exclamation icon and the error message.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Footer Actions</strong> — Gray background footer with: a ghost "Cancel" button and a primary "Join Class" button with an arrow icon. Shows a loading spinner while the API call is in progress.</span>
            </li>
          </ul>
        </div>

        <p class="text-sm text-slate-600">
          On successful join, the modal closes, the code field resets, a success toast notification appears ("Joined class successfully"),
          and the class list refreshes to show the newly joined class card in the grid.
        </p>
      </div>
    </section>

    <!-- Section 5: Add Lesson Dialog -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center ring-1 ring-teal-100 shrink-0">
          <UIcon name="heroicons-book-open" class="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Add Lesson Dialog</h2>
          <p class="text-xs text-slate-500">Create lessons with content blocks (teachers only)</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          On the <strong>/classes/:id</strong> page under the "Lessons" tab, teachers see an <strong>"Add Lesson"</strong> button.
          Clicking it opens a large modal (max-width: 3xl) with a two-tab workflow for creating lessons.
        </p>

        <div class="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <h3 class="font-semibold text-teal-800 text-sm mb-2 flex items-center gap-2">
            <UIcon name="heroicons-cursor-arrow-rays" class="h-4 w-4" />
            Walkthrough Highlight
          </h3>
          <p class="text-sm text-teal-700">
            The "Add Lesson" button is highlighted in the walkthrough as the <strong>"Add Lesson Button"</strong> step on the /classes/:id page.
            The walkthrough explains that teachers can click here to create a new lesson with content blocks, quizzes, and essays.
            This step only appears for teacher/admin users since the button is conditionally rendered.
          </p>
        </div>

        <!-- Tab 1: Details -->
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Tab 1: Details (Highlighted Elements)</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Modal Header</strong> — Emerald book-open icon (w-12 h-12 rounded-2xl), title "Create New Lesson", subtitle "Fill in lesson details, then add content blocks. You can edit anything before saving."</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Tab Navigation</strong> — Two tab buttons below the header: "Details" (document-text icon) and "Content Blocks" (rectangle-stack icon, with a count badge showing number of blocks). The "Content Blocks" tab is disabled until title and description are filled.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Lesson Title</strong> — Required text input, size lg (placeholder: "e.g. Introduction to Algebra").</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Description</strong> — Required textarea, 3 rows (placeholder: "What will students learn in this lesson?", hint: "Short overview shown to students").</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Short Content</strong> — Optional textarea, 3 rows (placeholder: "Optional short content...", hint: "Optional preview text").</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Error Display</strong> — If the lesson store has an error, a red box with exclamation icon shows the error message.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Footer</strong> — "Cancel" ghost button on the left. "Continue to Content" primary button with arrow-right icon on the right. Clicking it validates title/description and switches to the Content tab.</span>
            </li>
          </ul>
        </div>

        <!-- Tab 2: Content Blocks -->
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Tab 2: Content Blocks (Highlighted Elements)</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>AI Generator Card</strong> — A violet-bordered card (border-violet-200, bg-violet-50/50) with a sparkles icon and "Generate with AI" title. Contains a textarea for prompts (e.g., "Module about photosynthesis with 5 multiple choices and 1 essay question") and a primary "Generate" button with sparkles icon. Shows loading state while generating.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Block List Header</strong> — Shows "Content Blocks" with a count in parentheses (e.g., "(3)") and a neutral "Add Block" button with plus icon on the right.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Block Items</strong> — Each block is a card showing: a colored type icon (w-10 h-10 rounded-lg), block number badge, type badge (uppercase, colored), title (truncated), preview text (truncated), and 4 action buttons: move up (arrow-up), move down (arrow-down), edit (pencil-square), delete (trash, red).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Empty State</strong> — If no blocks exist, a dashed-border card (border-dashed, bg-slate-50/50) shows a rectangle-stack icon, "No content blocks yet" heading, and "Click 'Add Block' or generate with AI to begin." subtitle.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Footer</strong> — "Cancel" ghost button on the left. On the right: "Back to Details" outline button with arrow-left icon, and "Save Lesson" primary button with check icon (shows loading spinner). Save requires at least one content block — shows a warning toast if empty.</span>
            </li>
          </ul>
        </div>

        <!-- Block Editor Sub-Modal -->
        <div class="bg-violet-50 rounded-xl p-4 border border-violet-100">
          <h3 class="font-semibold text-violet-800 text-sm mb-2">Block Editor Sub-Modal (Highlighted Elements):</h3>
          <p class="text-sm text-violet-700 mb-3">Clicking "Add Block" or the edit (pencil) icon on a block opens a second modal (max-width: 2xl) for configuring a single content block.</p>
          <ul class="space-y-2 text-sm text-violet-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Modal Header</strong> — Title shows "Add Content Block" (new) or "Edit Content Block" (editing). Subtitle: "Choose a type and fill in the content. The block will be added to your lesson."</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Block Type Picker</strong> — A 5-column grid (2 cols on mobile, 5 on sm+) of type buttons. Each button shows a colored icon (w-8 h-8 rounded-lg) and label. Types: Text (sky), Image (amber), Video (rose), Multiple Choice (violet), Essay (emerald). The selected type has border-emerald-500, bg-emerald-50, and ring-1 ring-emerald-500.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Text Block Fields</strong> — Title input (optional, placeholder: "e.g. Introduction") + Content textarea (required, 6 rows, placeholder: "Write the lesson content here...").</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Image Block Fields</strong> — Title input (optional) + File upload input (accept: image/*, styled file button) + Alt text input (hint: "For accessibility"). Shows image preview (max-h-56, rounded-md) after upload.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Video Block Fields</strong> — Title input (optional) + File upload input (accept: video/*). Shows video preview with controls (max-h-60, rounded-lg) after upload.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Multiple Choice Fields</strong> — Question input (required, placeholder: "e.g. What is the capital of France?") + Options list (each row: checkbox for is_correct inside a w-9 h-9 rounded-lg label, text input for option value, trash delete button) + "Add Option" outline button + Explanation textarea (hint: "Shown after answering"). Validation: at least 2 options, at least 1 correct.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Essay Block Fields</strong> — Question input (required, placeholder: "e.g. Explain the water cycle") + Placeholder input (hint: "Hint text inside the input") + Max length number input (hint: "Number of characters", placeholder: "500") + Explanation textarea (optional).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Footer</strong> — Gray background with: ghost "Cancel" button and primary button showing "Add Block" (with plus icon, for new blocks) or "Save Changes" (with check icon, for editing).</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Section 3: Sidebar - My Classes -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center ring-1 ring-indigo-100 shrink-0">
          <UIcon name="heroicons-bars-3" class="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Sidebar: My Classes</h2>
          <p class="text-xs text-slate-500">Quick navigation to your enrolled classes</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          The sidebar on the left contains a <strong>"My Classes"</strong> navigation item with a collapsible class list.
          It is always visible across all authenticated pages.
        </p>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Highlighted Elements:</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <span><strong>My Classes Link</strong> — The main navigation item with an academic cap icon. When active (on /classes), it has a green background. Clicking it navigates to the classes page.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <span><strong>Expand/Collapse Toggle</strong> — A chevron button next to "My Classes" that expands or collapses the class list below.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Cards in Sidebar</strong> — When expanded, each class appears as a mini card with a colored avatar (first letter of class title), the class title (truncated), and the teacher's display name. Clicking any card navigates directly to that class detail page. The currently active class shows a subtle highlight and a green dot indicator.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <span><strong>Individual My Class Card (first card highlighted)</strong> — The walkthrough spotlights the first class card in the sidebar to show its structure: a colored rounded-xl avatar (w-10 h-10) with the first letter of the class title, the class title text (truncated, font-medium), the teacher's display name below (text-xs, slate-500), and a green dot indicator if this class is currently active. The card has hover and active states with border and background changes.</span>
            </li>
          </ul>
        </div>

        <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h3 class="font-semibold text-amber-800 text-sm mb-2">When No Classes Exist (Empty Sidebar):</h3>
          <p class="text-sm text-amber-700">
            If you have no enrolled classes, the expandable class list section will be empty — no class cards are displayed.
            You will only see the "My Classes" link itself. Join or create a class first to see items here.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 4: /classes/:id Page -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100 shrink-0">
          <UIcon name="heroicons-rectangle-stack" class="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Class Detail Page (/classes/:id)</h2>
          <p class="text-xs text-slate-500">View class information, lessons, and students</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          The <strong>/classes/:id</strong> page shows the full details of a specific class. It is accessed by clicking
          a class card on the /classes page or from the sidebar class list.
        </p>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Highlighted Elements:</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Breadcrumb Navigation</strong> — Shows "My Classes → [Class Title]" with a back arrow. Allows quick navigation back to the classes list.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Hero Header</strong> — A large card with a colored banner strip at the top, a large avatar showing the first letter of the class title, the full class title, and the class description (up to 3 lines). The banner also shows the class visibility badge (e.g., "Public" or "Private").</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Code</strong> — Displayed on the banner as a monospace code string. Click it to copy the code to your clipboard. A checkmark icon confirms the copy action.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Class Metadata</strong> — Below the title, a row shows: teacher avatar + name, student count, lesson count, and creation date. This gives a quick overview of the class at a glance.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Lessons & Students Tabs</strong> — A tabbed interface with two tabs: "Lessons" (showing all lessons in the class with their count badge) and "Students" (showing all enrolled members with their count badge). Click a tab to switch views. The active tab has a green underline indicator.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Add Lesson Button (teachers only)</strong> — Inside the Lessons tab, teachers see a primary "Add Lesson" button with a plus icon. Clicking it opens the lesson creation dialog. This button is only visible to teacher/admin users.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Lessons List</strong> — All lessons are displayed as clickable cards in a vertical list. Each lesson card shows: a book-open icon (w-10 h-10, rounded-lg, bg-slate-100), the lesson title (bold, truncated), an optional summary (1 line, slate-500), and a chevron-right arrow. Clicking navigates to /classes/:id/lessons/:lessonId. On hover, the card lifts with a shadow.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Students Grid</strong> — Under the "Students" tab, enrolled members are displayed in a responsive 3-column grid. Each student card shows: a colored circular avatar (w-10 h-10, emerald-500, first letter of name), the student's display name (bold, truncated), and their email (xs, slate-500, truncated).</span>
            </li>
          </ul>
        </div>

        <!-- Lessons Tab Detail -->
        <div class="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <h3 class="font-semibold text-teal-800 text-sm mb-2">Lessons Tab — Detailed View:</h3>
          <ul class="space-y-2 text-sm text-teal-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Lesson Card Structure</strong> — Each lesson is a NuxtLink card with: a slate-100 icon container (book-open icon), a content area with title (font-semibold, truncate) and summary (text-sm, line-clamp-1), and a trailing chevron-right icon that animates on hover.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
              <span><strong>Empty State</strong> — If no lessons exist, a centered card shows a book-open icon in a circle, "No lessons available yet" heading, and "Click 'Add Lesson' to start creating content." subtitle.</span>
            </li>
          </ul>
        </div>

        <!-- Students Tab Detail -->
        <div class="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <h3 class="font-semibold text-sky-800 text-sm mb-2">Students Tab — Detailed View:</h3>
          <ul class="space-y-2 text-sm text-sky-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Student Card Structure</strong> — Each member is displayed in a card with: a green circular avatar (bg-emerald-500, white text, first letter of display name), the student's display name (font-medium, truncate), and their email address (text-xs, slate-500, truncate).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Grid Layout</strong> — Students are arranged in a responsive grid: 1 column on mobile, 2 on small screens, 3 on large screens.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <span><strong>Empty State</strong> — If no members have joined, a centered card shows a users icon in a circle, "No members have joined yet" heading, and "Share the class code to invite students." subtitle.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Section 5: /classes/:id/lessons/:id Page -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center ring-1 ring-rose-100 shrink-0">
          <UIcon name="heroicons-book-open" class="h-5 w-5 text-rose-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Lesson Page (/classes/:id/lessons/:id)</h2>
          <p class="text-xs text-slate-500">Interactive lesson content with quizzes and essays</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          The <strong>/classes/:id/lessons/:id</strong> page is the interactive lesson viewer. It presents lesson content
          as a paginated sequence of blocks that students navigate through one at a time.
        </p>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <h3 class="font-semibold text-slate-800 text-sm mb-2">Highlighted Elements:</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span><strong>Lesson Breadcrumb</strong> — Shows "My Classes → [Class Title] → [Lesson Title]" for full navigation context. Click any segment to navigate back.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span><strong>Lesson Hero Header</strong> — Displays the lesson title, an optional summary, the total block count (e.g., "5 blocks"), and a role badge. Teachers see a purple "Teacher View" badge; students who already submitted see a green "Submitted" badge.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span><strong>Progress Tracker</strong> — A progress bar showing "Section X of Y" with a percentage badge. Below it, clickable step indicator dots let you jump to any section. Completed sections are green, the current section is bright green, and upcoming sections are gray.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span><strong>Content Block</strong> — The main content area that renders one block at a time. Each block has a type indicator header (Reading, Image, Video, Quiz, or Essay) with a colored icon. The block types are:
                <ul class="mt-1 ml-4 space-y-1">
                  <li>• <strong>Text</strong> — Rich text content with markdown support (bold, italic, code).</li>
                  <li>• <strong>Image</strong> — A centered image with rounded corners and error handling.</li>
                  <li>• <strong>Video</strong> — An HTML5 video player with controls.</li>
                  <li>• <strong>Multiple Choice (Quiz)</strong> — Options displayed as labeled cards (A, B, C...). Click to select. In review mode, correct answers show green, wrong answers show red, and an explanation may appear.</li>
                  <li>• <strong>Essay</strong> — A textarea for free-form answers. Auto-saves after you stop typing. Shows character count if a max length is set.</li>
                </ul>
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span><strong>Navigation Controls</strong> — Bottom bar with: a "Reset" button (or "View Score"/"View Student Submissions" in review mode) on the left, and "Prev"/"Next" buttons on the right. On the last block, "Next" becomes "Submit All" which submits all answers and shows results.</span>
            </li>
          </ul>
        </div>

        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <h3 class="font-semibold text-emerald-800 text-sm mb-2">After Submission (Results View):</h3>
          <ul class="space-y-2 text-sm text-emerald-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Score Banner</strong> — A green gradient banner with a trophy icon showing "Lesson Complete!" and your assessment results.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Score Cards</strong> — Three cards showing: Correct count (green), Wrong count (red), and Accuracy percentage (gray).</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Score Progress Bar</strong> — A visual bar showing your score ratio.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Review Answers Button</strong> — Click to go back through all blocks in review mode, seeing which answers were correct/incorrect with explanations.</span>
            </li>
          </ul>
        </div>

        <div class="bg-violet-50 rounded-xl p-4 border border-violet-100">
          <h3 class="font-semibold text-violet-800 text-sm mb-2">Teacher View:</h3>
          <ul class="space-y-2 text-sm text-violet-700">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Content Overview</strong> — Teachers see the lesson content in review mode by default with a "Content Overview" card and a "Back to Content" button.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"></span>
              <span><strong>Student Submissions Table</strong> — A full table showing all class members with columns: Student name, Status (Submitted/Pending), Correct count, Wrong count, Accuracy percentage, and Submitted date. Includes a Refresh button to reload data.</span>
            </li>
          </ul>
        </div>

        <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h3 class="font-semibold text-amber-800 text-sm mb-2">Empty / Loading States:</h3>
          <ul class="space-y-2 text-sm text-amber-700">
            <li>• <strong>Loading</strong> — Skeleton placeholders animate while lesson data is being fetched.</li>
            <li>• <strong>No Content</strong> — If the lesson has no content blocks, a centered empty state shows "No content available" with a back button to return to the class.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Section 6: Managing Your Profile -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100 shrink-0">
          <UIcon name="heroicons-user-circle" class="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Managing Your Profile</h2>
          <p class="text-xs text-slate-500">Update your information and preferences</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          Your profile page allows you to customize your display name and bio. Other users
          will see this information when you interact on the platform. Keep your profile
          up to date to help others recognize you.
        </p>
        <p class="text-slate-700 leading-relaxed">
          The account section displays read-only information such as your email address,
          account status, and membership date. If you need to change your email or password,
          please contact support.
        </p>
        <img
          src="/images/guide/profile-management.svg"
          alt="Profile page with edit form and account information"
          class="w-full rounded-lg border border-slate-200"
          loading="eager"
        />
      </div>
    </section>

    <!-- Section 7: Reset Walkthroughs -->
    <section class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center ring-1 ring-amber-100 shrink-0">
          <UIcon name="heroicons-arrow-path" class="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 class="font-semibold text-slate-900">Reset Walkthroughs</h2>
          <p class="text-xs text-slate-500">Restart the guided tutorials for all pages</p>
        </div>
      </div>
      <div class="px-6 py-6 space-y-4">
        <p class="text-slate-700 leading-relaxed">
          If you'd like to see the guided walkthroughs again, you can reset them here.
          This will clear all completion records and the walkthroughs will appear again
          the next time you visit each page.
        </p>

        <!-- Status message -->
        <div v-if="resetMessage" :class="[
          'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium',
          resetMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            : 'bg-red-50 text-red-700 ring-1 ring-red-200'
        ]">
          <UIcon
            :name="resetMessage.type === 'success' ? 'heroicons-check-circle' : 'heroicons-exclamation-circle'"
            class="h-5 w-5 shrink-0"
          />
          {{ resetMessage.text }}
        </div>

        <UButton
          color="primary"
          icon="heroicons-arrow-path"
          size="lg"
          :loading="resetting"
          @click="handleResetWalkthroughs"
        >
          Reset All Walkthroughs
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTutorialStore } from '~/stores/tutorial'

const tutorialStore = useTutorialStore()

const resetting = ref(false)
const resetMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

async function handleResetWalkthroughs() {
  resetting.value = true
  resetMessage.value = null

  try {
    tutorialStore.resetAllRoutes()
    resetMessage.value = {
      type: 'success',
      text: 'All walkthroughs have been reset. They will appear again on your next visit to each page.',
    }
  } catch (error: any) {
    resetMessage.value = {
      type: 'error',
      text: 'Failed to reset walkthroughs. Please try again.',
    }
  } finally {
    resetting.value = false
  }
}
</script>
