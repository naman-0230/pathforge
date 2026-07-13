You've just learned the Two Pointers technique, where two indices move through an array together to solve problems more efficiently. In many of those problems, the pointers acted independently—each one moved based on its own logic.

In this section, you'll use those same two pointers in a different way.

Instead of thinking about two separate pointers, you'll start thinking about the range between them. That range is called a **window**, and as the pointers move, the window slides across the array.

This simple idea helps solve an entire family of problems involving subarrays and substrings much more efficiently.

---

# Why This Section Exists

Imagine someone asks you:

> Find the maximum sum of any subarray of size **3**.

Your first instinct might be:

- Take the first 3 elements and calculate their sum.
- Move one position forward and calculate the next 3.
- Repeat until the end.

Let's see what that actually looks like.

**Array:**

```text
2   4   1   7   3   6
```

**First subarray:**

```text
[2   4   1]  7   3   6
```

**Second subarray:**

```text
2  [4   1   7]  3   6
```

**Third subarray:**

```text
2   4  [1   7   3]  6
```

**Fourth subarray:**

```text
2   4   1  [7   3   6]
```

Now look carefully.

When we moved from the first window to the second...

```text
[2 4 1]
   ↓
[4 1 7]
```

Did we really get an entirely new subarray?

No.

Two elements were already there.

Only one element left and one new element entered.

We're repeating work unnecessarily.

Sliding Window was created to avoid exactly this repetition.

---

# The Core Idea

Imagine placing a transparent frame over part of the array.

```text
2   4   1   7   3   6

┌───────────┐
│ 2   4   1 │
└───────────┘
```

Now slide the frame one position.

```text
2   4   1   7   3   6

    ┌───────────┐
    │ 4   1   7 │
    └───────────┘
```

Slide again.

```text
2   4   1   7   3   6

        ┌───────────┐
        │ 1   7   3 │
        └───────────┘
```

Notice what happens every single time.

One value disappears.

```text
Removed → 2
```

One new value appears.

```text
Added → 7
```

That's it.

The window doesn't restart.

It simply slides.

---

# A New Way of Thinking

Before this section, your thinking was often:

> "Let's calculate this subarray."

Now it becomes:

> "I already know almost everything about the previous subarray. Can I update it instead of rebuilding it?"

That's the mindset behind Sliding Window.

Instead of solving every subarray from scratch, you reuse work you've already done.

---

# Meet Your Window

The two pointers now have a new role.

Instead of acting independently, they define the boundaries of the current window.

```text
2   4   1   7   3   6

   L    R
   │    │
   ▼    ▼

┌───────────┐
│ 4   1   7 │
└───────────┘
```

Everything between **L** and **R** is your current window.

Whenever one of these pointers moves, the window changes.

That's the only thing you need to keep track of.

---

# Fixed Window

Some problems always keep the same window size.

Example:

> Find the maximum sum of every **3** consecutive elements.

The window never grows.

It never shrinks.

It simply slides.

**Step 1**

```text
[2 4 1] 7 3 6
```

↓  

**Step 2**

```text
2 [4 1 7] 3 6
```

↓  

**Step 3**

```text
2 4 [1 7 3] 6
```

↓  

**Step 4**

```text
2 4 1 [7 3 6]
```

Every movement follows exactly the same pattern.

---

# Variable Window

Some problems don't tell you the window size.

Instead, they give you a condition.

For example:

- Longest subarray with sum ≤ **K**
- Longest substring without repeating characters
- Smallest subarray with sum ≥ **K**

Now the window changes size.

Sometimes it grows.

```text
L
↓

[2]

↓

[2 4]

↓

[2 4 1]

↓

[2 4 1 7]
```

Sometimes it becomes too large.

Then the left side starts moving.

**Before shrinking**

```text
[2 4 1 7]
```

↓

**Remove 2**

```text
[4 1 7]
```

↓

**Still too large?**

**Remove 4**

```text
[1 7]
```

The window is constantly expanding and shrinking until the required condition is satisfied.

Don't worry if this feels unfamiliar right now. The problems are ordered so you'll first master fixed windows, then gradually move to variable windows.

---

# When Should Sliding Window Come to Mind?

As you read a problem, look for clues like these:

- ✅ The problem talks about subarrays or substrings.
- ✅ You're asked to find the longest or shortest contiguous segment.
- ✅ The window size is fixed (for example, exactly **k** elements).
- ✅ You notice you're repeatedly calculating information for overlapping ranges.
- ✅ You feel like most of the previous computation could be reused.

These are strong signs that Sliding Window may be the right approach.

---

# Don't Confuse Sliding Window with Two Pointers

Sliding Window is built using two pointers, but not every Two Pointer problem is a Sliding Window problem.

Think of it this way:

**Two Pointers**

```text
L                     R
```

The pointers may move independently for different reasons.

**Sliding Window**

```text
L ─────────────── R
```

The focus is the entire region between them.

You're maintaining information about the current window, not just the positions of two pointers.

That's the key difference.

---

# Common Beginner Mistakes

As you solve problems in this section, try to avoid these common mistakes:

- Recalculating the entire window after every movement.
- Forgetting that neighboring windows overlap.
- Growing the window without knowing when to shrink it.
- Treating every subarray problem as a Sliding Window problem.
- Focusing only on the pointers instead of the window they define.

Remember, the goal isn't to move two pointers—it's to maintain a meaningful window efficiently.

---

# Before You Start Solving Problems

Sliding Window is one of the most useful patterns you'll encounter in DSA because it teaches you to reuse previous work instead of starting over. At first, don't worry about solving every problem optimally. Focus on understanding how the window changes as it moves through the array.

As you work through the roadmap, you'll notice that every Sliding Window problem revolves around the same idea:

> **"What changed when my window moved?"**

If you can answer that question, you're already thinking in the right direction.

The next section introduces **Prefix Sum**, another optimization technique that also avoids repeated computation. But instead of maintaining a moving window, you'll learn how to preprocess information once so that answering future range queries becomes almost effortless.