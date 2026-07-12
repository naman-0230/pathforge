So far, most of the techniques you've learned have been about finding the answer more efficiently.

- Hashing remembered information.
- Two Pointers reduced unnecessary comparisons.
- Sliding Window reused previous work.
- Binary Search eliminated half the search space.

In this section, you'll learn a different kind of problem.

Instead of searching for the answer, you'll often have to build the answer step by step.

At every step, you'll make a decision.

The big question becomes:

> **"Which choice should I make right now?"**

Sometimes, making the best choice at the current moment leads to the best overall solution.

This idea is called **Greedy**.

---

# Why This Section Exists

Imagine you have several coins.

```text
1

2

5

10
```

You need to make **₹18**.

One approach is to try every possible combination.

Eventually you'll find an answer.

But another approach is much simpler.

Take the largest coin first.

```text
18

↓

Take 10

Remaining = 8

↓

Take 5

Remaining = 3

↓

Take 2

Remaining = 1

↓

Take 1

Finished.
```

At every step, you simply made the best decision available.

That's the intuition behind greedy thinking.

---

# The Core Idea

Imagine climbing a mountain.

At every intersection, you choose the path that goes upward the fastest.

```text
Start

↗

↗

↗

Peak
```

Sometimes this works perfectly.

Sometimes it doesn't.

Greedy algorithms work exactly like this.

Instead of exploring every possible path, they commit to one decision immediately and never go back.

That makes them incredibly fast.

But it also makes them risky.

---

# A New Way of Thinking

Before this section, your instinct might have been:

> "Let's consider every possibility."

Now your thinking becomes:

> "Can I make one good decision now without needing to change it later?"

That's the key question behind every greedy problem.

If the answer is yes, a greedy solution may exist.

---

# Why Sorting Appears So Often

Suppose you're given these intervals.

```text
[8,10]

[1,3]

[2,6]

[15,18]
```

Making greedy decisions immediately is difficult.

Now sort them.

```text
[1,3]

[2,6]

[8,10]

[15,18]
```

Suddenly the next decision becomes much clearer.

This is why many greedy problems begin with one simple step:

> **Sort first. Decide later.**

Sorting organizes the information so that greedy choices become obvious.

You'll see this pattern repeatedly throughout the section.

---

# Greedy Doesn't Mean "Always Take the Biggest"

This is one of the most common misconceptions.

Greedy simply means:

> Choose the best option based on the information available right now.

Sometimes that means choosing the largest value.

Sometimes it means choosing the smallest.

Sometimes it means choosing the earliest finishing interval.

Sometimes it means choosing the shortest job.

The greedy choice depends entirely on the problem.

There isn't one universal greedy rule.

---

# When Greedy Fails

Here's an important lesson.

Not every problem can be solved greedily.

Imagine trying to reach exactly **6** using these numbers.

```text
4

3

3
```

If you always take the largest number first...

```text
Take 4

Remaining = 2
```

Now you're stuck.

But the correct solution is

```text
3 + 3
```

The greedy choice looked good at first, but it prevented the best overall solution.

This is why greedy algorithms are powerful—but they must be used carefully.

---

# What You'll Practice

The problems in this section gradually teach you how to:

- recognize when a greedy strategy is valid,
- identify the correct greedy choice,
- combine sorting with greedy decisions,
- schedule tasks efficiently,
- minimize or maximize values,
- solve interval-based greedy problems,
- think about local decisions leading to global results.

As you progress, you'll notice that many greedy problems are really about making one smart decision after another.

---

# When Should Greedy Come to Mind?

As you read a problem, look for clues like:

- ✅ You're asked to maximize or minimize something.
- ✅ You're making decisions one step at a time.
- ✅ Once a decision is made, it doesn't need to be changed.
- ✅ Sorting the input seems to simplify the decisions.
- ✅ The problem asks for an optimal arrangement or ordering.

These clues often suggest that a greedy solution might exist.

---

# Don't Force a Greedy Solution

One of the biggest beginner mistakes is assuming every optimization problem is greedy.

Remember.

Some problems require Dynamic Programming because a locally good decision doesn't always lead to the best final answer.

The hardest part of greedy algorithms isn't writing the code.

It's proving that your greedy choice is always safe.

As you work through this section, try to understand why each greedy decision works—not just what the decision is.

---

# Common Beginner Mistakes

As you solve these problems, try to avoid these common mistakes:

- Assuming greedy always means choosing the largest value.
- Forgetting to sort when the problem naturally requires ordering.
- Believing every optimization problem has a greedy solution.
- Memorizing greedy strategies from previous problems and applying them blindly.
- Focusing on the current choice without understanding why it leads to the optimal result.

Remember, greedy isn't about making random quick decisions—it's about making safe decisions that never need to be undone.

---

# Before You Start Solving Problems

Greedy algorithms are among the most satisfying techniques in DSA because a good greedy solution often feels beautifully simple. But they can also be deceptive. Two problems may look almost identical, yet one has a greedy solution while the other requires Dynamic Programming.

As you solve the upcoming problems, keep asking yourself:

> **"If I make this decision now, will I ever regret it later?"**

If the answer is no, you're probably on the right track.

The next section introduces **Heaps**, where you'll learn a new data structure designed to efficiently keep track of the smallest or largest elements. Many greedy algorithms become even more powerful when combined with a heap, allowing you to make optimal choices without repeatedly searching the entire array.