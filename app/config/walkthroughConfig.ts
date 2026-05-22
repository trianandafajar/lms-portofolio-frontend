import type {
  WalkthroughConfig,
  WalkthroughSequence,
} from '~/types/walkthrough'

/**
 * Walkthrough configuration defining step sequences for each route.
 * Each sequence targets UI elements via [data-walkthrough="..."] selectors.
 *
 * Note: The landing page (`/`) intentionally has no walkthrough — Mentora's
 * marketing content is self-explanatory and an introduction would be redundant.
 */
export const walkthroughConfig: WalkthroughConfig = {
  '/classes': {
    route: '/classes',
    steps: [
      {
        target: '[data-walkthrough="classes-header"]',
        title: 'Your Classes',
        description:
          'This is your classes dashboard. Here you can see all the classes you are enrolled in or manage.',
      },
      {
        target: '[data-walkthrough="classes-action-button"]',
        title: 'Create or Join a Class',
        description:
          'Use this button to create a new class as a teacher or join an existing class with a code.',
      },
      {
        target: '[data-walkthrough="classes-grid"]',
        title: 'Class Cards Grid',
        description:
          'A responsive 4-column grid of class cards. Each card shows banner, title, teacher, and student count.',
      },
      {
        target: '[data-walkthrough="classes-card-first"]',
        title: 'Individual Class Card',
        description:
          'Each card has a colored banner, code badge, title, description, teacher info, and an action button.',
      },
      {
        target: '[data-walkthrough="sidebar-my-classes"]',
        title: 'Sidebar: My Classes',
        description:
          'The sidebar shows your enrolled classes. Expand it to quickly navigate between classes.',
      },
      {
        target: '[data-walkthrough="sidebar-class-list"]',
        title: 'Sidebar Class Cards',
        description:
          'Each item here is a class you belong to. Click any to jump directly to that class detail page.',
      },
      {
        target: '[data-walkthrough="sidebar-class-card-first"]',
        title: 'My Class Card',
        description:
          'Each card shows a colored avatar, class title, and teacher name. The active class has a green dot.',
      },
    ],
  },
  '/classes/:id': {
    route: '/classes/:id',
    steps: [
      {
        target: '[data-walkthrough="class-detail-breadcrumb"]',
        title: 'Breadcrumb Navigation',
        description:
          'Use the breadcrumb to navigate back to the classes list or see where you are in the app.',
      },
      {
        target: '[data-walkthrough="class-detail-hero"]',
        title: 'Class Overview',
        description:
          'This hero section shows the class title, description, code, visibility, and a color banner.',
      },
      {
        target: '[data-walkthrough="class-detail-code"]',
        title: 'Class Code',
        description:
          'This is the unique class code. Share it with students so they can join. Click to copy.',
      },
      {
        target: '[data-walkthrough="class-detail-meta"]',
        title: 'Class Metadata',
        description:
          'See the teacher name, student count, lesson count, and creation date at a glance.',
      },
      {
        target: '[data-walkthrough="class-detail-tabs"]',
        title: 'Lessons & Students Tabs',
        description:
          'Switch between the Lessons tab to view course content and the Students tab to see members.',
      },
      {
        target: '[data-walkthrough="class-detail-add-lesson"]',
        title: 'Add Lesson Button',
        description:
          'Teachers can click here to create a new lesson with content blocks, quizzes, and essays.',
      },
      {
        target: '[data-walkthrough="class-detail-lessons-list"]',
        title: 'Lessons List',
        description:
          'All lessons in this class are listed here. Click any lesson to open and start learning.',
      },
      {
        target: '[data-walkthrough="class-detail-students-grid"]',
        title: 'Students Grid',
        description:
          'View all enrolled students with their avatar, name, and email. Switch to Students tab to see.',
      },
    ],
  },
  '/classes/:id/lessons/:lessonid': {
    route: '/classes/:id/lessons/:lessonid',
    steps: [
      {
        target: '[data-walkthrough="lesson-breadcrumb"]',
        title: 'Lesson Breadcrumb',
        description:
          'Navigate back to the class or classes list using this breadcrumb trail.',
      },
      {
        target: '[data-walkthrough="lesson-hero"]',
        title: 'Lesson Header',
        description:
          'Shows the lesson title, summary, block count, and your role badge (Teacher/Submitted).',
      },
      {
        target: '[data-walkthrough="lesson-progress"]',
        title: 'Progress Tracker',
        description:
          'Track your progress through the lesson. The bar and step dots show how far along you are.',
      },
      {
        target: '[data-walkthrough="lesson-content-block"]',
        title: 'Content Block',
        description:
          'Each block can be text, image, video, quiz, or essay. Navigate through them one by one.',
      },
      {
        target: '[data-walkthrough="lesson-pagination"]',
        title: 'Navigation Controls',
        description:
          'Use Prev/Next to move between blocks. On the last block, Submit All to finish the lesson.',
      },
    ],
  },
  '/profile': {
    route: '/profile',
    steps: [
      {
        target: '[data-walkthrough="profile-hero"]',
        title: 'Your Profile',
        description:
          'This card shows your display name, email, roles, and account status at a glance.',
      },
      {
        target: '[data-walkthrough="profile-edit-form"]',
        title: 'Edit Your Profile',
        description:
          'Update your display name and bio here. Changes are saved to your account instantly.',
      },
      {
        target: '[data-walkthrough="profile-save-button"]',
        title: 'Save Changes',
        description:
          'After editing your profile information, click Save Changes to update your account.',
      },
      {
        target: '[data-walkthrough="profile-account-info"]',
        title: 'Account Details',
        description:
          'View your read-only account information including email, status, and membership date.',
      },
    ],
  },
}

/**
 * Validation result returned by validateConfig.
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validates a walkthrough configuration or a single sequence.
 * Checks:
 * - Title length ≤ 60 characters
 * - Description length ≤ 200 characters
 * - Steps array length ≤ 15
 * - Target selectors use [data-walkthrough="..."] format
 *
 * @param config - A WalkthroughConfig object or a single WalkthroughSequence
 * @returns ValidationResult with valid flag and array of error messages
 */
export function validateConfig(
  config: WalkthroughConfig | WalkthroughSequence
): ValidationResult {
  const errors: string[] = []

  const sequences: WalkthroughSequence[] = isSequence(config)
    ? [config]
    : Object.values(config)

  for (const sequence of sequences) {
    const routeLabel = sequence.route || 'unknown'

    if (sequence.steps.length > 15) {
      errors.push(
        `Route "${routeLabel}": exceeds maximum of 15 steps (has ${sequence.steps.length})`
      )
    }

    for (let i = 0; i < sequence.steps.length; i++) {
      const step = sequence.steps[i]!
      const stepLabel = `Route "${routeLabel}", step ${i + 1}`

      if (step.title.length > 60) {
        errors.push(
          `${stepLabel}: title exceeds 60 characters (has ${step.title.length})`
        )
      }

      if (step.description.length > 200) {
        errors.push(
          `${stepLabel}: description exceeds 200 characters (has ${step.description.length})`
        )
      }

      if (!isValidTargetSelector(step.target)) {
        errors.push(
          `${stepLabel}: target selector should use [data-walkthrough="..."] format`
        )
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Type guard to determine if the input is a single WalkthroughSequence.
 */
function isSequence(
  config: WalkthroughConfig | WalkthroughSequence
): config is WalkthroughSequence {
  return 'route' in config && 'steps' in config && Array.isArray(config.steps)
}

/**
 * Checks if a target selector uses the [data-walkthrough="..."] format.
 */
function isValidTargetSelector(target: string): boolean {
  return /^\[data-walkthrough="[^"]+"\]$/.test(target)
}
