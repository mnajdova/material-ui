---
title: Carousel React component
components: Carousel
---

# Carousel

<p class="description">The carousel displays different data organized as gallery.</p>

**Note:** This component is not documented in the [Material Design guidelines](https://material.io/), but Material-UI supports it.

## Simple carousel

It works!

{{"demo": "pages/components/carousel/SimpleCarousel.js"}}

## Accessibility

(WAI-ARIA: https://www.w3.org/TR/wai-aria-practices/#carousel)

A carousel presents a set of items, referred to as slides, by sequentially displaying a subset of one or more slides. Typically, one slide is displayed at a time, and users can activate a next or previous slide control that hides the current slide and "rotates" the next or previous slide into view. In some implementations, rotation automatically starts when the page loads, and it may also automatically stop once all the slides have been displayed. While a slide may contain any type of content, image carousels where each slide contains nothing more than a single image are common.

Ensuring all users can easily control and are not adversely effected by slide rotation is an essential aspect of making carousels accessible. For instance, the screen reader experience can be confusing and disorienting if slides that are not visible on screen are incorrectly hidden, e.g., displayed off-screen. Similarly, if slides rotate automatically and a screen reader user is not aware of the rotation, the user may read an element on slide one, execute the screen reader command for next element, and, instead of hearing the next element on slide one, hear an element from slide 2 without any knowledge that the element just announced is from an entirely new context.

Features needed to provide sufficient rotation control include:

Buttons for displaying the previous and next slides.
Optionally, a control, or group of controls, for choosing a specific slide to display. For example, slide picker controls can be marked up as tabs in a tablist with the slide represented by a tabpanel element.
If the carousel can automatically rotate, it also:
Has a button for stopping and restarting rotation. This is particularly important for supporting assistive technologies operating in a mode that does not move either keyboard focus or the mouse.
Stops rotating when keyboard focus enters the carousel. It does not restart unless the user explicitly requests it to do so.
Stops rotating whenever the mouse is hovering over the carousel.