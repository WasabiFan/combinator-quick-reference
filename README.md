# Rust combinator quick-reference ![Gatsby Publish](https://github.com/WasabiFan/combinator-quick-reference/workflows/Gatsby%20Publish/badge.svg)

A type-indexed cheat-sheet for Rust's `Result` and `Option` "combinators": `unwrap`, `map`, `ok`, etc.

https://wasabifan.github.io/combinator-quick-reference/

## What's a "combinator"?

It's a somewhat contrived term for functions such as `unwrap`, `map` and `ok`, which are available on `Result` and `Option` types in varying forms. Some of them extract the contained value or error and return the bare type, while others map those internal values from one type to another or convert between `Option` and `Result`.

## What's this for?

Personally, I've never found the names for these functions intuitive. I know what I _have_ and what I _want_ – for example, I have a `Result` and want to map the value into an `Option` – but picking the right one is a case of autocomplete trial-and-error. That operation isn't `map`ping, but instead requires `Result::ok()`.

This page functions as an easy reference for this type of operation. Rows are grouped first by the type you _have_ and then by the type you _want_, making it easy to narrow down the candidates to a handful of functions at a glance. The type signatures of this class of "combinators" do a great job of conveying their behavior, allowing for this reference page to be "type-indexed": you pick a candidate by its type signature as well as the types of its parameters.

The type information and syntax on the page are not intended to stand on their own as documentation; they are only designed to help you identify the right function to use.

## Contributing

Contributions are welcome! The page is a straightforward Gatsby site, with listing data sourced from a YAML file and rendered in React.

## Developing locally

Quick-start:

```
npm install
npm run develop
```

To create a standalone build of static files:

```
npm run build
```

See `package.json` for all available scripts. These match the default Gatsby template.
