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
 * Placement priority: bottom → top → left → right
 * On mobile/responsive (viewport < 640px), tooltip is always aligned to the left.
 * On larger screens, tooltip is placed on the opposite horizontal side of the target.
 *
 * If no placement fits within the viewport, falls back to placing
 * the tooltip at the bottom-left of the viewport.
 *
 * @param targetRect - The bounding rect of the highlighted element
 * @param tooltipSize - The dimensions of the tooltip
 * @param viewportSize - The viewport dimensions
 * @param gap - Minimum gap between tooltip and cutout boundary (default 8)
 * @param preferredPlacement - Optional forced placement direction hint
 * @returns The computed tooltip position with placement direction
 */
export function calculateTooltipPosition(
  targetRect: TargetRect,
  tooltipSize: TooltipSize,
  viewportSize: ViewportSize,
  gap: number = 8,
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right'
): TooltipPosition {
  // The cutout area is the target rect expanded by the gap on all sides
  const cutout = {
    top: targetRect.y - gap,
    left: targetRect.x - gap,
    bottom: targetRect.y + targetRect.height + gap,
    right: targetRect.x + targetRect.width + gap,
  }

  // If a preferred placement is specified, try it first (forced placement)
  if (preferredPlacement) {
    const isMobileForced = viewportSize.width < 640
    if (isMobileForced) {
      if (preferredPlacement === 'top' || preferredPlacement === 'bottom') {
        const pos = computeMobilePlacement(preferredPlacement, targetRect, tooltipSize, viewportSize, gap, cutout)
        if (pos) return pos
      }
    } else {
      const pos = computePlacement(preferredPlacement, targetRect, tooltipSize, viewportSize, gap, cutout)
      if (pos) return pos
    }
    // If preferred placement doesn't fit, force it with clamping
    const safeMargin = 8
    let forcedTop: number
    let forcedLeft: number = safeMargin

    if (preferredPlacement === 'top') {
      forcedTop = Math.max(safeMargin, cutout.top - gap - tooltipSize.height)
    } else if (preferredPlacement === 'bottom') {
      forcedTop = Math.min(viewportSize.height - tooltipSize.height - safeMargin, cutout.bottom + gap)
    } else if (preferredPlacement === 'left') {
      forcedTop = Math.max(safeMargin, Math.min(targetRect.y, viewportSize.height - tooltipSize.height - safeMargin))
      forcedLeft = Math.max(safeMargin, cutout.left - gap - tooltipSize.width)
    } else {
      forcedTop = Math.max(safeMargin, Math.min(targetRect.y, viewportSize.height - tooltipSize.height - safeMargin))
      forcedLeft = Math.min(viewportSize.width - tooltipSize.width - safeMargin, cutout.right + gap)
    }

    return {
      top: Math.max(safeMargin, Math.min(forcedTop, viewportSize.height - tooltipSize.height - safeMargin)),
      left: Math.max(safeMargin, Math.min(forcedLeft, viewportSize.width - tooltipSize.width - safeMargin)),
      placement: preferredPlacement,
    }
  }

  const isMobile = viewportSize.width < 640

  // On mobile, choose placement based on target's vertical position
  if (isMobile) {
    // If target is in the lower half of viewport, prefer top placement
    // If target is in the upper half, prefer bottom placement
    const targetCenterY = targetRect.y + targetRect.height / 2
    const preferTop = targetCenterY > viewportSize.height / 2

    if (preferTop) {
      // Try top first, then bottom
      const topPos = computeMobilePlacement('top', targetRect, tooltipSize, viewportSize, gap, cutout)
      if (topPos) return topPos

      const bottomPos = computeMobilePlacement('bottom', targetRect, tooltipSize, viewportSize, gap, cutout)
      if (bottomPos) return bottomPos
    } else {
      // Try bottom first, then top
      const bottomPos = computeMobilePlacement('bottom', targetRect, tooltipSize, viewportSize, gap, cutout)
      if (bottomPos) return bottomPos

      const topPos = computeMobilePlacement('top', targetRect, tooltipSize, viewportSize, gap, cutout)
      if (topPos) return topPos
    }

    // Fallback: place at top of viewport if target is low, bottom if target is high
    if (preferTop) {
      return {
        top: gap,
        left: gap,
        placement: 'top',
      }
    }
    return {
      top: viewportSize.height - tooltipSize.height - gap,
      left: gap,
      placement: 'bottom',
    }
  }

  // Desktop: use position-aware placement
  const targetCenterX = targetRect.x + targetRect.width / 2
  const targetCenterY = targetRect.y + targetRect.height / 2
  const isTargetOnLeft = targetCenterX < viewportSize.width / 2
  const isTargetInLowerHalf = targetCenterY > viewportSize.height / 2

  // Build placement priority based on target position
  let placements: Array<'bottom' | 'right' | 'left' | 'top'>

  if (isTargetInLowerHalf) {
    // Target in lower half → prefer top, then horizontal
    placements = isTargetOnLeft
      ? ['top', 'right', 'left', 'bottom']
      : ['top', 'left', 'right', 'bottom']
  } else {
    // Target in upper half → prefer horizontal opposite, then bottom
    placements = isTargetOnLeft
      ? ['right', 'bottom', 'top', 'left']
      : ['left', 'bottom', 'top', 'right']
  }

  for (const placement of placements) {
    const position = computePlacement(placement, targetRect, tooltipSize, viewportSize, gap, cutout)
    if (position !== null) {
      return position
    }
  }

  // Fallback: place at bottom of viewport, left-aligned
  return {
    top: viewportSize.height - tooltipSize.height - gap,
    left: gap,
    placement: 'bottom',
  }
}

/**
 * Computes tooltip position for mobile - always left-aligned with safety margin.
 */
function computeMobilePlacement(
  placement: 'bottom' | 'top',
  _targetRect: TargetRect,
  tooltipSize: TooltipSize,
  viewportSize: ViewportSize,
  gap: number,
  cutout: { top: number; left: number; bottom: number; right: number }
): TooltipPosition | null {
  let top: number
  const safeMargin = 8
  const left = safeMargin // Always left-aligned on mobile with safe margin

  if (placement === 'bottom') {
    top = cutout.bottom + gap
  } else {
    top = cutout.top - gap - tooltipSize.height
  }

  // Clamp top to stay within viewport with safe margin
  top = Math.max(safeMargin, Math.min(top, viewportSize.height - tooltipSize.height - safeMargin))

  // Check fits in viewport
  if (
    top >= 0 &&
    top + tooltipSize.height <= viewportSize.height &&
    left + tooltipSize.width <= viewportSize.width
  ) {
    // Check no overlap with cutout
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

/**
 * Computes the tooltip position for a given placement direction (desktop).
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
      // Place below the cutout, aligned to left side
      top = cutout.bottom + gap
      left = Math.max(gap, targetRect.x)
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
      // Place above the cutout, aligned to left side
      top = cutout.top - gap - tooltipSize.height
      left = Math.max(gap, targetRect.x)
      break
  }

  // Clamp left position to keep tooltip within viewport with safe margin
  const safeMargin = 8
  left = Math.max(safeMargin, Math.min(left, viewportSize.width - tooltipSize.width - safeMargin))

  // Clamp top position to keep tooltip within viewport with safe margin
  top = Math.max(safeMargin, Math.min(top, viewportSize.height - tooltipSize.height - safeMargin))

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
