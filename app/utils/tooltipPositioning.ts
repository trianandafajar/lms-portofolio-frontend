import type { TooltipPosition } from '~/types/walkthrough'

/**
 * Represents the bounding rectangle of the target element.
 */
export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Represents the dimensions of the tooltip.
 */
export interface TooltipSize {
  width: number
  height: number
}

/**
 * Represents the viewport dimensions.
 */
export interface ViewportSize {
  width: number
  height: number
}

/**
 * Calculates the optimal tooltip position relative to a target element.
 *
 * This is a pure function (no DOM access) that determines where to place
 * the tooltip based on available space in the viewport.
 *
 * Placement priority order: bottom → right → left → top
 * The tooltip must not overlap the target element's cutout area
 * (the target rect + gap on all sides).
 *
 * If no placement fits within the viewport, falls back to placing
 * the tooltip at the bottom of the viewport.
 *
 * @param targetRect - The bounding rect of the highlighted element
 * @param tooltipSize - The dimensions of the tooltip
 * @param viewportSize - The viewport dimensions
 * @param gap - Minimum gap between tooltip and cutout boundary (default 8)
 * @returns The computed tooltip position with placement direction
 *
 * Validates: Requirements 6.3, 6.4, 6.6
 */
export function calculateTooltipPosition(
  targetRect: TargetRect,
  tooltipSize: TooltipSize,
  viewportSize: ViewportSize,
  gap: number = 8
): TooltipPosition {
  // The cutout area is the target rect expanded by the gap on all sides
  const cutout = {
    top: targetRect.y - gap,
    left: targetRect.x - gap,
    bottom: targetRect.y + targetRect.height + gap,
    right: targetRect.x + targetRect.width + gap,
  }

  // Try each placement in priority order: bottom → right → left → top
  const placements: Array<'bottom' | 'right' | 'left' | 'top'> = ['bottom', 'right', 'left', 'top']

  for (const placement of placements) {
    const position = computePlacement(placement, targetRect, tooltipSize, viewportSize, gap, cutout)
    if (position !== null) {
      return position
    }
  }

  // Fallback: place at bottom of viewport
  return {
    top: viewportSize.height - tooltipSize.height - gap,
    left: Math.max(0, Math.min(
      (viewportSize.width - tooltipSize.width) / 2,
      viewportSize.width - tooltipSize.width
    )),
    placement: 'bottom',
  }
}

/**
 * Computes the tooltip position for a given placement direction.
 * Returns null if the tooltip doesn't fit within the viewport for that placement.
 */
function computePlacement(
  placement: 'bottom' | 'right' | 'left' | 'top',
  targetRect: TargetRect,
  tooltipSize: TooltipSize,
  viewportSize: ViewportSize,
  gap: number,
  cutout: { top: number; left: number; bottom: number; right: number }
): TooltipPosition | null {
  let top: number
  let left: number

  switch (placement) {
    case 'bottom':
      // Place below the cutout, horizontally centered on target
      top = cutout.bottom + gap
      left = targetRect.x + (targetRect.width - tooltipSize.width) / 2
      break

    case 'right':
      // Place to the right of the cutout, vertically centered on target
      top = targetRect.y + (targetRect.height - tooltipSize.height) / 2
      left = cutout.right + gap
      break

    case 'left':
      // Place to the left of the cutout, vertically centered on target
      top = targetRect.y + (targetRect.height - tooltipSize.height) / 2
      left = cutout.left - gap - tooltipSize.width
      break

    case 'top':
      // Place above the cutout, horizontally centered on target
      top = cutout.top - gap - tooltipSize.height
      left = targetRect.x + (targetRect.width - tooltipSize.width) / 2
      break
  }

  // Clamp left position to keep tooltip within viewport horizontally
  left = Math.max(0, Math.min(left, viewportSize.width - tooltipSize.width))

  // Clamp top position to keep tooltip within viewport vertically
  top = Math.max(0, Math.min(top, viewportSize.height - tooltipSize.height))

  // Check if the tooltip fits entirely within the viewport
  if (
    top >= 0 &&
    left >= 0 &&
    top + tooltipSize.height <= viewportSize.height &&
    left + tooltipSize.width <= viewportSize.width
  ) {
    // Check that the tooltip does not overlap the cutout area
    const tooltipRight = left + tooltipSize.width
    const tooltipBottom = top + tooltipSize.height

    const overlaps =
      left < cutout.right &&
      tooltipRight > cutout.left &&
      top < cutout.bottom &&
      tooltipBottom > cutout.top

    if (!overlaps) {
      return { top, left, placement }
    }
  }

  return null
}
