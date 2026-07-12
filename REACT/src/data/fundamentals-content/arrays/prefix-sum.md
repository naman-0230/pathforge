So far, you've learned several ways to avoid unnecessary work.

- **Hashing** helped you remember information you've already seen.
- **Two Pointers** reduced unnecessary comparisons.
- **Sliding Window** reused work between overlapping subarrays.

In this section, you'll learn another optimization technique that follows the same philosophy:

> **Do the work once, so you don't have to do it again later.**

Instead of recomputing the sum of a range every time someone asks for it, you'll prepare the answers in advance.

This idea is called **Prefix Sum**, and it's one of the simplest yet most powerful preprocessing techniques in DSA.

---

# Why This Section Exists

Imagine someone asks you:

> Find the sum of elements from index **2** to index **6**.

You could simply loop from index **2** to index **6** and add everything.

Now imagine they ask:

- Sum from index **2** to **6**
- Sum from index **4** to **8**
- Sum from index **1** to **5**
- Sum from index **3** to **9**
- Sum from index **0** to **7**

Every question makes you walk through the array again.

You're doing the same additions repeatedly.

There must be a better way.

---

# The Core Idea

Instead of answering every question separately, what if we prepared some information beforehand?

Suppose our array is:

```text
2   4   1   7   3
```

Now imagine walking through the array once while keeping a running total.

```text
2

↓

2 + 4 = 6

↓

6 + 1 = 7

↓

7 + 7 = 14

↓

14 + 3 = 17
```

Now store those running totals.

**Original**

```text
2   4   1   7   3
```

↓

**Prefix Sum**

```text
2   6   7   14   17
```

Each position now represents:

> **"The sum of everything from the beginning up to this index."**

That's the entire idea behind Prefix Sum.

---

# A New Way of Thinking

Before this section, your instinct may have been:

> "Whenever I need a sum, I'll calculate it."

Now your thinking becomes:

> "If I'll need many sums later, maybe I should calculate something useful once and reuse it."

This is called **preprocessing**.

You spend a little time preparing information, and later every query becomes much easier.

---

# How Prefix Sums Help

Suppose someone asks:

> Sum from index **1** to **3**

Instead of adding

```text
4 + 1 + 7
```

you already know:

**Prefix**

```text
2   6   7   14   17
```

The prefix at index **3** already contains:

```text
2 + 4 + 1 + 7
```

The prefix at index **0** contains:

```text
2
```

Remove what you don't need.

```text
(2 + 4 + 1 + 7)

-

(2)
```

You're left with

```text
4 + 1 + 7
```

Instead of rebuilding the answer, you're subtracting away the unnecessary part.

That's the magic of Prefix Sum.

---

# Visualizing It

Think of the prefix array as a growing container.

```text
Index

0

[2]

↓

Index

1

[2 + 4]

↓

Index

2

[2 + 4 + 1]

↓

Index

3

[2 + 4 + 1 + 7]

↓

Index

4

[2 + 4 + 1 + 7 + 3]
```

Each new position simply extends everything before it.

Nothing is recalculated from scratch.

---

# When Should Prefix Sum Come to Mind?

As you read problems, watch for clues like:

- ✅ Multiple range sum queries.
- ✅ Questions involving sums of subarrays.
- ✅ Repeated calculations over different ranges.
- ✅ Problems where recalculating the same values feels wasteful.
- ✅ Situations where preprocessing once could save time later.

Whenever you notice repeated range calculations, Prefix Sum should become one of your first ideas.

---

# Prefix Sum Isn't Only About Addition

Although you'll begin with sums, don't think Prefix Sum is limited to arithmetic.

The same idea can be adapted to many kinds of accumulated information.

For example:

- frequencies,
- counts,
- parity,
- XOR,
- differences,
- and even two-dimensional grids.

The underlying principle never changes:

> **Store cumulative information so future queries become easier.**

---

# What You'll Practice

The problems in this section will gradually teach you how to:

- build prefix arrays,
- answer range sum queries,
- avoid repeated calculations,
- recognize when preprocessing is worthwhile,
- connect Prefix Sum with hashing,
- solve maximum subarray style problems,
- extend the idea to two-dimensional matrices.

Each problem builds on the same simple intuition:

> **Prepare once. Reuse many times.**

---

# Don't Confuse Prefix Sum with Sliding Window

At first, these two techniques can look similar because both deal with subarrays.

But they solve different kinds of problems.

**Sliding Window**

```text
Window moves

[2 4 1]

↓

[4 1 7]

↓

[1 7 3]
```

Information changes continuously as the window moves.

**Prefix Sum**

```text
Prepare once

2   6   7   14   17
```

After preprocessing, you simply use the prepared information whenever you need it.

One maintains a moving range.

The other prepares cumulative information in advance.

---

# Common Beginner Mistakes

As you work through this section, try to avoid these common mistakes:

- Rebuilding sums even after creating a prefix array.
- Forgetting what each prefix value actually represents.
- Mixing up indices when extracting a range.
- Assuming Prefix Sum only works for addition.
- Using Prefix Sum when a simple traversal would already be sufficient.

The most important thing to remember is that **every prefix value includes everything before it.**

---

# Before You Start Solving Problems

Prefix Sum is one of those techniques that feels almost too simple at first. But don't underestimate it. Many interview problems become dramatically easier once you stop thinking about individual ranges and start thinking about cumulative information.

As you solve the upcoming problems, keep asking yourself:

> **"If I had already prepared some information about the array, would this question become easier?"**

That single question is the heart of Prefix Sum.

In the next section, you'll move away from individual elements and subarrays to something entirely different: **Intervals**. Instead of reasoning about values at specific indices, you'll begin thinking about ranges, how they overlap, and how sorting can reveal surprisingly elegant solutions.