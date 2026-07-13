Until now, you've solved problems by moving through an array one element at a time. Sometimes you optimized with hashing, sometimes with two pointers, and sometimes by preprocessing information.

In this section, you'll learn a completely different way of thinking.

Instead of asking,

> "Which element should I check next?"

you'll start asking,

> "Which half of the array can I completely ignore?"

That's the heart of **Binary Search**.

Rather than gradually searching through an array, Binary Search repeatedly cuts the search space in half, making it one of the fastest searching techniques you'll learn.

---

# Why This Section Exists

Imagine you're searching for the number **73** inside a sorted array.

```text
2   8   15   21   34   48   57   73   89   95
```

One approach is to start from the beginning.

```text
2  ❌

8  ❌

15 ❌

21 ❌

...
```

Eventually you'll find **73**.

But notice something.

Every element before **73** had to be checked.

Now ask yourself.

The array is already sorted.

Can we use that information instead of checking every number?

That's exactly why Binary Search exists.

---

# The Core Idea

Imagine opening a dictionary.

Suppose you're looking for the word:

> **Monkey**

Would you start from page 1?

Of course not.

You'd open somewhere near the middle.

If the middle page contains words beginning with **H**, you instantly know:

> Everything before **H** can be ignored.

If the middle page contains words beginning with **T**, you know:

> Everything after **T** can be ignored.

Every decision eliminates about half the remaining pages.

That's exactly how Binary Search works.

The array is your dictionary.

The middle element helps you decide which half can never contain the answer.

---

# Visualizing the Search

Suppose our array is

```text
2   5   8   12   18   23   31   42   56   70   81
```

Find **42**.

### Step 1

```text
2   5   8   12   18   23   31   42   56   70   81
L                                R

             M = 23
```

Compare.

```text
42 > 23
```

Everything before **23** can be discarded.

```text
❌ ❌ ❌ ❌ ❌ 23 31 42 56 70 81
```

### Step 2

Search only the remaining half.

```text
31   42   56   70   81
L              R

     M = 56
```

Compare.

```text
42 < 56
```

Everything after **56** can be ignored.

```text
31   42   56 ❌ ❌
```

### Step 3

```text
31   42
L   R

M = 42
```

Found.

Notice what happened.

We never looked at most of the array.

Instead, we kept throwing away large portions.

---

# A New Way of Thinking

Before this section, your instinct may have been:

> "Let's keep searching until we find it."

Now your thinking becomes:

> "Can I prove that half of the remaining elements are impossible?"

That's the entire philosophy of Binary Search.

Every comparison should eliminate a large part of the search space.

If your comparison doesn't eliminate anything, you're probably not using Binary Search correctly.

---

# Why Sorting Matters

Binary Search only works because the data is ordered.

Suppose the array were:

```text
23   5   81   12   42   8   70
```

Looking at the middle tells you nothing.

If the middle is **12**, can you ignore everything before it?

No.

The value **42** could be anywhere.

The value **81** could be anywhere.

Without order, Binary Search loses its superpower.

Sorting gives meaning to every comparison.

---

# How the Search Space Shrinks

Instead of thinking about indices, imagine the search space itself getting smaller.

```text
Entire array

████████████

↓

Half remaining

██████

↓

Half again

███

↓

One element

█
```

Every comparison cuts the remaining work roughly in half.

That's why Binary Search is so fast.

---

# It's Not Just About Finding Numbers

Many beginners think Binary Search is only used for questions like:

> Find target **X**.

That's only the beginning.

You'll soon encounter problems like:

- Find the first occurrence.
- Find the last occurrence.
- Find where an element should be inserted.
- Find the smallest element in a rotated array.
- Find a peak element.

The technique remains the same.

Only the condition changes.

---

# What You'll Practice

The problems in this section gradually introduce:

- classic Binary Search,
- finding boundaries,
- duplicates,
- insertion positions,
- rotated arrays,
- peak finding,
- searching in special sorted structures.

Although the questions look different, they all rely on the same principle:

> **Use one comparison to eliminate half the search space.**

---

# When Should Binary Search Come to Mind?

As you read a problem, watch for clues like:

- ✅ The input is sorted.
- ✅ You're searching for a value.
- ✅ You need the first or last occurrence.
- ✅ You're looking for an insertion position.
- ✅ Every comparison seems capable of eliminating many possibilities.

Whenever you can confidently throw away half the remaining search space, Binary Search should become one of your first ideas.

---

# Don't Memorize the Code

Many beginners memorize:

```cpp
while(left <= right)
```

without understanding why the pointers move.

That's a mistake.

The important questions are:

- Why did I choose the middle?
- Which half can I safely discard?
- Why is that half guaranteed not to contain the answer?

If you can answer those questions, writing the code becomes much easier.

Focus on the reasoning first.

The syntax will naturally follow.

---

# Common Beginner Mistakes

As you solve this section, try to avoid these common mistakes:

- Using Binary Search on an unsorted array.
- Moving the wrong pointer after a comparison.
- Memorizing the template without understanding why it works.
- Thinking Binary Search only finds exact values.
- Forgetting that every comparison should eliminate half the remaining search space.

Remember, Binary Search isn't about finding the middle—it's about discarding the impossible half.

---

# Before You Start Solving Problems

Binary Search is one of the most fundamental techniques in DSA because it teaches you to think in terms of search spaces rather than individual elements. At first, draw the array, mark the left, middle, and right positions, and physically cross out the half you're eliminating. That simple habit builds the intuition much faster than memorizing code.

As you work through the upcoming problems, keep asking yourself:

> **"After this comparison, which half can I guarantee does not contain the answer?"**

If you can answer that confidently, you're already thinking like someone using Binary Search.

The next section, **Binary Search on Answer**, takes this idea one step further. Instead of searching for a value that already exists in the array, you'll learn how to binary search over the space of possible answers, turning many difficult optimization problems into elegant solutions.