# Blackjack - A CSS Toolkit

Blackjack is a collection of mixins, functions and helpers written in Stylus to make your front-end development easier and faster.

https://www.youtube.com/watch?v=BGi6Q1pNbS0

## Why should I use this?

A minimum level of work is always required when building CSS for a web site or application. Every project you work on will need things such as vendor prefixes, resets, helper classes, and a whole mess of other parts. Instead of re-inventing the wheel, Blackjack gives you a starting place for your CSS. It's engineered to be re-usable across projects and easy to drop into any Stylus codebase.

## How do I use this?

The `source` directory contains the good stuff. Use Stylus's `@import` to pull in `blackjack.styl` to your project. Open it and comment out the parts you don't want, then you're good to go!

## What kind of tools are we talking about here?

### Resets

Zeros out all margins, padding and borders. Sets box-sizing to border-box. Sets images to a sensible vertical alignment.

### Helpers

- Function to build media-query breakpoints with just a couple arguments.
- Adds commonly needed vendor prefixes transparently.
- Helper classes for one-shot styles, such as margin, padding, float, position, rotation, etc.
- A set of mixins to assist with flexbox styling.

### Grid

Blackjack includes a mixin to build grid rows. They are made with flexbox but contain a float layout as a fallback. It supports gutters, multiple rows, and breakpoints to set when cells will collapse to single column. You aren't constrained to any number of columns – simply set a percentage or fraction.

### UI

Basic UI improvements are available for forms, tables, and buttons. A couple of animations are included as well. These are meant to be a starting point and the rest of Blackjack doesn't rely on them. Each are in their own Stylus sheet. If you don't like it, comment the `@import` from `Blackjack.styl` and move on! Blackjack is built to be modular in this way.