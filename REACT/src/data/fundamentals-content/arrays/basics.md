By now, you should be comfortable reading an array, traversing it from beginning to end, and performing simple operations like finding the maximum value, counting occurrences, or updating elements. Those skills form the foundation of everything you'll do with arrays.

In this section, you'll take the next step. Instead of simply observing an array, you'll start changing it. You'll learn that many problems aren't about finding an answer—they're about rearranging the array itself.

Why This Section Exists

Imagine someone gives you an array and asks:

Rotate it to the right by 3 positions.
Move all the zeroes to the end.
Find the missing number.
Place every number where it belongs.
Rearrange the elements in a specific way.

Notice something?

None of these problems ask you to calculate a value like the maximum or minimum. Instead, they ask you to transform the array.

That's exactly what this section is about.

You'll start thinking of the array as something you can reorganize, not just read.

The Core Idea

Until now, you've mostly followed a simple pattern:

Read → Process → Move Forward

In this section, that changes.

Sometimes you'll need to:

swap elements,
shift elements,
reverse part of an array,
rotate the entire array,
or place numbers into their correct positions.

The array becomes something you actively manipulate.

A Different Way to Think

Imagine your array is a bookshelf.

Right now, the books are scattered randomly.

[C] [A] [E] [B] [D]

Your job isn't to count the books.

It's to rearrange them.

Sometimes you'll move one book.

Sometimes you'll swap two books.

Sometimes you'll rotate the entire shelf.

Sometimes you'll keep moving books until every book reaches the correct place.

Many problems in this section are simply different versions of this idea.

What Changes in Your Thinking?

In the previous section, your main question was:

"What does this element tell me?"

Now your question becomes:

"Where should this element be?"

That small change makes a huge difference.

Instead of treating every element independently, you'll begin thinking about the relationship between an element and its correct position.

This idea appears again and again throughout array problems.

What You'll Practice

As you solve the problems in this section, you'll encounter situations where you need to:

reverse parts of an array,
rotate arrays,
move certain values to one side,
swap elements,
rearrange values into their correct positions,
detect missing or duplicate values using positions,
work with indices more carefully than before.

At first, these operations may feel mechanical. Over time, they'll become second nature.

The Importance of Indices

In the previous section, the index mainly helped you access an element.

Now, the index becomes part of the solution itself.

Many problems can be solved by asking questions like:

Where should this value be?
Is this value already in the correct position?
If not, what should I swap it with?

For example, imagine this array:

Index

0  1  2  3

3  1  4  2

Instead of thinking:

"The first value is 3."

Start thinking:

"Should 3 really be at index 0?"

That shift in perspective unlocks many elegant solutions.

Not Every Problem Needs Extra Memory

One of the biggest lessons in this section is that you don't always need another array to solve a problem.

A beginner's instinct is often:

"I'll create a new array."

Sometimes that's perfectly fine.

But many problems can be solved by carefully modifying the original array itself.

This is called solving a problem in-place.

You'll see this phrase often in interviews.

Don't worry too much about the terminology yet. Just remember the idea:

Whenever possible, try using the existing array instead of creating another one.

Don't Be Afraid of Swapping

You'll perform a lot of swaps in this section.

At first, swapping can feel confusing because changing one value affects another.

A good habit is to visualize every swap.

Before:

7  2  5  1

Swap 7 and 2

After:

2  7  5  1

Watching the array change step by step makes these problems much easier to understand than trying to imagine everything in your head.

What This Section Is Not About

As you solve more problems, you might notice that some solutions online use techniques like:

Hash Maps
Two Pointers
Sliding Window

You don't need those here.

This section is designed to strengthen your understanding of arrays themselves.

Whenever a straightforward manipulation works, prefer that over introducing a more advanced technique.

You'll learn those optimizations later, one at a time.

How to Approach These Problems

When you read a question, don't immediately think about the final answer.

Instead, ask yourself:

What is the array supposed to look like when I'm done?
Which elements are in the wrong place?
Can I move an element directly where it belongs?
Can one swap fix the problem?
Can reversing or rotating part of the array achieve the desired result?

These questions often lead you to the solution naturally.

Common Beginner Mistakes

As you work through this section, keep an eye out for these common pitfalls:

Focusing only on the values and forgetting about their positions.
Swapping elements without checking whether the swap is actually needed.
Creating extra arrays when the problem expects an in-place solution.
Losing track of how earlier modifications affect later elements.
Assuming there's only one correct way to rearrange an array.

Don't worry if these mistakes happen—they're a normal part of learning array manipulation.

Before You Start Solving Problems

This section is where arrays begin to feel interactive. You'll stop treating them as static collections of numbers and start thinking of them as structures you can reshape to achieve a goal.

As you solve each problem, pay attention to how the array changes after every operation. If you can clearly visualize those changes, you'll build an intuition that will help not only in later array topics, but also in linked lists, trees, heaps, and many other data structures where rearranging data is a core skill.

The next section introduces your first major optimization technique: Hashing. Until now, you've mainly relied on traversing arrays. Soon, you'll learn how storing information about what you've already seen can dramatically reduce unnecessary work.