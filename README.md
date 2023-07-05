# ftd.ts

🌳 ftd.ts is a Standalone FTD Parser written in TypeScript 🚀

Original Project: [Fastn Stack](https://fastn.com)

## 📜 Copyright

⚠️ Legal Stuff: Fastn, Fastn Stack, and FTD are Copyrights of [FifthTry.com](https://fifthtry.com).

## 📚 Introduction

Welcome to the world of ftd.ts! This marvelous parser is here to help you unleash the power of FTD in your TypeScript projects. Say goodbye to parsing headaches and embrace the magic of ftd.ts! 🎩💫

## 💡 Features

- Effortlessly convert FTD code into a delightful Abstract Syntax Tree (AST) 🌳
- TypeScript all the way! Enjoy the beauty of strong typing and modern language features ✨
- Easy-peasy integration into your existing TypeScript projects. No mess, no fuss! 🧩
- Lightning-fast parsing speed that will make you go "Wow!" ⚡️💨

## ⚙️ Installation

```bash
npm i ftd.ts
```

## 🌐 Usage

Just use the magical ftd template tag and let the parser work its charm! Here's a sneak peek:

```typescript
import { createFTDParser } from '../dist/index.js';

const ftd = createFTDParser({
    containerTypes: ['ftd.column', 'ftd.row'],
});

const ast = ftd`
-- import: stuff

;; This is a comment

-- ftd.text: Hello World ;; This is an inline comment

;; Nesting

-- ftd.column:

    -- ftd.row:

        -- ftd.text:
        color: red

        This is a 
        mulitline string

        -- ftd.text: Hello Again!

    -- end: ftd.row

-- end: ftd.column
`;

console.log(ast); // Marvel at the magnificent Abstract Syntax Tree! 🌳🤩
```

## 📝 TODO

- [ ] Add Component, Record, and Variable Declaration support
- [ ] Add Renderer function to convert FTD Tree into JavaScript DOM Nodes
- [ ] Add Asset Loader for managing assets

## 📃 License

ftd.ts is licensed under the BSD 3-Clause License. See the [LICENSE](LICENSE) file for more information.

Now, go forth and conquer the FTD realm with ftd.ts! Happy parsing! 🚀✨