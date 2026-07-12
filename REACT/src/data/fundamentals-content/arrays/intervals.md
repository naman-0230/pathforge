So far, almost every problem you've solved has focused on individual elements or contiguous subarrays. You cared about values, indices, or windows moving through an array.

In this section, your perspective changes completely.

Instead of looking at one element at a time, you'll start treating a range of values as a single object.

These ranges are called **intervals**, and many seemingly difficult problems become much easier once you stop thinking about individual numbers and start thinking about how these ranges interact with one another.

---

# Why This Section Exists

Imagine you're given a list of meetings.

```text
[1,3]
[2,6]
[8,10]
[15,18]
```

Each pair represents:

```text
[start, end]
```

Now someone asks:

> Can any meetings be merged?

Instead of comparing every individual number, notice that each meeting is already a continuous range.

The real question isn't:

> "Is 2 equal to 3?"

It's:

> "Do these two ranges overlap?"

That's the central idea behind interval problems.

---

# The Core Idea

Imagine every interval as a bar drawn on a timeline.

```text
1   2   3   4   5   6

[-------]
    [-----------]
```

Notice something.

The two intervals share part of the timeline.

Since they overlap, they can often be treated as one larger interval.

```text
1   2   3   4   5   6

[-------------------]
```

Now consider another example.

```text
1   2   3   4   5   6   7   8

[-----]

                  [------]
```

These intervals never touch.

There is nothing to merge.

Learning to recognize these situations is the foundation of this section.

---

# A New Way of Thinking

Until now, your thinking was often:

> "What should I do with this element?"

Now it becomes:

> "What is the relationship between these ranges?"

Instead of asking about numbers, you'll ask questions like:

- Do they overlap?
- Which interval starts first?
- Which one ends later?
- Can they be merged?
- Which interval should I keep?

This is a completely different style of reasoning compared to previous array topics.

---

# Why Sorting Becomes So Important

Imagine these intervals are given in random order.

```text
[8,10]
[1,3]
[15,18]
[2,6]
```

Can you immediately tell which ones overlap?

It's difficult.

Now sort them by their starting point.

```text
[1,3]
[2,6]
[8,10]
[15,18]
```

Suddenly, the pattern becomes much clearer.

Sorting brings intervals that might interact close to one another.

That's why many interval problems begin with one simple idea:

> **Sort first. Then process.**

As you solve the problems in this section, you'll notice this pattern again and again.

---

# Visualizing Overlap

### Completely Separate

```text
1 2 3 4 5 6 7 8

[---]

          [---]
```

No overlap.

### Partial Overlap

```text
1 2 3 4 5 6 7

[-------]

      [-------]
```

These intervals overlap.

### One Inside Another

```text
1 2 3 4 5 6 7

[---------------]

    [-----]
```

One interval is completely contained within the other.

### Touching Endpoints

```text
1 2 3 4 5

[-----]
      [-----]
```

Whether these count as overlapping depends on the problem statement, so always read the conditions carefully.

---

# What You'll Practice

The problems in this section will gradually teach you how to:

- identify overlapping intervals,
- merge intervals,
- insert a new interval into an existing list,
- remove overlaps,
- schedule intervals efficiently,
- determine how many intervals can coexist,
- combine intervals with sorting and heaps in more advanced problems.

You'll notice that although the stories change—meetings, bookings, trains, balloons, events—the underlying idea remains the same.

They're all interval problems.

---

# When Should Intervals Come to Mind?

As you read a problem, watch for clues like:

- ✅ The input is given as **[start, end]** pairs.
- ✅ The problem talks about meetings, schedules, bookings, appointments, events, or time ranges.
- ✅ You're asked whether ranges overlap.
- ✅ You need to merge or insert ranges.
- ✅ Sorting the ranges seems like it might simplify the problem.

If you notice these patterns, there's a good chance you're dealing with an interval problem.

---

# Don't Focus on the Story

One of the biggest traps in interval problems is getting distracted by the scenario.

One question might talk about meetings.

Another might talk about train schedules.

Another might talk about balloons.

Another might talk about projects.

The story changes.

The intervals don't.

Always translate the problem into simple ranges first.

For example:

**Meeting A**

```text
9:00 → 10:30
```

becomes

```text
[9, 10.5]
```

Once everything is represented as intervals, the solution often becomes much easier to recognize.

---

# Common Beginner Mistakes

As you solve this section, watch out for these common mistakes:

- Comparing every interval with every other interval before considering sorting.
- Forgetting that sorting often reveals the solution.
- Focusing on individual values instead of entire ranges.
- Misunderstanding what counts as an overlap.
- Getting distracted by the story instead of recognizing the interval pattern.

Remember, interval problems are rarely about meetings or schedules—they're about relationships between ranges.

---

# Before You Start Solving Problems

Intervals introduce a new style of thinking. Instead of processing values one by one, you'll begin reasoning about entire segments and how they interact. At first, drawing intervals on paper can make a huge difference. Visualizing overlaps is often much easier than trying to imagine them mentally.

As you work through the problems, keep asking yourself:

> **"What happens when these two intervals meet?"**

That question is at the heart of almost every interval problem.

The next section brings you back to searching—but with a completely different mindset. In **Binary Search**, you'll learn how a sorted array allows you to repeatedly eliminate half of the remaining search space, turning what could be a long search into a remarkably efficient one.