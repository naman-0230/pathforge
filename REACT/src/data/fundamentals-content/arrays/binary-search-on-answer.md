You've just learned how Binary Search repeatedly eliminates half of a sorted array until the desired element is found.

Now it's time to use the same idea in a completely different way.

In this section, you won't be searching for an element inside an array.

Instead, you'll be searching for the best possible answer.

At first, this sounds strange.

> "How can I binary search something that doesn't even exist in the array?"

That's exactly the new idea you'll learn here.

---

# Why This Section Exists

Imagine you're given several piles of bananas.

```text
30   11   23   4   20
```

You're asked:

> What's the minimum eating speed needed to finish all bananas within 6 hours?

Notice something.

The answer isn't one of the pile sizes.

It isn't stored anywhere in the array.

You're trying to discover the correct speed.

This is very different from normal Binary Search.

---

# The Core Idea

Suppose we start guessing.

Maybe the answer is:

```text
Speed = 1
```

Can we finish in time?

No.

Try again.

```text
Speed = 100
```

Can we finish?

Definitely yes.

So now we know something interesting.

```text
1      ❌

100    ✅
```

Some answers work.

Some answers don't.

Instead of searching the array, we're searching through possible answers.

---

# Visualizing the Search Space

Imagine every possible eating speed.

```text
1 2 3 4 5 6 7 8 9 10 ... 100
```

Suppose we test several values.

```text
1   ❌

2   ❌

3   ❌

4   ❌

5   ✅

6   ✅

7   ✅

8   ✅
```

Notice the pattern.

Once a speed becomes fast enough...

Everything larger also works.

```text
❌ ❌ ❌ ❌ ✅ ✅ ✅ ✅ ✅ ✅
```

That boundary is exactly what Binary Search is excellent at finding.

---

# The Biggest Mindset Shift

In normal Binary Search, your thinking was:

> "Is this the value I'm looking for?"

Now your thinking becomes:

> "If I choose this answer, does it work?"

You're no longer searching for an element.

You're testing a candidate answer.

That's why many people call the checking function:

```text
isPossible(...)
```

or

```text
canFinish(...)
```

or

```text
isValid(...)
```

You're not asking:

> "Is this correct?"

You're asking:

> "Is this answer possible?"

---

# Guess → Check → Eliminate

Almost every Binary Search on Answer problem follows the same cycle.

### Step 1

Guess an answer.

```text
Mid = 25
```

### Step 2

Check whether it works.

```text
Can we finish within 6 hours?

YES
```

### Step 3

Use that result to eliminate half the search space.

If it works,

> Maybe an even smaller answer also works.

If it doesn't,

> We must try larger answers.

Repeat until only one answer remains.

---

# Why Binary Search Works Here

This technique only works because the possible answers usually follow a predictable pattern.

Imagine this graph.

```text
Answer

1 ❌

2 ❌

3 ❌

4 ❌

5 ✅

6 ✅

7 ✅

8 ✅
```

There's a clear boundary.

Everything before it fails.

Everything after it succeeds.

This kind of behavior is called **monotonic**.

You don't need to memorize the word.

Just remember the picture.

Once the answer changes from ❌ to ✅, it never changes back.

That's exactly why Binary Search can find the boundary efficiently.

---

# What You'll Practice

The problems in this section often ask you to:

- minimize the maximum,
- maximize the minimum,
- find the smallest valid answer,
- find the largest possible value,
- distribute work,
- allocate resources,
- divide objects into groups,
- determine the minimum capacity needed.

Although the stories change, the underlying idea stays the same.

You're always searching through possible answers, not array elements.

---

# When Should Binary Search on Answer Come to Mind?

As you read a problem, watch for clues like:

- ✅ Minimize the maximum...
- ✅ Maximize the minimum...
- ✅ Smallest possible...
- ✅ Largest possible...
- ✅ Minimum capacity...
- ✅ Maximum distance...
- ✅ Can we complete the task if...?

Whenever you're optimizing some value and can efficiently check whether a candidate answer works, Binary Search on Answer becomes a strong possibility.

---

# Don't Search the Array

One of the biggest beginner mistakes is trying to find the answer directly inside the input.

Remember.

The answer often isn't stored anywhere.

For example:

### Books

```text
12 34 67 90
```

Question:

> Minimum pages a student must read.

The answer isn't necessarily

```text
12

34

67

90
```

It could be

```text
113
```

or

```text
102
```

or some completely different value.

You're searching the answer space, not the array.

---

# Common Beginner Mistakes

As you solve this section, try to avoid these common mistakes:

- Looking for the answer inside the array.
- Forgetting to write a function that checks whether an answer is possible.
- Using Binary Search without first identifying the valid search range.
- Assuming every optimization problem can use Binary Search.
- Memorizing templates instead of understanding the monotonic pattern.

Remember, Binary Search on Answer is really about finding the boundary between answers that don't work and answers that do.

---

# Before You Start Solving Problems

This section is often where Binary Search truly "clicks." Once you stop thinking of it as a way to search arrays and start thinking of it as a way to search possibilities, an entirely new category of problems becomes accessible.

As you work through the roadmap, keep asking yourself:

> **"If I guess an answer, can I quickly tell whether it's possible?"**

If the answer is yes, and the possible answers form a clear ❌ → ✅ (or ✅ → ❌) pattern, there's a good chance Binary Search on Answer is exactly the tool you need.

The next section shifts away from searching and introduces **Sorting & Greedy**, where you'll learn how making the best local decision at each step can often lead to the best overall solution—but only when the problem has the right structure.