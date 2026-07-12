Welcome to Arrays

If you're beginning Data Structures and Algorithms (DSA), you've started in the right place.

Almost every data structure you'll learn later—whether it's stacks, queues, heaps, hash tables, or even matrices—is built on the idea of storing and accessing data efficiently. Arrays are the simplest way to do that, which is why they form the foundation of almost every DSA journey.

At first glance, arrays might seem too simple to spend much time on. After all, they're just a collection of values stored together. But don't let that simplicity fool you. Many advanced interview problems are nothing more than clever ways of manipulating arrays.

This section isn't about learning difficult algorithms. It's about becoming comfortable with how arrays behave and developing the habit of thinking in terms of positions, indices, and traversals.

Why Do Arrays Matter?

Imagine you have the marks of 100 students.

Instead of creating 100 different variables:

marks1
marks2
marks3
...
marks100

you can simply store everything in one array.

[72, 89, 64, 91, 78, ...]

Each value has a fixed position called its index.

Index

 0   1   2   3   4
┌───┬───┬───┬───┬───┐
│72 │89 │64 │91 │78 │
└───┴───┴───┴───┴───┘

The index is just as important as the value itself.

As you solve more problems, you'll realize that interview questions rarely ask,

"What is this number?"

Instead, they ask,

"Where is this number?"

"Which numbers come before it?"

"Which numbers come after it?"

"Can you rearrange these positions efficiently?"

Learning to think about positions instead of just values is one of the biggest mindset shifts in DSA.

The Core Idea of This Section

Right now, don't worry about optimization.

Don't worry about fancy techniques.

Don't worry about solving hard problems.

Your only goal is to become comfortable performing basic operations on an array.

That means learning to:

look through an array from beginning to end,
access elements using their indices,
compare values,
update values,
count occurrences,
find maximums and minimums,
and gradually build confidence with loops.

These may seem like small skills, but almost every advanced array algorithm is built using these exact operations.

A New Way of Thinking

When beginners first see an array, they often think:

"It's just a list of numbers."

Instead, try thinking of it as a row of numbered boxes.

Index

 0   1   2   3   4

┌───┬───┬───┬───┬───┐
│ 5 │ 2 │ 9 │ 1 │ 7 │
└───┴───┴───┴───┴───┘

Every problem you solve in this section is really asking you to perform one (or more) of these actions:

Read from a box.
Write into a box.
Compare two boxes.
Move values between boxes.
Visit every box exactly once.

That's it.

Almost every array problem starts from these basic actions.

What You'll Practice

The problems in this section are intentionally straightforward.

They won't require any special techniques or hidden tricks.

Instead, they'll help you become comfortable with questions like:

How do I visit every element?
How do I keep track of the largest or smallest value?
How do I count something while traversing?
How do I update elements correctly?
How do I avoid going outside the array?

As you solve them, you'll notice that the same loop structure appears again and again. That's completely intentional. Repetition here builds habits that you'll rely on throughout the rest of the roadmap.

How to Think While Solving

When you start a problem, resist the urge to think about the "best algorithm."

Instead, ask yourself simple questions:

What information am I looking for?
Do I need to check every element?
Can I keep track of the answer while I move through the array?
Am I reading the array, modifying it, or both?
Which index am I currently working with?

If you can answer these questions clearly, you're already thinking like a programmer.

What You Should Not Worry About Yet

As you explore array problems, you might come across terms like:

Hashing
Two Pointers
Sliding Window
Prefix Sum
Binary Search

Don't worry if you don't know what these mean yet.

Those are separate sections later in the roadmap.

For now, solving a problem using a simple loop is completely fine. In fact, it's exactly what you're supposed to do.

Trying to force advanced techniques before understanding the basics often leads to confusion instead of improvement.

A Small Habit That Will Help You

Whenever you're stuck on an array problem, draw it.

Something as simple as this can make a huge difference:

Index

 0   1   2   3   4

┌───┬───┬───┬───┬───┐
│ 4 │ 7 │ 2 │ 9 │ 5 │
└───┴───┴───┴───┴───┘

Then move through the array one index at a time.

Visualizing the array often makes mistakes much easier to spot than staring at code.

Many experienced programmers still sketch arrays on paper before writing a solution.

Common Beginner Mistakes

Everyone makes mistakes when starting out, and that's part of learning. Here are a few to watch for:

Confusing an index with the value stored at that index.
Forgetting that arrays usually start indexing from 0.
Accidentally accessing an index that doesn't exist.
Writing complicated logic before understanding the problem.
Trying to memorize solutions instead of understanding what each loop is doing.

If you catch yourself making one of these mistakes, don't worry—it happens to almost everyone learning arrays for the first time.

Before You Start Solving Problems

This section isn't about speed.

It isn't about clever tricks.

It isn't about impressing interviewers.

It's about building a strong foundation.

Take your time. Read each problem carefully, trace your solution by hand if needed, and don't be discouraged if the first few questions feel slower than expected. Every section after this one builds on the habits you develop here.

Once you're comfortable reading, traversing, and reasoning about arrays, you'll be ready for the next section, where you'll begin manipulating arrays in more interesting ways through rotations, rearrangements, and indexing-based patterns.