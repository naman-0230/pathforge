Throughout this roadmap, you've been working with numbers in the way humans naturally think about them.

```text
25
103
7
42
```

But computers don't actually store numbers this way.

Inside a computer, every number is represented using only **0s and 1s**.

This section introduces **Bit Manipulation**, where you'll learn to work directly with that binary representation. Although it may look unfamiliar at first, many operations become surprisingly simple once you understand how numbers are stored internally.

---

## Why This Section Exists

Suppose someone asks:

- Is this number even or odd?

You already know one solution.

```text
number % 2
```

But a computer can answer the same question by looking at just **one bit**.

Or imagine someone asks:

- Is this number a power of two?
- Find the only unique number in an array.
- Count how many bits are set to `1`.

These problems become much easier when you work directly with bits instead of decimal numbers.

---

## The Core Idea

Every number has a binary representation.

For example,

### Decimal

```text
13
```

becomes

### Binary

```text
1101
```

Each position represents a power of two.

```text
8   4   2   1
1   1   0   1
```

So,

```text
8 + 4 + 1 = 13
```

Instead of manipulating the decimal number, Bit Manipulation lets you work directly with these individual bits.

---

## A New Way of Thinking

Before this section, your instinct was:

> "Treat the number as a whole."

Now your thinking becomes:

> "Can I solve this by changing or inspecting individual bits?"

Many problems that seem mathematical become much simpler with this mindset.

---

## Meet the New Operators

Most bit manipulation problems revolve around just a few operators.

| Operator | Meaning |
|----------|---------|
| `&` | AND |
| `\|` | OR |
| `^` | XOR |
| `~` | NOT |
| `<<` | Left Shift |
| `>>` | Right Shift |

Don't worry about memorizing them right now.

The roadmap will introduce each one gradually through problems.

---

## Using Bit Operations

### C++

```cpp
int x = 5;

x << 1;
x >> 1;

x & 1;
x | 2;
x ^ 3;
```

### Java

```java
int x = 5;

x << 1;
x >> 1;

x & 1;
x | 2;
x ^ 3;
```

### Python

```python
x = 5

x << 1
x >> 1

x & 1
x | 2
x ^ 3
```

The syntax is almost identical across all three languages.

---

## Quick Cheat Sheet

| Task | Operation |
|------|-----------|
| Check even/odd | `x & 1` |
| Multiply by 2 | `x << 1` |
| Divide by 2 | `x >> 1` |
| Toggle bits | `x ^ mask` |
| Set a bit | `x \| mask` |
| Clear a bit | `x & ~mask` |

You'll understand **why** these work as you solve the problems.

---

## What You'll Practice

This section gradually introduces:

- binary representation
- bitwise operators
- XOR tricks
- counting set bits
- powers of two
- bit masking
- advanced XOR problems

---

## When Should Bit Manipulation Come to Mind?

Look for clues like:

- ✅ Binary representation.
- ✅ XOR.
- ✅ Powers of two.
- ✅ Set or unset bits.
- ✅ Very small constant-space solutions.

These are strong signs that Bit Manipulation may be the right tool.

---

## Common Beginner Mistakes

As you solve this section, try to avoid these common mistakes:

- Trying to memorize bit tricks without understanding binary.
- Treating bit operations like magic.
- Forgetting that every decimal number has a binary representation.
- Using bit manipulation where a simpler solution already exists.

Remember, Bit Manipulation isn't a collection of tricks—it's simply another way of looking at numbers.

---

# Before You Start Solving Problems

At first, bitwise operators may feel unusual because they work at a lower level than most programming concepts. Don't rush to memorize formulas. Instead, write numbers in binary on paper and perform the operations step by step. Once you can visualize how the bits change, many famous interview tricks become easy to understand rather than memorize.

As you solve the problems, keep asking yourself:

> **"What does this number look like in binary?"**

That question is the foundation of every bit manipulation problem.