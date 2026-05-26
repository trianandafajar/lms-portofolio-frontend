/**
 * Walkthrough type definitions for the guided tutorial system.
 * These types define the structure of walkthrough steps, sequences,
 * configuration, tooltip positioning, and highlight rectangles.
 */

/**
 * A single step within a walkthrough sequence that highlights
 * a specific UI element and displays instructional content.
 */
export interface WalkthroughStep {
  /** CSS selector or data-attribute selector for the target UI element */
  target: string

  /**
   * Step title displayed in the tooltip.
   * @maxLength 60 characters
   */
  title: string

  /**
   * Step description displayed in the tooltip.
   * @maxLength 200 characters
   */
  description: string

  /**
   * Optional action required to advance this step.
   * - 'click': The user must click the highlighted element to proceed.
   *   The Next button is hidden and the element becomes clickable through the overlay.
   */
  action?: 'click'

  /**
   * Optional hint to force tooltip placement direction.
   * When set, the tooltip will be placed on this side regardless of auto-detection.
   * Useful for large elements where auto-positioning may not work well.
   */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * An ordered collection of walkthrough steps associated with a specific route.
 */
export interface WalkthroughSequence {
  /** The route path this sequence applies to */
  route: string

  /**
   * Ordered array of walkthrough steps rendered in array-index order.
   * @maxItems 15 steps per sequence
   */
  steps: WalkthroughStep[]
}

/**
 * Configuration mapping route paths to their walkthrough sequences.
 * Each key is a route path string.
 */
export type WalkthroughConfig = Record<string, WalkthroughSequence>

/**
 * Describes the computed position and placement of the tooltip
 * relative to the highlighted element.
 */
export interface TooltipPosition {
  /** Absolute top position in pixels */
  top: number

  /** Absolute left position in pixels */
  left: number

  /**
   * Which side of the target element the tooltip is placed on.
   * Placement priority order: bottom → right → left → top
   */
  placement: 'bottom' | 'right' | 'left' | 'top'
}

/**
 * Describes the rectangle used to create the spotlight cutout
 * around the highlighted element.
 */
export interface HighlightRect {
  /** Left edge of the cutout in pixels */
  x: number

  /** Top edge of the cutout in pixels */
  y: number

  /** Width of the cutout in pixels */
  width: number

  /** Height of the cutout in pixels */
  height: number

  /**
   * Border radius of the cutout.
   * @minimum 4 pixels
   */
  borderRadius: number

  /**
   * Padding from the element's bounding box.
   * @minimum 8 pixels
   * @maximum 16 pixels
   */
  padding: number
}
